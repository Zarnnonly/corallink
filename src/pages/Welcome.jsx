import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Welcome = () => {
  return (
    <div className="auth-page">
      <div className="welcome-content">
        <h1 className="welcome-title">WELCOME</h1>
        <p className="welcome-subtitle">Do you want to join us?</p>
        <div className="welcome-buttons">
          <Link to="/signup" className="welcome-btn">Sign Up</Link>
          <Link to="/signin" className="welcome-btn">Sign In</Link>
        </div>
      </div>
    </div>
  );
};



export default Welcome;