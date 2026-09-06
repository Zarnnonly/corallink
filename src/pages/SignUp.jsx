import React, { useState } from 'react';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/Rectangle-47.png';
import './Auth.css';

const SignUp = () => {
  const [role, setRole] = useState('Volunteer');

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-header">
          <img src={logoImg} alt="CoralLink Logo" className="auth-logo-img" />
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Creat your account to get started</p>
        </div>

        <div className="form-group">
          <label>Choose your Role</label>
          <div className="role-selector">
            <button 
              className={`role-btn ${role === 'Volunteer' ? 'active' : ''}`}
              onClick={() => setRole('Volunteer')}
            >
              Volunteer
            </button>
            <button 
              className={`role-btn ${role === 'Investor' ? 'active' : ''}`}
              onClick={() => setRole('Investor')}
            >
              Investor
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input type="text" className="auth-input" placeholder="Enter your full name" />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input type="email" className="auth-input" placeholder="Enter your Email Address" />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input type="password" className="auth-input" placeholder="Creat a Password" />
          </div>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input type="password" className="auth-input" placeholder="Confirm your Password" />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <div className="input-wrapper">
            <Phone size={18} className="input-icon" />
            <input type="tel" className="auth-input" placeholder="Enter your Phone Number" />
          </div>
        </div>

        <button className="submit-btn">Create Account</button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-redirect">
          Already have an account?{' '}
          <Link to="/signin" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
