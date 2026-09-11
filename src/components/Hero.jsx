import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import './Hero.css';
import heroImage from '../assets/hero-banner.webp';

const Hero = () => {
  return (
    <section className="container hero-section">
      <div className="hero-banner">
        <img
          src={heroImage}
          alt="Corallink - Invest in healthy oceans"
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-tag">
              Platform Restorasi Karang Indonesia
            </div>
            <h1 className="hero-title">
              Invest in Healthy Oceans,<br />
              Restore Our Coral Reefs
            </h1>
            <p className="hero-subtitle">
              Platform pendanaan transparan yang menghubungkan inisiatif konservasi laut dengan para investor dan filantropis global untuk aksi restorasi terumbu karang nyata.
            </p>
            <div className="hero-actions">
              <Link to="/take-action" className="hero-btn hero-btn-primary">
                <span>Jelajahi Proyek</span>
                <ArrowRight size={18} />
              </Link>
              <a href="/#about" className="hero-btn hero-btn-secondary">
                <Compass size={18} />
                <span>Pelajari Lebih Lanjut</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;