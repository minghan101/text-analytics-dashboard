import React from 'react';

const DiagramViewer = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '20px' }}>
      <div
        style={{
          width: '45%',
          height: '200px',
          backgroundColor: '#d1e7ff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
        }}
      >
        <h4>ER Diagram</h4>
        <p>(Might be rectangle & long)</p>
      </div>
      <div
        style={{
          width: '45%',
          height: '200px',
          backgroundColor: '#d4edda',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
        }}
      >
        <h4>Complex Network Diagram</h4>
      </div>
    </div>
  );
};

export default DiagramViewer;
