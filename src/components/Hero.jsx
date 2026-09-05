import React from 'react';
import './Hero.css';
import heroImage from '../assets/hero-banner.png';

const Hero = () => {
  return (
    <section className="container">
      <div className="hero-banner">
        <img
          src={heroImage}
          alt="Corallink - Invest in healthy oceans"
          className="hero-image"
        />
      </div>
    </section>
  );
};

export default Hero;