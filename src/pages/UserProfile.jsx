import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import bg from '../assets/bg.webp';
import { request } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setHistoryData([]); setLoading(true); setError('');
    if (user.role === 'admin') { setLoading(false); return; }
    request('/api/donations/saya', { auth: true, signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) {
        if (!Array.isArray(data)) throw new Error('Invalid donation response.');
        setHistoryData(data.map((d) => ({ id: d.id, project: d.project?.namaProyek || 'Project unavailable',
          date: new Date(d.createdAt).toLocaleDateString(), amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(d.jumlahDonasi)),
          type: 'Donation record', status: 'Recorded — payment unverified' })));
      } })
      .catch((e) => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [user.id, user.role, attempt]);

  const emailName = user?.name || 'User';
  const displayEmail = user?.email || '';
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

          {/* Donation History Card */}
          <div className="history-card">
            <div className="history-header">
              <h2 className="history-title">Donation History</h2>
              <p className="history-subtitle">These are donation records only. Payment processing and verification are not available yet.</p>
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
                        {loading ? 'Loading donation history…' : error ? error : user.role === 'admin' ? 'Donation history is available for investor accounts.' : 'No donation records yet.'}
                        {error && <button onClick={() => setAttempt((n) => n + 1)}>Try again</button>}
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
