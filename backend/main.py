from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
import networkx as nx
import matplotlib
import matplotlib.pyplot as plt
import json
from graphviz import Digraph
from env import OPEN_AI_API_KEY, DB_URL
from plantuml import PlantUML
import os
from PyPDF2 import PdfReader
from werkzeug.utils import secure_filename
import pandas as pd
from excel_upload import upload_excels_to_db
from sqlalchemy import create_engine
from flask_cors import CORS

# Flask app configuration
app = Flask(__name__, static_folder="static")
CORS(app)  # enable CORS for all routes
app.config['UPLOAD_FOLDER'] = './uploads'
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'xlsx'}
matplotlib.use('Agg')

db_url = DB_URL

# Creating new OpenAI Object using API Key
client = OpenAI(
    api_key=OPEN_AI_API_KEY
)

# Endpoint to fetch all records from the database
@app.route('/get_records', methods=['GET'])
def get_records():
    try:
        # Connect to the database
        engine = create_engine(db_url)
        # Query to fetch all records
        query = "SELECT * FROM articles"
        df = pd.read_sql(query, engine)
        
        # Convert the DataFrame to JSON
        records = df.to_dict(orient="records")
        
        return jsonify({"records": records}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to fetch a specific record by its ID
@app.route('/get_record/<int:record_id>', methods=['GET'])
def get_record(record_id):
    try:
        # Connect to the database
        engine = create_engine(db_url)
        # Query to fetch the specific record by ID
        query = f"SELECT Text FROM articles WHERE id = {record_id}" #When user click on the record ID, they will select the text from recordID BEFORE parsing into chatgpt
        df = pd.read_sql(query, engine)
        
        if df.empty:
            return jsonify({"error": "Record not found"}), 404
        
        # Convert the DataFrame to JSON
        record = df.iloc[0].to_dict()
        
        return jsonify({"record": record}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def ensure_static_folder():
    if not os.path.exists("static"):
        os.makedirs("static")
        
@app.route('/static/<filename>')
def serve_static_files(filename):
    return send_from_directory(app.static_folder, filename)

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

# ERD Diagram bot
def chat_for_ERD(input_text, MaxToken=2000, outputs=2, temperature = 0.7):
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
    #cleaned_response = initial_response.strip("```plantuml").strip("```")
    cleaned_response = initial_response.replace("```plantuml", "").replace("```", "").strip()
    print(f"Generated PlantUML Code:\n{cleaned_response}")
    return cleaned_response

def generate_plant_uml_image(plantuml_code, output_file = "static/diagram.png"):
    """
    Generate an image from PlantUML code and save it to a file.
    """
    # Save the PlantUML code to a temporary file
    
    print("plantuml code:", plantuml_code)
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
        print("No 'file' key in request.files")  # Debug log
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    print(f"Filename: {file.filename}")  # Debug log
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        
        #Creating a directory for PDF and Excel files
        print("Creating folder in OS..")
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
                
                #Else if ends with .xlsx, pipe to excel_upload
            elif file.filename.endswith(".xlsx"):
                print("Processing Excel File.")
                #Uploads Excel File to MySQL Database
                upload_excel = upload_excels_to_db()
                print("File uploaded to database. Total File:" + str(upload_excel['total_files']))
                
            else:
                print("Processing as a text file.")
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                print("File content read successfully.")  # Debug log

            #Only text or PDF file can upload here
            if not file.filename.endswith(".xlsx"):
                # Process the file content with ChatGPT
                response = chat_with_gpt(file_content)
                print("Received response from ChatGPT.")  # Debug log

                entities, relationships = parse_gpt_response(response)
                erd_code = chat_for_ERD(file_content)
                print("Parsed response and generated ERD code.")  # Debug log

                # Generate visualizations
                ensure_static_folder()
                
                retries = 5
                success_ERD = False
                success_Network = False
                
                #Try for Network graph
                for attempt in range(retries):
                    try:
                        print(f"Attempt {attempt + 1} of {retries}...")

                        print("Generating network graph...")
                        generate_network_graph(entities, relationships)
                        
                        #Will only print this line onwards if generated correctly.
                        print("Diagram generated successfully.")
                        success_Network = True
                        break
                    except Exception as e:
                        print(f"Error in generating diagrams: {e}")
                        # If it's the last retry and still fails, we return the error response
                        #Create new output and go again
                        response = chat_with_gpt(user_input)
                        entities, relationships = parse_gpt_response(response)
                        if attempt == retries - 1:
                            return jsonify({"error": "Failed to generate Network diagrams after 5 attempts"}), 500
                        
                #Try for ERD
                for attempt in range(retries):
                    try:
                        print(f"Attempt {attempt + 1} of {retries}...")

                        print("Generating ERD...")
                        generate_er_diagram(entities, relationships)
                        generate_plant_uml_image(response_ERD)
                        
                        print("ER Diagram generated successfully.")
                        success_ERD = True
                        break
                    except Exception as e:
                        print(f"Error in generating diagrams: {e}")
                        # If it's the last retry and still fails, we return the error response
                        # Create new output and go again
                        response_ERD = chat_for_ERD(user_input)
                        entities, relationships = parse_gpt_response(response)
                        if attempt == retries - 1:
                            return jsonify({"error": "Failed to generate ER diagrams after 5 attempts"}), 500


                print("All diagrams generated successfully.")

                if success_ERD and success_Network:
                    print("Generated documents.")
                    return jsonify({
                        "entities": entities,
                        "relationships": relationships,
                        "network_graph_url": "/static/network_graph.png",
                        "diagram_url": "/static/diagram.png",
                    }), 200

            print("Excel file uploaded to database.")
        except Exception as e:
            print(f"Error during processing: {e}")  # Debug log
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file type"}), 400

# Parse GPT response
def parse_gpt_response(response):
    
    """Parses GPT response to extract entities and relationships."""
    try:
        cleaned_response = response.strip("```json").strip("```")
        # Try parsing JSON response
        data = json.loads(cleaned_response) #Convert JSON format to python dictionary
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
    print(f"Entities: {entities}")
    print(f"Relationships: {relationships}")
    G = nx.DiGraph()

    # Add entities as nodes using their 'name' field
    for entity in entities:
        print(f"Adding entity: {entity}")
        G.add_node(entity["name"])

    # Add relationships as edges, using the keys from the response
    for relationship in relationships:
        print(f"Adding relationship: {relationship}")
        G.add_edge(relationship["source"], relationship["target"], label=relationship["relation"])

    if not G.nodes:
        print("No nodes found in the graph!")
    if not G.edges:
        print("No edges found in the graph!")
        
    # Draw the graph
    pos = nx.kamada_kawai_layout(G)
    plt.figure(figsize=(12, 8))
    nx.draw(G, pos, with_labels=True, node_size=4000, node_color="skyblue", font_size=12, font_color="black",
            font_weight="bold", arrowsize=20)
    edge_labels = nx.get_edge_attributes(G, "label")
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color="red")
    print("graph drawn")

    # Save the graph as an image
    plt.savefig(output_file)
    plt.close()

def generate_er_diagram(entities, relationships, output_file="static/er_diagram.er"):
    """
    Generates an ER diagram schema in plain text format and saves it to a file.
    """
    ensure_static_folder()  # Ensure the static folder exists

    try:
        with open(output_file, "w") as f:
            # Write entities
            for entity in entities:
                f.write(f"[{entity['name']}]\n")
            
            # Write relationships
            for relationship in relationships:
                f.write(f"[{relationship['source']}] -- {relationship['relation']} --> [{relationship['target']}]\n")
        
        print(f"ER diagram saved to {output_file}")
    except Exception as e:
        print(f"Error generating ER diagram: {e}")
        raise

@app.route('/analyze', methods=['POST'])
def analyze_text():
    print("Endpoint reached...")  # endpoint reached
    
    retries = 5
    success_ERD = False
    success_Network = False
    
    try:
        data = request.json
        print(f"Received data: {data}")  # Log incoming data

        user_input = data.get("text", "")
        if not user_input:
            return jsonify({"error": "No text provided"}), 400

        print("Processing input with GPT...")
        
        #Process the inputs initially
        response = chat_with_gpt(user_input)  # Call GPT function
        response_ERD = chat_for_ERD(user_input)

        print(f"GPT response: {response}")
        print(f"GPT ERD response: {response_ERD}")

        # Parsing and generation
        print("Parsing GPT response...")
        entities, relationships = parse_gpt_response(response)

        #Try for Network graph
        for attempt in range(retries):
            try:
                print(f"Attempt {attempt + 1} of {retries}...")

                print("Generating network graph...")
                generate_network_graph(entities, relationships)
                
                #Will only print this line onwards if generated correctly.
                print("Diagram generated successfully.")
                success_Network = True
                break
            except Exception as e:
                print(f"Error in generating diagrams: {e}")
                # If it's the last retry and still fails, we return the error response
                #Create new output and go again
                response = chat_with_gpt(user_input)
                entities, relationships = parse_gpt_response(response)
                if attempt == retries - 1:
                    return jsonify({"error": "Failed to generate Network diagrams after 5 attempts"}), 500
                
        #Try for ERD
        for attempt in range(retries):
            try:
                print(f"Attempt {attempt + 1} of {retries}...")

                print("Generating ERD...")
                generate_er_diagram(entities, relationships)
                generate_plant_uml_image(response_ERD)
                
                print("ER Diagram generated successfully.")
                success_ERD = True
                break
            except Exception as e:
                print(f"Error in generating diagrams: {e}")
                # If it's the last retry and still fails, we return the error response
                # Create new output and go again
                response_ERD = chat_for_ERD(user_input)
                entities, relationships = parse_gpt_response(response)
                if attempt == retries - 1:
                    return jsonify({"error": "Failed to generate ER diagrams after 5 attempts"}), 500


        print("All diagrams generated successfully.")

        if success_ERD and success_Network:
            print("Generated documents.")
            return jsonify({
                "entities": entities,
                "relationships": relationships,
                "network_graph_url": "/static/network_graph.png",
                "diagram_url": "/static/diagram.png",
            }), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error in the console
        return jsonify({"error": str(e)}), 500

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