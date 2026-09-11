import React from 'react';
import { AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import './ProjectState.css';

export default function ProjectState() {
  const { projects, loading, error, retry } = useProjects();

  if (loading) {
    return (
      <div className="project-state-card project-state-loading" role="status">
        <div className="state-spinner" />
        <h3 className="state-loading-title">Memuat Proyek Restorasi</h3>
        <p className="state-loading-subtitle">Menghubungkan data terumbu karang dan estimasi pendanaan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-state-card project-state-error" role="alert">
        <div className="state-error-icon">
          <AlertCircle size={26} />
        </div>
        <h3 className="state-error-title">Gagal Memuat Proyek</h3>
        <p className="state-error-desc">{error}</p>
        <button type="button" className="state-retry-btn" onClick={retry}>
          <RefreshCw size={15} />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="project-state-card project-state-empty">
        <div className="state-empty-icon">
          <FolderOpen size={28} />
        </div>
        <h3 className="state-empty-title">Belum Ada Proyek Aktif</h3>
        <p className="state-empty-desc">
          Saat ini belum ada inisiatif restorasi karang yang dipublikasikan. Silakan periksa kembali beberapa saat lagi.
        </p>
      </div>
    );
  }

  return null;
}
