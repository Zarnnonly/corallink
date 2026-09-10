import { Link } from 'react-router-dom';
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
    Promise.all([request('/api/donations/saya', { auth: true, signal: controller.signal }), request('/api/transactions/me', { auth: true, signal: controller.signal })])
      .then(([data, transactions]) => { if (!controller.signal.aborted) {
        if (!Array.isArray(data)) throw new Error('Invalid donation response.');
        const legacy = data.map((d) => ({ id: `donation-${d.id}`, project: d.project?.namaProyek || 'Project unavailable',
          date: new Date(d.createdAt).toLocaleDateString(), amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(d.jumlahDonasi)),
          type: 'Donation record', status: 'Recorded — payment unverified', createdAt: d.createdAt }));
        const payments = transactions.map(t => ({ id: t.id, project: t.project?.namaProyek, date: new Date(t.createdAt).toLocaleDateString(), createdAt: t.createdAt, amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(t.amount)), type: t.type, status: t.status, note: t.reviewNote, resume: ['AwaitingProof', 'Failed'].includes(t.status) ? `/confirm-invest/${t.projectId}?transaction=${t.id}` : null }));
        setHistoryData([...legacy, ...payments].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

          {/* Investment History Card */}
          <div className="history-card">
            <div className="history-header">
              <h2 className="history-title">Investment History</h2>
              <p className="history-subtitle">Track your contributions. Uploaded payment proofs remain Pending until an administrator verifies the transfer.</p>
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
                        <td className="col-status">{item.status}{item.note && <p>{item.note}</p>}{item.resume && <p><Link to={item.resume}>Upload payment proof</Link></p>}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                        {loading ? 'Loading donation history…' : error ? error : user.role === 'admin' ? 'Donation history is available for investor accounts.' : 'No investment history found.'}
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
