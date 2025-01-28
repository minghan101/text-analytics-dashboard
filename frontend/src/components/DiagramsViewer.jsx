import React, { useState, useEffect } from "react";

export const DiagramsViewer = () => {
  const [diagramUrl, setDiagramUrl] = useState(null);
  const [networkGraphUrl, setNetworkGraphUrl] = useState(null);

  useEffect(() => {
    // Set the URLs for the images, these should point to your Flask backend static route
    setDiagramUrl("http://127.0.0.1:5000/static/diagram.png");
    setNetworkGraphUrl("http://127.0.0.1:5000/static/network_graph.png");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-6">Generated Diagrams</h1>
      <div className="flex flex-col space-y-6 items-center bg-white p-6 rounded-lg shadow-md w-3/4">
        {/* Display Diagram.png */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Diagram</h2>
          <img
            src={diagramUrl}
            alt="Diagram"
            className="max-w-full border border-gray-300 rounded-lg"
          />
        </div>

        {/* Display Network Graph */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Network Graph</h2>
          <img
            src={networkGraphUrl}
            alt="Network Graph"
            className="max-w-full border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
