import React from 'react';
import { Mail, Lock } from 'lucide-react';
import './Auth.css';

const SignIn = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-header">
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Create your account to get started</p>
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
            <input type="password" className="auth-input" placeholder="Enter your password" />
          </div>
        </div>

        <button className="submit-btn">Login</button>
      </div>
    </div>
  );
};

export default SignIn;
