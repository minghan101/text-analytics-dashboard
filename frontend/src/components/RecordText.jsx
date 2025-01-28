// RecordText.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export const RecordText = ({ recordId }) => {
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
    <div>
      <h1>Record Text</h1>
      <p className="bg-gray-100 p-4 border border-gray-300 rounded">{text}</p>
    </div>
  );
};
