import React, { useState } from 'react';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/rectangle-47.webp';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const SignUp = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !name || !email || !password) return;
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setSubmitting(true); setFormError('');
    try {
      await register(name.trim(), email.trim(), password, phone.trim());
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) { setFormError(error.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-header">
          <img src={logoImg} alt="CoralLink Logo" className="auth-logo-img" />
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          {formError && <p role="alert">{formError}</p>}
          <div className="form-group">
            <label htmlFor="auth-full-name">Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input id="auth-full-name"
                type="text"
                minLength={2}
                className="auth-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                minLength={6}
                className="auth-input"
                placeholder="Create a Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input id="auth-confirm-password"
                type="password"
                minLength={6}
                className="auth-input"
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-phone">Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input id="auth-phone" type="tel" className="auth-input" placeholder="Enter your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <button disabled={submitting} type="submit" className="submit-btn" style={{ width: '100%' }}>Create Account</button>
        </form>

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

