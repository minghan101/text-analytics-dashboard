from openai import OpenAI
import networkx as nx
import matplotlib.pyplot as plt
import json
from graphviz import Digraph
from env import OPEN_AI_API_KEY
from plantuml import PlantUML

client = OpenAI(
  api_key= OPEN_AI_API_KEY
)

def chat_with_gpt(PROMPT, MaxToken=5000, outputs=2, temperature = 0.7):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=False,
        temperature=temperature,
        messages=[{"role": "user", "content": f"Extract entities and relationships from the following text. "
                f"For relationships, standardise the use of 'source', 'target', relation'"
                f"Respond in STRICT JSON format with 'entities' and 'relationships' keys only: {PROMPT}"}]
    )
    return response.choices[0].message.content

def chat_for_ERD(input_text, MaxToken=5000, outputs=2, temperature = 0.7):
    prompt = f"""
   Extract entities and relationships from the following text and represent them as an Entity-Relationship (ER) diagram using **PlantUML syntax**. 

    Brief Guidelines:
    - Identify entities and their attributes within `{{}}`.
    - Identify relationships between entities using connectors like:
        - `->` for basic relationships (e.g., "is related to", "belongs to", etc.).
        - `o->`, `<->`, or `o\\--` for more descriptive relationships with cardinality.
    - Avoid including unnecessary or generic entities
    - Ensure all unique entities and valid relationships are represented.
    - Follow correct PlantUML syntax
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

def generate_network_graph(entities, relationships, output_file="network_graph.png"):
    """Generates a network graph from entities and relationships."""
    G = nx.DiGraph()

    # Add entities as nodes using their 'name' field
    for entity in entities:
        G.add_node(entity["name"])

    # Add relationships as edges, using the keys from the response
    for relationship in relationships:
        G.add_edge(relationship["source"], relationship["target"], label=relationship["relation"])

    # Draw the graph
    pos = nx.spring_layout(G)
    plt.figure(figsize=(12, 8))
    nx.draw(G, pos, with_labels=True, node_size=4000, node_color="skyblue", font_size=12, font_color="black", font_weight="bold", arrowsize=20)
    edge_labels = nx.get_edge_attributes(G, "label")
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color="red")

    # Save the graph as an image
    plt.savefig(output_file)
    plt.close()

# NEED TO PARSE THROUGH CHAT AGAIN. NOW HARDCODED, YET TO ADJUST
def generate_er_diagram(entities, relationships, output_file="er_diagram.er"):
    """Generates an ER diagram schema."""
    with open(output_file, "w") as f:
        # Write entities
        for entity in entities:
            f.write(f"[{entity}]\n")
        
        # Write relationships
        for relationship in relationships:
            f.write(f"[{relationship['source']}] -- {relationship['relation']} --> [{relationship['target']}]\n")


if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            print("Goodbye!")
            break
        
        response = chat_with_gpt(user_input)
        response_ERD = chat_for_ERD(user_input)
        print("chatbot: " + response)
        print("ERD ChatBot: " + response_ERD)
    
    # Parse response
        try:
            entities, relationships = parse_gpt_response(response)
            #print(entities)
            #print(relationships)
            
            # Generate visualizations
            generate_network_graph(entities, relationships)
            generate_er_diagram(entities, relationships)
            generate_plant_uml_image(response_ERD)
            

            print("Network graph and ER diagram generated successfully!")
        except Exception as e:
            print("Error in processing response:", str(e))

