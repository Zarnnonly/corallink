import React, { useState, useEffect } from 'react';
import { request } from '../lib/api';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import './UpdateProject.css';
import './UploadProject.css';
import './UserProfile.css';

const statusBadgeClass = (status) => {
  if (status === 'Pending') return 'status-badge status-badge-pending';
  if (status === 'Completed') return 'status-badge status-badge-completed';
  if (status === 'Failed') return 'status-badge status-badge-failed';
  if (status === 'AwaitingProof') return 'status-badge status-badge-awaiting';
  return 'status-badge';
};

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({ bankName: '', accountNumber: '', accountHolder: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  const [proof, setProof] = useState('');
  const [proofLoading, setProofLoading] = useState(false);
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const { showToast } = useToast();
  const { retry } = useProjects();
  useEffect(() => {
    const c = new AbortController(); setLoading(true); setError('');
    Promise.all([request('/api/transactions', { auth: true, signal: c.signal }), request('/api/payments/settings', { signal: c.signal })])
      .then(([t, s]) => { if (!c.signal.aborted) { setTransactions(t); setSettings({ bankName: s.bankName || '', accountNumber: s.accountNumber || '', accountHolder: s.accountHolder || '' }); } })
      .catch(e => { if (!c.signal.aborted) setError(e.message); })
      .finally(() => { if (!c.signal.aborted) setLoading(false); });
    return () => c.abort();
  }, [attempt]);
  useEffect(() => {
    setProof(''); setNote(''); setConfirmed(false);
    if (!selected?.hasProof) return;
    const c = new AbortController(); let objectUrl;
    setProofLoading(true);
    request(`/api/transactions/${selected.id}/proof`, { auth: true, responseType: 'blob', signal: c.signal })
      .then(blob => { if (!c.signal.aborted) { objectUrl = URL.createObjectURL(blob); setProof(objectUrl); } })
      .catch(e => { if (!c.signal.aborted) setError(e.message); })
      .finally(() => { if (!c.signal.aborted) setProofLoading(false); });
    return () => { c.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [selected]);
  const saveSettings = async e => {
    e.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await request('/api/payments/settings', { method: 'PUT', auth: true, body: settings }); showToast('Official payment account saved.', 'success'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const review = async status => {
    if (busy || !selected || (status === 'Completed' && !confirmed)) return;
    if (status === 'Failed' && !note.trim()) { setError('Enter a reason before rejecting the proof.'); return; }
    setBusy(true); setError('');
    try {
      await request(`/api/transactions/${selected.id}/status`, { method: 'PUT', auth: true, body: { status, note } });
      setSelected(null); setAttempt(n => n + 1); retry(); showToast('Payment review saved.', 'success');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <AdminLayout title="Payment Review" description="Verify each transfer against your bank statement before approving it." breadcrumb="Payment Review">
    {error && <div className="inline-alert inline-alert-error" role="alert"><span>{error}</span><button type="button" className="btn-admin-action" style={{marginLeft: 'auto'}} onClick={() => setAttempt(n => n + 1)}>Reload</button></div>}
    {loading && <div className="inline-alert inline-alert-info" role="status"><span>Loading payments…</span></div>}
    <div className="update-form">
      <form className="update-card upload-form" onSubmit={saveSettings}>
        <h2>Official payment account</h2>
        {[['bankName', 'Bank name'], ['accountNumber', 'Account number'], ['accountHolder', 'Account holder']].map(([key, label]) => <div className="form-group" key={key}>
          <label htmlFor={key}>{label}</label><input id={key} value={settings[key]} required disabled={busy || loading} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} />
        </div>)}
        <button className="update-submit-btn" disabled={busy || loading}>Save payment account</button>
      </form>
      <div className="update-card"><h2>Payment submissions</h2><p>Latest 500 submissions</p>
        {!loading && !transactions.length && <p>No payment submissions yet.</p>}
        {transactions.length > 0 && <p className="history-scroll-hint">Swipe the table to see payment details and review proofs.</p>}
        <div className="history-table-wrapper" role="region" aria-label="Payment submissions" tabIndex={0}><table className="history-table"><thead><tr><th>Investor / Project</th><th>Amount</th><th>Status</th><th>Proof</th></tr></thead>
          <tbody>{transactions.map(t => <tr key={t.id}><td>{t.investor?.nama}<br />{t.investor?.email}<br />{t.project?.namaProyek}</td><td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(t.amount))}</td><td><span className={statusBadgeClass(t.status)}>{t.status}</span></td><td><button type="button" className="btn-admin-action" disabled={!t.hasProof || busy} onClick={() => { setError(''); setSelected(t); }}>Review proof</button></td></tr>)}</tbody>
        </table></div>
      </div>
      {selected && <div className="update-card"><h2>Review: {selected.project?.namaProyek}</h2><p>{selected.investor?.nama} — {selected.amount} IDR — <span className={statusBadgeClass(selected.status)}>{selected.status}</span></p>
        {proofLoading && <p role="status">Loading private proof…</p>}{proof && <img src={proof} alt="Payment proof" loading="lazy" decoding="async" style={{ maxWidth: '100%', maxHeight: 600, objectFit: 'contain', borderRadius: 12, border: '1px solid #E0F2F1' }} />}
        {selected.status === 'Pending' ? <><label htmlFor="review-note">Review notes (required for rejection)</label><textarea id="review-note" rows={3} value={note} onChange={e => setNote(e.target.value)} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '8px 0' }}><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /> I checked the bank statement and confirmed the amount was received.</label>
          <div className="admin-review-actions">
            <button type="button" className="btn-admin-approve" disabled={busy || !confirmed || !proof} onClick={() => review('Completed')}>Approve payment</button>
            <button type="button" className="btn-admin-reject" disabled={busy || !note.trim()} onClick={() => review('Failed')}>Reject proof</button>
            <button type="button" className="btn-admin-close" disabled={busy} onClick={() => setSelected(null)}>Close review</button>
          </div></> : <div className="admin-review-actions"><button type="button" className="btn-admin-close" disabled={busy} onClick={() => setSelected(null)}>Close review</button></div>}
      </div>}
    </div>
  </AdminLayout>;
}
