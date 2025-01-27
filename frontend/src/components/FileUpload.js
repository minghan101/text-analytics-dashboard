import React, { useState } from 'react';
import { colors } from '../../assets/colors.js'; // Ensure this file exists
import { fonts } from '../../assets/fonts.js'; // Ensure this file exists

const FileUpload = () => {
  const [files, setFiles] = useState([]); // Store multiple files
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]); // Store URLs for each uploaded file

  const fileInputRef = React.createRef(); // Reference to the file input field

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    setFiles(selectedFiles);
    setMessage('');
    setUrls([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select files first!');
      return;
    }

    setMessage('');
    setLoading(true);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file); // Append each file with a unique key
    });

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Display server response message
        setUrls(data.file_urls || []); // Assume server returns an array of URLs
        console.log('Response:', data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error); // Display error message
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickUploadArea = () => {
    // Trigger file input click when upload area is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={styles.container}>
      {/* File Selection Area */}
      <div
        style={styles.uploadArea}
        onClick={handleClickUploadArea} // Trigger file input on click
      >
        <input
          type="file"
          ref={fileInputRef} // Reference to the file input
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          multiple // Allow multiple file selection
          style={styles.fileInput} // Hide the file input
        />
        <p style={styles.instructions}>Drag and drop files here, or click to select files.</p>
      </div>

      {/* Preview of Selected Files */}
        {files.length > 0 && (
    <div style={styles.previewContainer}>
      <h4 style={{ fontFamily: fonts.Bold }}> {/* Apply custom font */}
        {files.length === 1 ? 'Selected File:' : 'Selected Files:'}
      </h4>
      <ul>
        {files.map((file, index) => (
          <li key={index} style={{ fontFamily: fonts.Regular }}> {/* Apply custom font */}
            <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </li>
        ))}
      </ul>
    </div>
  )}

      {/* Submit Button */}
      <div
        style={{
          ...styles.customButton,
          backgroundColor: loading ? '#ccc' : colors.neongreen,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        onClick={handleSubmit}
      >
        <p
          style={{
            ...styles.buttonText,
            fontFamily: fonts.Regular,
          }}
        >
          {loading ? 'Uploading...' : 'Submit'}
        </p>
      </div>

      {/* Response Message */}
      {message && <p>{message}</p>}

      {/* Display Uploaded File URLs */}
      {urls.length > 0 && (
        <div>
          <h4>Uploaded Files:</h4>
          <ul>
            {urls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View File {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    textAlign: 'center',
    margin: '20px',
  },
  uploadArea: {
    border: '2px dashed #6200ea',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    width: '70%', // Wider upload area
    height: '150px',
    margin: '0 auto 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer', // Change cursor to indicate clickable area
  },
  fileInput: {
    display: 'none', // Completely hide the file input field
  },
  instructions: {
    fontSize: '16px',
    fontFamily: fonts.Regular,
    color: '#666',
  },
  previewContainer: {
    textAlign: 'left',
    margin: '20px auto',
    width: '80%', // Make the preview container wider
    maxWidth: '800px', // Ensure it doesn't grow too large
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '8px',
  },
  customButton: {
    padding: '5px 5px', // Smaller button size
    borderRadius: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px', // Smaller width for the button
    margin: '10px auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: '15px', 
  },
};

export default FileUpload;
