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
          />
        </div>
        <div className="about-text-container reveal-fade-right" ref={textRef}>
          <h2 className="about-title">CORALLINK</h2>
          <h3 className="about-subtitle">Coral Restoration Platform</h3>
          <p className="about-description">
            CoralLink is an integrated platform connecting marine conservation organisations with investors, corporations (ESG/CSR), and global philanthropists. We are here to bridge the funding gap in ocean restoration through transparent, measurable, and direct-impact funding mechanisms.
          </p>
          <p className="about-description">
            CoralLink is more than just a donation platform—it is a funding ecosystem that empowers coastal communities and preserves the sustainability of marine ecosystems. Leveraging cutting-edge technology, we turn investments into tangible action, creating a healthier and more sustainable ocean future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;