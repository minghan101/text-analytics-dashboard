import React, { useState, useEffect } from "react";
import { colors } from '../../assets/colors.js'; 
import { fonts } from '../../assets/fonts.js';

export const DiagramsViewer = () => {
  const [diagramUrl, setDiagramUrl] = useState(null);
  const [networkGraphUrl, setNetworkGraphUrl] = useState(null);

  useEffect(() => {
    // Set the URLs for the images, these should point to your Flask backend static route
    setDiagramUrl("http://127.0.0.1:5000/static/diagram.png");
    setNetworkGraphUrl("http://127.0.0.1:5000/static/network_graph.png");
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generated Diagrams</h1>
      <div style={styles.content}>
        {/* Display Diagram.png */}
        <div style={styles.imageContainer}>
          <h2 style={styles.imageTitle}>Diagram</h2>
          <img
            src={diagramUrl}
            alt="Diagram"
            style={styles.image}
          />
        </div>

        {/* Display Network Graph */}
        <div style={styles.imageContainer}>
          <h2 style={styles.imageTitle}>Network Graph</h2>
          <img
            src={networkGraphUrl}
            alt="Network Graph"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

// Styling
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: fonts.Bold,
    color: '#4c6ef5', // You can customize the color
    marginBottom: '30px',
  },
  content: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1200px',
    width: '100%',
  },
  imageContainer: {
    textAlign: 'center',
  },
  imageTitle: {
    fontSize: '20px',
    fontFamily: fonts.Bold,
    fontWeight: '600',
    color: colors.neonpink,
    marginBottom: '10px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default DiagramsViewer;
