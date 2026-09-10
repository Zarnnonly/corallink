import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logoImg from '../assets/rectangle-47.webp';
import './Auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !email || !password) return;

    setSubmitting(true); setFormError('');
    try {
      await login(email.trim(), password);
      showToast('Signed in successfully!', 'success');
      navigate('/');
    } catch (error) { setFormError(error.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-header">
          <img src={logoImg} alt="CoralLink Logo" className="auth-logo-img" />
          <h2 className="auth-title">Sign In</h2>
          <p className="auth-subtitle">Welcome back! Please sign in.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {formError && <p role="alert">{formError}</p>}
          <div className="form-group">
            <label htmlFor="auth-email-address">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input id="auth-email-address"
                type="email"
                className="auth-input"
                placeholder="Enter your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input id="auth-password"
                type="password"
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button disabled={submitting} type="submit" className="submit-btn" style={{width: '100%'}}>Sign In</button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-redirect">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
