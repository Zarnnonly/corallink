import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="notfound-page">
        <div className="notfound-content">
          <div className="notfound-code">404</div>
          <h1 className="notfound-title">Page Not Found</h1>
          <p className="notfound-desc">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="notfound-actions">
            <button className="notfound-btn primary" onClick={() => navigate(-1)}>
              ← Go Back
            </button>
            <Link to="/" className="notfound-btn secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
