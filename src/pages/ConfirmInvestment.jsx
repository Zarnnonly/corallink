import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ConfirmInvestment.css';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';

const ConfirmInvestment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProject, projects } = useProjects();
  const { showToast } = useToast();
  const project = getProject(projectId) || projects[0];

  // Get data from FormInvestment state
  const investType = location.state?.investType || 'One-Time Contribution';
  const amount = location.state?.amount || 'Rp 0';

  const [proofUploaded, setProofUploaded] = useState(false);

  const handleUpload = (e) => {
    // Mock upload
    if (e.target.files && e.target.files[0]) {
      setProofUploaded(true);
    }
  };

  const handleConfirm = () => {
    if (proofUploaded) {
      // Create transaction record
      const transaction = {
        id: Date.now(),
        project: project.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: amount.startsWith('Rp') ? amount : `Rp ${amount}`,
        type: investType,
        status: 'Completed'
      };
      
      const storedHistory = JSON.parse(localStorage.getItem('corallink_history') || '[]');
      storedHistory.unshift(transaction);
      localStorage.setItem('corallink_history', JSON.stringify(storedHistory));

      // Show success toast
      showToast('Payment verification submitted successfully!', 'success');

      // Navigate to profile after confirming
      navigate('/profile');
    } else {
      showToast('Please upload payment proof before confirming.', 'error');
    }
  };

  return (
    <>
      <div className="confirm-invest-page">
        <div className="confirm-card">
          <div className="confirm-left">
            <h1 className="confirm-title">Investment Summary</h1>
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
                <span className="summary-value">QRIS / Bank Transfer</span>
              </div>
            </div>

            <div className="payment-section">
              <p className="qris-instruction">Please scan the QR code below to complete your payment.</p>
              <div className="qris-placeholder">
                <div className="qris-box">
                  {/* Mock QR Code Image */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockQR" 
                    alt="QR Code" 
                    className="qris-image" 
                    style={{ width: '150px', height: '150px' }} 
                  />
                </div>
              </div>
              
              <div className="upload-section">
                <label className="upload-btn">
                  {proofUploaded ? 'Proof Uploaded ✓' : 'Upload Payment Proof'}
                  <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>
              </div>
            </div>

            <button 
              className={`confirm-support-btn ${proofUploaded ? 'ready' : ''}`} 
              onClick={handleConfirm}
              disabled={!proofUploaded}
            >
              Confirm Support
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
