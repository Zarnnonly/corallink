import React from 'react';
import { Link } from 'react-router-dom';
import './FormInvestment.css';
export default function FormInvestment() {
  return <div className="form-invest-page"><div className="form-invest-container"><div className="form-invest-left">
    <h1>Investment</h1><p>Payments and payment proof uploads are not available yet. No payment has been submitted.</p>
    <Link to="/take-action">Back to projects</Link>
  </div></div></div>;
}
