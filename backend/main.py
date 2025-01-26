from flask import Flask, request, jsonify
from openai import OpenAI
import networkx as nx
import matplotlib.pyplot as plt
import json
from graphviz import Digraph
from env import OPEN_AI_API_KEY
from plantuml import PlantUML
import os
from PyPDF2 import PdfReader
from werkzeug.utils import secure_filename

# Flask app configuration
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
ALLOWED_EXTENSIONS = {'pdf', 'txt'}

client = OpenAI(
    api_key=OPEN_AI_API_KEY
)

def ensure_static_folder():
    if not os.path.exists("static"):
        os.makedirs("static")

def allowed_file(filename):
    """Check if the uploaded file is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# For Network graph
def chat_with_gpt(PROMPT, MaxToken=5000, outputs=2, temperature=0.7):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=False,
        temperature=temperature,
        messages=[{"role": "user", "content": f"Extract entities and relationships from the following text. "
                    f"For relationships, standardise the use of 'source', 'target', relation'"
                    f"Format your response in STRICT JSON with the following structure: "
                    f"{{"
                    f"  \"entities\": [{{\"name\": <entity_name>, \"attributes\": [<attributes>]}}], "
                    f"  \"relationships\": [{{\"source\": <entity_name>, \"target\": <entity_name>, \"relation\": <relationship_type>}}] "
                    f"}}. "
                    f"The name and attributes should be specific to the context given by the input"
                    f"Respond in STRICT JSON format with 'entities' and 'relationships' keys only: {PROMPT}"}]
    )
    return response.choices[0].message.content

def chat_for_ERD(input_text, MaxToken=5000, outputs=2, temperature = 0.7):
    prompt = f"""
   Extract entities and relationships from the following text and represent them as an Entity-Relationship (ER) diagram using **PlantUML syntax**. 

    Brief Guidelines:
    - Identify entities and their attributes within `{{}}`.
    - The name and attributes should be specific to the context given by the input
    - Identify relationships between entities using connectors like:
        - `->` for basic relationships (e.g., "is related to", "belongs to", etc.).
        - `o->`, `<->`, or `o\\--` for more descriptive relationships with cardinality.
    - Avoid including unnecessary or generic entities
    - Ensure all unique entities and valid relationships are represented.
    - Ensure no repeated entities.
    - Follow correct PlantUML syntax. When using names in relationships, they must not be enclosed in quotes unless the names contain spaces
    - The diagram must be enclosed with `@startuml` and `@enduml` tags.

    Please respond with valid **PlantUML code only**, without additional explanations or text.
    
    user_input: {input_text}
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=False,
        temperature=temperature,
        messages=[{"role": "user", "content": prompt}]
    )
    
    initial_response = response.choices[0].message.content
    cleaned_response = initial_response.strip("```plantuml").strip("```")
    return cleaned_response

def generate_plant_uml_image(plantuml_code, output_file = "diagram.png"):
    """
    Generate an image from PlantUML code and save it to a file.
    """
    # Save the PlantUML code to a temporary file
    temp_file = "temp.puml"
    with open(temp_file, "w") as f:
        f.write(plantuml_code)

    # Initialize the PlantUML server
    plantuml = PlantUML(url="http://www.plantuml.com/plantuml/png/")
    
    # Generate the image
    plantuml.processes_file(temp_file, output_file)
    print(f"Diagram saved as {output_file}")

# Flask route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    print("Received a file upload request.")  # Debug log
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(file_path)
        print(f"File saved to {file_path}")  # Debug log

        try:
            # Process file content based on file type
            if file.filename.endswith('.pdf'):
                print("Processing as a PDF file.")
                # Extract text from PDF
                reader = PdfReader(file_path)
                file_content = ""
                for page in reader.pages:
                    file_content += page.extract_text()
                print("Extracted text from PDF.")  # Debug log
            else:
                print("Processing as a text file.")
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                print("File content read successfully.")  # Debug log

            # Process the file content with ChatGPT
            response = chat_with_gpt(file_content)
            print("Received response from ChatGPT.")  # Debug log

            entities, relationships = parse_gpt_response(response)
            erd_code = chat_for_ERD(file_content)
            print("Parsed response and generated ERD code.")  # Debug log

            # Generate visualizations
            ensure_static_folder()
            generate_network_graph(entities, relationships, output_file="static/network_graph.png")
            generate_plant_uml_image(erd_code, output_file="static/diagram.png")
            print("Generated visualizations.")  # Debug log

            return jsonify({
                "message": "File processed successfully",
                "entities": entities,
                "relationships": relationships,
                "network_graph_url": "/static/network_graph.png",
                "diagram_url": "/static/diagram.png"
            }), 200

        except Exception as e:
            print(f"Error during processing: {e}")  # Debug log
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file type"}), 400

# Parse GPT response
def parse_gpt_response(response):
    """Parses GPT response to extract entities and relationships."""
    try:
        cleaned_response = response.strip("```json").strip("```")
        data = json.loads(cleaned_response)  # Convert JSON format to python dictionary
        entities = data.get("entities", [])
        relationships = data.get("relationships", [])
        return entities, relationships
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", str(e))
        print("Raw response:", response)
        return [], []

# Generate network graph
def generate_network_graph(entities, relationships, output_file="static/network_graph.png"):
    """Generates a network graph from entities and relationships."""
    ensure_static_folder()  # Ensure the static folder exists

    G = nx.DiGraph()

    # Add entities as nodes using their 'name' field
    for entity in entities:
        G.add_node(entity["name"])

    # Add relationships as edges, using the keys from the response
    for relationship in relationships:
        G.add_edge(relationship["source"], relationship["target"], label=relationship["relation"])

    # Draw the graph
    pos = nx.kamada_kawai_layout(G)
    plt.figure(figsize=(12, 8))
    nx.draw(G, pos, with_labels=True, node_size=4000, node_color="skyblue", font_size=12, font_color="black",
            font_weight="bold", arrowsize=20)
    edge_labels = nx.get_edge_attributes(G, "label")
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color="red")

    # Save the graph as an image
    plt.savefig(output_file)
    plt.close()

# Run Flask or Interactive mode
if __name__ == "__main__":
    mode = input("Run in interactive mode? (yes/no): ").strip().lower()
    if mode == "yes":
        while True:
            user_input = input("You: ")
            if user_input.lower() in ["quit", "exit", "bye"]:
                print("Goodbye!")
                break
            
            response = chat_with_gpt(user_input)
            response_ERD = chat_for_ERD(user_input)
            print("chatbot: " + response)
            print("ERD ChatBot: " + response_ERD)
        
            try:
                entities, relationships = parse_gpt_response(response)
                generate_network_graph(entities, relationships)
                generate_er_diagram(entities, relationships)
                generate_plant_uml_image(response_ERD)

                print("Network graph and ER diagram generated successfully!")
            except Exception as e:
                print("Error in processing response:", str(e))
    else:
        app.run(debug=True)