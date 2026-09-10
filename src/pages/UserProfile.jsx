import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import bg from '../assets/bg.webp';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('corallink_history') || '[]');
    setHistoryData(storedHistory);
  }, []);

  const emailName = user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const initials = emailName.substring(0, 2).toUpperCase();

  return (
    <>
      <div className="profile-page">
        {/* Banner */}
        <div className="profile-banner">
          <img src={bg} alt="Banner" className="profile-banner-img" />
        </div>

        <div className="profile-container">
          {/* User Info Header */}
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {/* Placeholder for user image */}
                <div className="avatar-placeholder">{initials}</div>
              </div>
              <div className="profile-avatar-badge">+</div>
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{emailName}</h1>
              <p className="profile-email">{displayEmail}</p>
            </div>
          </div>

          {/* Investment History Card */}
          <div className="history-card">
            <div className="history-header">
              <h2 className="history-title">Investment History</h2>
              <p className="history-subtitle">Track your contributions and see the impact of every project you support.</p>
            </div>

            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.length > 0 ? (
                    historyData.map((item) => (
                      <tr key={item.id}>
                        <td className="col-project">{item.project}</td>
                        <td>{item.date}</td>
                        <td>{item.amount}</td>
                        <td>{item.type}</td>
                        <td className="col-status">{item.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                        No investment history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
