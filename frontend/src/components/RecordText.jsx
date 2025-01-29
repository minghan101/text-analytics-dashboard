import React, { useState, useEffect } from "react";
import axios from "axios";
import { colors } from '../../assets/colors.js';
import { fonts } from '../../assets/fonts.js';

export const RecordText = ({ recordId, onClose }) => {  // Pass onClose as a prop to close the modal
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordId) return;

    const fetchText = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/get_record/${recordId}`); // Flask endpoint
        setText(response.data.record.Text);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch text for the record");
        setLoading(false);
      }
    };

    fetchText();
  }, [recordId]);

  if (!recordId) return <p>Please select a record to view its text.</p>;
  if (loading) return <p>Loading text...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Record Text</h1>
      <div style={styles.textContainer}>
        <p style={styles.text}>{text}</p>
      </div>
      <button onClick={onClose} style={styles.closeButton}>Close</button> {/* Close Button */}
    </div>
  );
};

// Styling
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.neonblue,
    fontFamily: fonts.Bold,
    marginBottom: '20px',
  },
  textContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: `1px solid ${colors.neonblue}`,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  text: {
    fontSize: '16px',
    color: '#333',
    fontFamily: fonts.Regular,
  },
  closeButton: {
    backgroundColor: colors.neonred,
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontFamily: fonts.Regular,
    fontSize: '14px',
    marginTop: '20px',
  },
};

export default RecordText;
