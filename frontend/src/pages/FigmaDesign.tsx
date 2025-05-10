

// This file is not in use!!!


import React from 'react';

const FigmaDesign = () => {
  return (
    <div style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      backgroundColor: '#0A0E17',
    }}>
      <iframe 
        src="https://embed.figma.com/proto/VyrjVSTJEdJZdbUcb1XvoE/3D-Interactive-Planet-Animation?node-id=1-18&p=f&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=0%3A9&embed-host=share" 
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '1200px',
          height: '90vh'
        }}
        allowFullScreen
        title="3D Interactive Planet Animation"
      />
    </div>
  );
};

export default FigmaDesign;
