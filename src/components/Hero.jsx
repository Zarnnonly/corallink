import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import useScrollReveal from '../lib/useScrollReveal';
import './Hero.css';
import heroImage from '../assets/hero-banner.webp';

const Hero = () => {
  const contentRef = useScrollReveal();

  return (
    <section className="container hero-section" id="hero">
      <div className="hero-banner">
        <img
          src={heroImage}
          alt="Corallink - Invest in healthy oceans"
          className="hero-image"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-overlay">
          <div className="hero-content reveal-fade-up" ref={contentRef}>
            <div className="hero-tag">
              Coral Reef Restoration Platform
            </div>
            <h1 className="hero-title">
              Invest in Healthy Oceans,<br />
              Restore Our Coral Reefs
            </h1>
            <p className="hero-subtitle">
              A transparent funding platform connecting marine conservation initiatives with global investors and philanthropists for real coral reef restoration action.
            </p>
            <div className="hero-actions">
              <Link to="/take-action" className="hero-btn hero-btn-primary">
                <span>Explore Projects</span>
                <ArrowRight size={18} />
              </Link>
              <a href="/#about" className="hero-btn hero-btn-secondary">
                <Compass size={18} />
                <span>Learn More</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;