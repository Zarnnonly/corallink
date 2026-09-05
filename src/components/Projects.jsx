import React from 'react';
import './Projects.css';

const Projects = () => {
  return (
    <section className="container projects-section">
      <h2 className="section-title">Our Project</h2>
      
      <div className="projects-container">
        <div className="projects-header">
          <div>
            <h3 className="projects-subtitle">Explore Restoration</h3>
            <p className="projects-description">Explore Restoration</p>
          </div>
          <div className="projects-header-bars">
            <div className="ph-bar-long"></div>
            <div className="ph-bar-short"></div>
          </div>
        </div>
        
        <div className="projects-grid">
          <div className="project-card"></div>
          <div className="project-card"></div>
          <div className="project-card"></div>
          <div className="project-card"></div>
        </div>
        
        <button className="btn-view-more">View More</button>
      </div>
    </section>
  );
};

export default Projects;
