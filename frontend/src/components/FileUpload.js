import React from 'react';

const FileUpload = () => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File uploaded:', file);
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      <button
        onClick={() => alert('File submitted!')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#6200ea',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default FileUpload;
