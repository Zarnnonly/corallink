import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './UserProfile.css';
import bg from '../assets/bg.webp';
import { request } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const UserProfile = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const photoInput = useRef(null);
  const [photo, setPhoto] = useState('');
  const [photoRevision, setPhotoRevision] = useState(0);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoMessage, setPhotoMessage] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;
    request('/api/auth/profile/photo', { auth: true, responseType: 'blob', signal: controller.signal })
      .then(blob => {
        if (controller.signal.aborted) return;
        if (blob.size) objectUrl = URL.createObjectURL(blob);
        setPhoto(objectUrl || '');
      })
      .catch(e => { if (!controller.signal.aborted) setPhotoError(e.message); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [user.id, photoRevision]);

  const uploadPhoto = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || photoBusy) return;
    setPhotoError(''); setPhotoMessage('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setPhotoError('Choose a JPG, PNG or WEBP image up to 5MB.'); return;
    }
    setPhotoBusy(true);
    const body = new FormData(); body.append('image', file);
    try {
      await request('/api/auth/profile/photo', { method: 'POST', auth: true, body });
      setPhotoRevision(n => n + 1); setPhotoMessage('Profile photo saved.');
    } catch (error) { setPhotoError(error.message); }
    finally { setPhotoBusy(false); }
  };

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
          <img src={bg} alt="" aria-hidden="true" className="profile-banner-img" loading="lazy" decoding="async" />
        </div>

        <div className="profile-container">
          {/* User Info Header */}
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {photo ? <img src={photo} alt="Your profile" className="profile-photo" loading="lazy" decoding="async" /> : <div className="avatar-placeholder">{initials}</div>}
              </div>
              <button type="button" className="profile-avatar-badge" aria-label="Upload profile photo" title="Upload profile photo" disabled={photoBusy} onClick={() => photoInput.current?.click()}>+</button>
              <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} hidden />
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{emailName}</h1>
              <p className="profile-email">{displayEmail}</p>
            </div>
          </div>
          <p className="profile-photo-feedback" role={photoError ? 'alert' : 'status'}>{photoBusy ? 'Uploading photo…' : photoError || photoMessage || 'Tap + to upload a profile photo (JPG, PNG or WEBP, up to 5MB).'}</p>

          {/* Investment History Card */}
          <div className="history-card">
            <div className="history-header">
              <h2 className="history-title">Investment History</h2>
              <p className="history-subtitle">Track your contributions. Uploaded payment proofs remain Pending until an administrator verifies the transfer.</p>
            </div>

            {historyData.length > 0 && <p className="history-scroll-hint">Swipe the table to see all investment details.</p>}
            <div className="history-table-wrapper" role="region" aria-label="Investment history" tabIndex={0}>
              <table className={`history-table${historyData.length ? '' : ' history-table-empty'}`}>
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
                        {error && <button className="state-retry-btn" style={{ marginLeft: 12 }} onClick={() => setAttempt((n) => n + 1)}>Try again</button>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
