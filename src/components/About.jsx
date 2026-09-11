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
            CoralLink adalah platform terintegrasi yang menjembatani organisasi pelestari lingkungan maritim dengan investor, korporasi (ESG/CSR), serta filantropis global. Kami hadir untuk mengatasi kesenjangan pendanaan dalam upaya restorasi laut melalui mekanisme pendanaan transparan, terukur, dan berbasis dampak langsung.
          </p>
          <p className="about-description">
            CoralLink bukan sekadar platform donasi—ini adalah ekosistem pendanaan yang memberdayakan komunitas pesisir dan menjaga keberlanjutan ekosistem laut Indonesia. Dengan teknologi terdepan, kami mengubah investasi menjadi aksi nyata, menciptakan masa depan laut yang lebih sehat dan berkelanjutan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;