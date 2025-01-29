import React, { useState } from 'react';
import { colors } from '../../assets/colors.js'; 
import { fonts } from '../../assets/fonts.js';

const FileUpload = () => {
  const [files, setFiles] = useState([]); // Store multiple files
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]); // Store URLs for each uploaded file

  const fileInputRef = React.createRef(); // Reference to the file input field

  // Handle the file selection from both drag-and-drop and file input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    setFiles(selectedFiles);
    setMessage('');
    setUrls([]);
  };

  // Handle the drag-over event (to allow dropping)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // You can add any styling for drag over here if you want
  };

  // Handle the drop event (when files are dropped)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedFiles = Array.from(e.dataTransfer.files); // Get dropped files
    setFiles(selectedFiles);
    setMessage('');
    setUrls([]);
  };

  // Handle submit button click
  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select files first!');
      return;
    }

    setMessage('');
    setLoading(true);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('file', file); // Use the same key 'file' for all uploads
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
    <div
      style={styles.container}
      onDragOver={handleDragOver} // Add drag over listener
      onDrop={handleDrop} // Add drop listener
    >
      {/* File Selection Area */}
      <div
        style={styles.uploadArea}
        onClick={handleClickUploadArea} // Trigger file input on click
      >
        <input
          type="file"
          ref={fileInputRef} // Reference to the file input
          accept=".pdf,.png,.jpg,.jpeg,.xlsx"
          onChange={handleFileChange}
          multiple // Allow multiple file selection
          style={styles.fileInput} // Hide the file input
        />
        <p style={styles.instructions}>
          Drag and drop files here, or click to select files.
        </p>
      </div>

      {/* Preview of Selected Files */}
      {files.length > 0 && (
        <div style={styles.previewContainer}>
          <h4 style={{ fontFamily: fonts.Bold }}>
            {files.length === 1 ? 'Selected File:' : 'Selected Files:'}
          </h4>
          <ul>
            {files.map((file, index) => (
              <li key={index} style={{ fontFamily: fonts.Regular }}>
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
    width: '70%',
    height: '150px',
    margin: '0 auto 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  instructions: {
    fontSize: '16px',
    fontFamily: fonts.Regular,
    color: '#666',
  },
  previewContainer: {
    textAlign: 'left',
    margin: '20px auto',
    width: '80%',
    maxWidth: '800px',
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '8px',
  },
  customButton: {
    padding: '5px 5px',
    borderRadius: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    margin: '10px auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: '15px',
  },
};

export default FileUpload;
