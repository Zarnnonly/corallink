import React from 'react';
import './VisionMission.css';

const VisionMission = () => {
  return (
    <section className="container vm-section">
      <h2 className="section-title">Visi dan Misi</h2>
      
      <div className="vm-grid">
        <div className="vm-card"></div>
        <div className="vm-card"></div>
      </div>
      
      <div className="vm-bars">
        <div className="vm-bar"></div>
        <div className="vm-bar"></div>
        <div className="vm-bar"></div>
      </div>
    </section>
  );
};

export default VisionMission;
