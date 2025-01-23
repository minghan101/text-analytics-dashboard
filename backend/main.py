from openai import OpenAI
import networkx as nx
import matplotlib.pyplot as plt
import json
from graphviz import Digraph
from env import OPEN_AI_API_KEY

client = OpenAI(
  api_key= OPEN_AI_API_KEY
)

def chat_with_gpt(PROMPT, MaxToken=5000, outputs=2, temperature = 1):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        temperature=temperature,
        messages=[{"role": "user", "content": f"Extract entities and relationships from the following text. "
                f"For relationships, standardise the use of 'source', 'target', relation'"
                f"Respond in STRICT JSON format with 'entities' and 'relationships' keys only: {PROMPT}"}]
    )
    return response.choices[0].message.content



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
        print("chatbot: " + response)
    
    # Parse response
        try:
            entities, relationships = parse_gpt_response(response)
            print(entities)
            print(relationships)
            
            # Generate visualizations
            generate_network_graph(entities, relationships)
            generate_er_diagram(entities, relationships)

            print("Network graph and ER diagram generated successfully!")
        except Exception as e:
            print("Error in processing response:", str(e))

