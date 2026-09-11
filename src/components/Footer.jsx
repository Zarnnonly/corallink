import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Globe, ExternalLink } from 'lucide-react';
import useScrollReveal from '../lib/useScrollReveal';
import './Footer.css';
import logoFooter from '../assets/rectangle-47.webp';

const Footer = () => {
  const mainRef = useScrollReveal();

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        
        {/* Main Content Row */}
        <div className="footer-main-row reveal-fade-up" ref={mainRef}>
          
          {/* Brand & Tagline */}
          <div className="footer-brand">
            <Link to="/" className="footer-brand-header">
              <img src={logoFooter} alt="CoralLink Logo" className="footer-logo-img" />
              <span className="footer-brand-title">CORALLINK</span>
            </Link>
            <p className="footer-tagline">
              Platform investasi & pembiayaan restorasi karang untuk masa depan ekosistem maritim.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="footer-nav">
            <span className="footer-heading">Menu</span>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><Link to="/take-action">Take Action</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <span className="footer-heading">Contact</span>
            <div className="footer-contact-items">
              <div className="footer-contact-link">
                <Phone size={13} className="contact-icon" />
                <span>+62 831-1234-5678</span>
              </div>
              <a
                href="https://corallink.web.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link clickable"
              >
                <Globe size={13} className="contact-icon" />
                <span>corallink.web.id</span>
                <ExternalLink size={11} className="ext-icon" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} CoralLink. All rights reserved.
          </p>
          <span className="footer-subtext">Restoring Marine Ecosystems</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
