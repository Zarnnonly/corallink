import React from 'react';
import useScrollReveal from '../lib/useScrollReveal';
import './About.css';
import aboutLogo from '../assets/rectangle-47.webp';

const About = () => {
  const logoRef = useScrollReveal();
  const textRef = useScrollReveal();

  return (
    <section className="container about-section" id="about">
      <div className="about-grid">
        <div className="about-logo-container reveal-fade-left" ref={logoRef}>
          <img
            src={aboutLogo}
            alt="Corallink Logo"
            className="about-logo-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-text-container reveal-fade-right" ref={textRef}>
          <h2 className="about-title">CORALLINK</h2>
          <h3 className="about-subtitle">Coral Restoration Platform</h3>
          <p className="about-description">
            CoralLink stands as a concrete contribution to SDG 14: Life Below Water, connecting marine conservation organizations, investors, corporations (ESG/CSR), and global philanthropists within a single collaborative ecosystem. We believe that coral reef restoration requires more than just funding, as it calls for transparency, accurate data, and a shared commitment to protecting our oceans.          </p>
          <p className="about-description">
            Every project submitted is analyzed using an AI-based assessment system that measures reef health conditions, urgency levels, and restoration success potential, ensuring support reaches where it matters most. More than a funding platform, CoralLink is a collective movement to empower coastal communities and safeguard the sustainability of Indonesia's marine ecosystems for a healthier planet.          </p>
        </div>
      </div>
    </section>
  );
};

export default About;