import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trash2, Search } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useProjects } from '../context/ProjectContext';
import './DeleteProject.css';

export default function DeleteProject() {
  const { projects, loading, error, retry, deleteProject } = useProjects();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [message, setMessage] = useState('');
  const dialog = useRef(null);
  const heading = useRef(null);
  const inFlight = useRef(false);
  const filtered = projects.filter(p => `${p.name} ${p.location}`.toLowerCase().includes(search.trim().toLowerCase()));

  const openConfirmation = project => {
    setSelected(project); setConfirmation(''); setDeleteError(''); setMessage('');
    dialog.current.showModal();
  };
  const close = () => { if (!inFlight.current) dialog.current.close(); };
  const remove = async e => {
    e.preventDefault();
    if (inFlight.current || !selected || confirmation !== selected.name) return;
    inFlight.current = true; setBusy(true); setDeleteError('');
    try {
      await deleteProject(selected.id);
      setMessage(`"${selected.name}" was deleted successfully.`);
      dialog.current.close(); setSelected(null);
      heading.current.focus();
    } catch (e) { setDeleteError(e.message); }
    finally { inFlight.current = false; setBusy(false); }
  };

  return <>
    <AdminLayout title="Delete Project" description="Manage published coral restoration projects. Review a project before removing it permanently." breadcrumb="Delete Project">
      <div className="delete-notice">Projects with donations or transactions cannot be deleted, so payment history stays intact.</div>
      <section className="delete-panel" aria-label="Published projects">
        <div className="delete-toolbar">
          <h2 ref={heading} tabIndex={-1}>Published projects <span>{projects.length}</span></h2>
          <label className="delete-search"><Search size={18} aria-hidden="true" /><input aria-label="Search projects" type="search" placeholder="Search name or location" value={search} onChange={e => setSearch(e.target.value)} /></label>
        </div>
        {message && <p className="delete-success" role="status">{message}</p>}
        {loading ? <p role="status">Loading projects…</p> : error ? <div role="alert"><p>{error}</p><button className="delete-secondary" onClick={retry}>Try again</button></div> : !projects.length ? <div className="delete-empty"><h3>No projects published yet</h3><p>Projects will appear here after publication.</p><Link to="/upload-project">Upload a project</Link></div> : !filtered.length ? <p className="delete-empty">No projects match your search.</p> : <ul className="delete-list">
          {filtered.map(project => <li key={project.id}>
            {project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <div className="delete-image-placeholder" aria-hidden="true">CL</div>}
            <div className="delete-project-info"><h3>{project.name}</h3><p><MapPin size={14} aria-hidden="true" /> {project.location}</p><span>Project #{project.id}</span></div>
            <div className="delete-actions"><Link to={`/project/${project.id}`}>View project</Link><button className="delete-danger" onClick={() => openConfirmation(project)} aria-label={`Delete ${project.name}`}><Trash2 size={16} aria-hidden="true" /> Delete</button></div>
          </li>)}
        </ul>}
      </section>
    </AdminLayout>
    <dialog ref={dialog} className="delete-dialog" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" onCancel={e => { if (inFlight.current) e.preventDefault(); }}>
      <form onSubmit={remove} aria-busy={busy}>
        <div className="delete-dialog-icon"><Trash2 size={24} aria-hidden="true" /></div>
        <h2 id="delete-dialog-title">Delete this project?</h2>
        <p id="delete-dialog-description">This permanently removes <strong>{selected?.name}</strong> from CoralLink. This action cannot be undone.</p>
        <label htmlFor="delete-confirmation">Type the project name to confirm: <strong>{selected?.name}</strong></label>
        <input id="delete-confirmation" autoComplete="off" value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} />
        {deleteError && <p className="delete-error" role="alert">{deleteError}</p>}
        <div className="delete-dialog-actions"><button type="button" className="delete-secondary" autoFocus disabled={busy} onClick={close}>Cancel</button><button className="delete-danger" type="submit" disabled={busy || !selected || confirmation !== selected.name}>{busy ? 'Deleting…' : 'Delete permanently'}</button></div>
      </form>
    </dialog>
  </>;
}
