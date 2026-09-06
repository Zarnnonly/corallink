import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar container">
      <div className="navbar-logo">
        CORALLINK
      </div>
      
      <div className="navbar-links">
        <a href="#home" className="nav-link">Home</a>
        <a href="#about" className="nav-link">About Us</a>
        <a href="#faq" className="nav-link">FAQ</a>
        <a href="#action" className="nav-link">Take Action</a>
      </div>
      
      <button className="navbar-login">
        Login
      </button>
    </nav>
  );
};

export default Navbar;
