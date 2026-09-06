import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar container">
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        CORALLINK
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <a href="/#about" className="nav-link">About Us</a>
        <a href="/#faq" className="nav-link">FAQ</a>
        <Link to="/take-action" className="nav-link">Take Action</Link>
      </div>
      <Link to="/welcome" className="navbar-login" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
