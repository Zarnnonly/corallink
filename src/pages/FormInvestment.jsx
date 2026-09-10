import { request } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProjectState from '../components/ProjectState';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FormInvestment.css';
import logo from '../assets/rectangle-47.webp';
import bg from '../assets/bg.webp';
import { useProjects } from '../context/ProjectContext';

const FormInvestment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, loading, error } = useProjects();
  const project = getProject(projectId);

  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user.email);
  const [settings, setSettings] = useState(null);
  const [failure, setFailure] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  useEffect(() => { const c = new AbortController(); request('/api/payments/settings', { signal: c.signal }).then(setSettings).catch(e => { if (!c.signal.aborted) setFailure(e.message); }); return () => c.abort(); }, []);
  const [investType, setInvestType] = useState('Give Once');
  const [amount, setAmount] = useState('');

  const handleAmountClick = (val) => {
    setAmount(val); setRequestKey(crypto.randomUUID());
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (submitting || !settings?.enabled) return;
    const number = Number(amount.replace(/[^0-9]/g, ''));
    if (!number || number > 9999999999) { setFailure('Enter an amount between Rp 1 and Rp 9.999.999.999.'); return; }
    setSubmitting(true); setFailure('');
    try {
      const transaction = await request('/api/transactions', { method: 'POST', auth: true, body: { projectId: Number(project.id), amount: number, idempotencyKey: requestKey, type: investType === 'Give Monthly' ? 'Monthly Contribution' : 'One-Time Contribution', contributorName: `${firstName} ${lastName}`.trim(), contributorEmail: email } });
      navigate(`/confirm-invest/${project.id}?transaction=${transaction.id}`);
    } catch (e) { setFailure(e.message); }
    finally { setSubmitting(false); }
  };
  if (loading || error) return <div className="form-invest-page"><ProjectState /></div>;
  if (!project) return <div className="form-invest-page"><h1>Project not found</h1><button onClick={() => navigate('/take-action')}>Back to projects</button></div>;

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
            {failure && <p role="alert">{failure}</p>}
            {!settings && !failure && <p role="status">Loading payment details…</p>}
            {settings && !settings.enabled && <p>Payment details have not been configured by the administrator yet.</p>}
            <div className="form-section">
              <label>Select investment type</label>
              <p className="form-help">How would you like to support this project?</p>
              {investType === 'Give Monthly' && <p className="form-help">Monthly contributions use manual bank transfers. No automatic debit is set up.</p>}
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${investType === 'Give Monthly' ? 'active' : ''}`}
                  onClick={() => { setInvestType('Give Monthly'); setRequestKey(crypto.randomUUID()); }}
                >
                  Give Monthly
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${investType === 'Give Once' ? 'active' : ''}`}
                  onClick={() => { setInvestType('Give Once'); setRequestKey(crypto.randomUUID()); }}
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
                      setAmount(formatted); setRequestKey(crypto.randomUUID());
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <label>Investor Information</label>
              <div className="input-group-row">
                <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="full-width-input" />
            </div>

            <button type="submit" disabled={submitting || !settings?.enabled} className="form-submit-btn">{submitting ? 'Creating request…' : 'Continue to Payment'}</button>
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
