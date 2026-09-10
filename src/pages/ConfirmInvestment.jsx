import { request, API_URL } from '../lib/api';
import ProjectState from '../components/ProjectState';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ConfirmInvestment.css';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';

const ConfirmInvestment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProject, loading, error } = useProjects();
  const { showToast } = useToast();
  const project = getProject(projectId);

  const transactionId = new URLSearchParams(location.search).get('transaction');
  const [transaction, setTransaction] = useState(null);
  const [settings, setSettings] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState('');
  useEffect(() => {
    if (!transactionId) return;
    const c = new AbortController();
    Promise.all([request(`/api/transactions/${transactionId}`, { auth: true, signal: c.signal }), request('/api/payments/settings', { signal: c.signal })])
      .then(([t, s]) => { if (!c.signal.aborted) { setTransaction(t); setSettings(s); } })
      .catch(e => { if (!c.signal.aborted) setFailure(e.message); });
    return () => c.abort();
  }, [transactionId]);
  const amount = transaction ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(transaction.amount)) : '—';
  const investType = transaction?.type || 'One-Time Contribution';
  const proofUploaded = Boolean(proofFile);
  const canUpload = transaction && ['AwaitingProof', 'Failed'].includes(transaction.status);
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) { setFailure('Choose a JPG, PNG or WEBP image up to 5MB.'); setProofFile(null); return; }
    setProofFile(file || null); setFailure('');
  };
  const handleConfirm = async () => {
    if (!proofFile || !canUpload || submitting) return;
    const payload = new FormData(); payload.append('image', proofFile);
    setSubmitting(true); setFailure('');
    try {
      const data = await request(`/api/transactions/${transaction.id}/proof`, { method: 'POST', auth: true, body: payload });
      setTransaction(data); setProofFile(null);
      showToast('Payment proof submitted. Awaiting administrator verification.', 'success');
      navigate('/profile');
    } catch (e) { setFailure(e.message); }
    finally { setSubmitting(false); }
  };
  if (loading || error) return <div className="confirm-invest-page"><ProjectState /></div>;
  if (!project || !transactionId || (transaction && String(transaction.projectId) !== projectId)) return <div className="confirm-invest-page"><h1>Payment request not found</h1><button onClick={() => navigate('/take-action')}>Back to projects</button></div>;

  return (
    <>
      <div className="confirm-invest-page">
        <div className="confirm-card">
          <div className="confirm-left">
            <h1 className="confirm-title">Investment Summary</h1>
            {failure && <p role="alert">{failure}</p>}
            {!transaction && !failure && <p role="status">Loading payment…</p>}
            {transaction && <p>Status: {transaction.status} {transaction.reviewNote}</p>}
            <h2 className="confirm-project-name">{project.name}</h2>
            <h3 className="confirm-project-subtitle">{project.subtitle}</h3>

            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Investment Type</span>
                <span className="summary-value">{investType}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Amount</span>
                <span className="summary-value">{amount.startsWith('Rp') ? amount : `Rp ${amount}`}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Payment Method</span>
                <span className="summary-value">{settings?.qrisImageUrl ? 'QRIS' : 'Bank Transfer'}</span>
              </div>
            </div>

            <div className="payment-section">
              <p className="qris-instruction">{settings?.qrisImageUrl ? 'Please scan the QR code below and enter the exact investment amount, then upload your payment proof.' : 'Transfer the exact amount to the official account below, then upload your payment proof.'}</p>
              <div className="qris-placeholder">
                <div className="qris-box">
                  {settings?.qrisImageUrl ? <a href={`${API_URL}${settings.qrisImageUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Open full-size QRIS"><img src={`${API_URL}${settings.qrisImageUrl}`} alt={`QRIS — ${settings.qrisMerchant}`} className="qris-image" style={{ width: '150px', height: '150px', objectFit: 'contain' }} /></a> : settings?.bankEnabled ? <div><strong>{settings.bankName}</strong><p>{settings.accountNumber}</p><p>{settings.accountHolder}</p></div> : <p>Official payment account is not configured.</p>}
                </div>
              </div>

              {settings?.qrisImageUrl && <p className="qris-instruction">{settings.qrisMerchant}<br />Tap the QR code to open it full size.</p>}
              {settings?.qrisImageUrl && settings?.bankEnabled && <p className="qris-instruction">Or bank transfer: {settings.bankName} — {settings.accountNumber}<br />{settings.accountHolder}</p>}

              <div className="upload-section">
                <label className="upload-btn">
                  {proofUploaded ? 'Image selected — submit to upload' : 'Upload Payment Proof'}
                  <input type="file" accept="image/*" onChange={handleUpload} disabled={!canUpload || submitting} hidden />
                </label>
              </div>
            </div>

            <button
              className={`confirm-support-btn ${proofUploaded ? 'ready' : ''}`}
              onClick={handleConfirm}
              disabled={!proofUploaded || !canUpload || submitting}
            >
              {submitting ? 'Uploading…' : 'Confirm Support'}
            </button>
          </div>

          <div className="confirm-right">
            <img src={project.image} alt={project.name} className="confirm-image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmInvestment;
