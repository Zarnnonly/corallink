import React from 'react';
import './About.css';
import aboutLogo from '../assets/Rectangle-47.png';
const About = () => {
  return (
    <section className="container about-section" id="about">
      <div className="about-grid">
        <div className="about-logo-container">
          <img
            src={aboutLogo}
            alt="Corallink Logo"
            className="about-logo-image"
          />
        </div>
        <div className="about-text-container">
          <h2 className="about-title">CORALLINK</h2>
          <h3 className="about-subtitle">CORALLINK</h3>
          <p className="about-description">
            Deskripsi dari CORALLINK deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi
          </p>
          <p className="about-description">
            Deskripsi dari CORALLINK deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;