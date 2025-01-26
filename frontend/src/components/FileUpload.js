import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState({ networkGraph: '', diagram: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first file selected
    if (selectedFile) {
      console.log('Selected File:', selectedFile.name); // Log file name
      setFile(selectedFile);
      setMessage('');
      setUrls({ networkGraph: '', diagram: '' });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setMessage(''); // Clear previous messages
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Display server response message
        setUrls({
          networkGraph: data.network_graph_url, // Network graph URL
          diagram: data.diagram_url, // ER diagram URL
        });
        console.log('Response:', data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error); // Display error message
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      {/* File Selection */}
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      {file && (
        <p>
          <strong>Selected File:</strong> {file.name}
        </p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#6200ea',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Uploading...' : 'Submit'}
      </button>

      {/* Response Message */}
      {message && <p>{message}</p>}

      {/* Display URLs */}
      {urls.networkGraph && (
        <p>
          <a href={urls.networkGraph} target="_blank" rel="noopener noreferrer">
            View Network Graph
          </a>
        </p>
      )}
      {urls.diagram && (
        <p>
          <a href={urls.diagram} target="_blank" rel="noopener noreferrer">
            View ER Diagram
          </a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;