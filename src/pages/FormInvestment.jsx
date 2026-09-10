import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FormInvestment.css';
import logo from '../assets/rectangle-47.webp';
import bg from '../assets/bg.webp';
import { useProjects } from '../context/ProjectContext';

const FormInvestment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, projects } = useProjects();
  const project = getProject(projectId) || projects[0];
  
  const [investType, setInvestType] = useState('Give Once');
  const [amount, setAmount] = useState('');
  
  const handleAmountClick = (val) => {
    setAmount(val);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!amount) {
      alert("Please select or enter an investment amount.");
      return;
    }
    navigate(`/confirm-invest/${project.id}`, { state: { investType, amount } });
  };

  return (
    <div className="form-invest-page">
      <div className="form-invest-container">
        {/* Left Side: Form */}
        <div className="form-invest-left">
          <div className="form-invest-header">
            <img src={logo} alt="Corallink Logo" className="form-logo" />
            <h1 className="form-title">Investment</h1>
            <p className="form-subtitle">
              Support coral restoration projects and creating a healthier ocean<br />
              You're supporting: Coral Restoration Project <strong>{project.name}</strong>
            </p>
          </div>

          <form className="invest-form" onSubmit={handleContinue}>
            <div className="form-section">
              <label>Select investment type</label>
              <p className="form-help">How would you like to support this project?</p>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${investType === 'Give Monthly' ? 'active' : ''}`}
                  onClick={() => setInvestType('Give Monthly')}
                >
                  Give Monthly
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${investType === 'Give Once' ? 'active' : ''}`}
                  onClick={() => setInvestType('Give Once')}
                >
                  Give Once
                </button>
              </div>
            </div>

            <div className="form-section">
              <label>Investment Amount</label>
              <div className="amount-grid">
                {['Rp 500.000', 'Rp 1.000.000', 'Rp 5.000.000', 'Rp 10.000.000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`amount-btn ${amount === val ? 'active' : ''}`}
                    onClick={() => handleAmountClick(val)}
                  >
                    {val}
                  </button>
                ))}
                <div className="custom-amount-wrapper">
                  <span className="currency-prefix">Rp</span>
                  <input
                    type="text"
                    className="custom-amount-input"
                    placeholder="Enter custom amount"
                    value={!['Rp 500.000', 'Rp 1.000.000', 'Rp 5.000.000', 'Rp 10.000.000'].includes(amount) ? amount : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      const formatted = raw ? Number(raw).toLocaleString('id-ID') : '';
                      setAmount(formatted);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <label>Investor Information</label>
              <div className="input-group-row">
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
              </div>
              <input type="email" placeholder="Email Address" required className="full-width-input" />
            </div>

            <button type="submit" className="form-submit-btn">Continue to Payment</button>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="form-invest-right">
          <img src={bg} alt="Underwater Background" className="form-bg-image" />
          <div className="coral-overlay">
            {/* Coral illustration placeholder */}
            <svg viewBox="0 0 100 100" className="coral-svg" fill="#6CC4C5">
              <path d="M50 90 Q60 80 55 60 Q70 65 80 50 Q75 40 65 45 Q60 30 50 40 Q40 30 35 45 Q25 40 20 50 Q30 65 45 60 Q40 80 50 90 Z" />
              <path d="M60 45 Q70 30 85 35" stroke="#6CC4C5" strokeWidth="4" fill="none" />
              <path d="M40 45 Q30 30 15 35" stroke="#6CC4C5" strokeWidth="4" fill="none" />
              <path d="M55 50 Q65 35 75 25" stroke="#6CC4C5" strokeWidth="4" fill="none" />
              <path d="M45 50 Q35 35 25 25" stroke="#6CC4C5" strokeWidth="4" fill="none" />
              <path d="M50 40 Q50 20 50 10" stroke="#6CC4C5" strokeWidth="4" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormInvestment;
