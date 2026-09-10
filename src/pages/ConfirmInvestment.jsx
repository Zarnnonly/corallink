import React from 'react';
import { Link } from 'react-router-dom';
import './ConfirmInvestment.css';
export default function ConfirmInvestment() {
  return <div className="confirm-invest-page"><div className="confirm-card"><div className="form-invest-left">
    <h1>Investment</h1><p>Payments and payment proof uploads are not available yet. No payment has been submitted.</p>
    <Link to="/take-action">Back to projects</Link>
  </div></div></div>;
}
