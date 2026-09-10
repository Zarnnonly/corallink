import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { request, API_URL } from '../lib/api';
const ProjectContext = createContext();
export const useProjects = () => useContext(ProjectContext);
const unavailable = 'Not available yet';
export const adaptProject = (p) => ({
  id: String(p.id), name: p.namaProyek, location: p.lokasi,
  subtitle: p.species ? `${p.species} Restoration Project` : p.tingkatKerusakan || '',
  description: p.description || p.targetRestorasi || unavailable,
  image: p.imageUrl ? new URL(p.imageUrl, API_URL).href : null, species: p.species || unavailable,
  status: 'Restoration project', statusColor: '#2f6174',
  goal: { fragments: p.fragments ? `${p.fragments} coral fragments` : p.targetRestorasi || unavailable,
    area: p.area ? `${p.area} m² restoration area` : unavailable, duration: p.duration ? `${p.duration} months project duration` : unavailable },
  fundingTarget: p.fundingTarget ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(p.fundingTarget)) : unavailable,
  fundingPercent: p.fundingTarget ? Math.min(100, Math.round(Number(p.fundingRaised || 0) / Number(p.fundingTarget) * 100)) : null,
  milestones: p.milestones || [], milestoneVersion: p.milestoneVersion || 0, progressNote: p.progressNote || '',
  condition: p.aiStatus || unavailable, conditionType: p.aiStatus === 'Healthy' ? 'healthy' : 'unhealthy',
  confidenceScore: p.confidenceScore == null ? unavailable : `${p.confidenceScore}%`,
  analysisStatus: p.aiStatus ? 'AI estimate — requires review' : unavailable,
  characteristics: p.aiAnalysis?.ciri || [], supportingFactors: p.aiAnalysis?.faktor_pendukung || p.aiAnalysis?.penyebab || [],
  whyThisMatters: p.aiAnalysis?.kenapa_penting ? [p.aiAnalysis.kenapa_penting] : [],
  recommendations: p.aiAnalysis?.rekomendasi || p.aiAnalysis?.penanganan || [],
});
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadProjects = useCallback(async (signal) => {
    setLoading(true); setError('');
    try {
      const data = await request('/api/projects', { signal });
      if (!Array.isArray(data)) throw new Error('Invalid project response.');
      if (!signal?.aborted) setProjects(data.map(adaptProject));
    } catch (e) { if (!signal?.aborted) { setProjects([]); setError(e.message); } }
    finally { if (!signal?.aborted) setLoading(false); }
  }, []);
  useEffect(() => { const controller = new AbortController(); loadProjects(controller.signal); return () => controller.abort(); }, [loadProjects]);
  const addProject = async (body) => {
    const project = adaptProject(await request('/api/projects', { method: 'POST', auth: true, body }));
    setProjects((items) => [project, ...items.filter(p => p.id !== project.id)]);
    return project;
  };
  const updateMilestones = async (id, milestones, progressNote, version) => {
    const data = await request(`/api/projects/${id}/milestones`, { method: 'PUT', auth: true, body: { milestones, progressNote, version } });
    setProjects(items => items.map(p => p.id === String(id) ? { ...p, milestones: data.milestones, milestoneVersion: data.milestoneVersion, progressNote: data.progressNote } : p));
  };
  return <ProjectContext.Provider value={{ projects, loading, error, addProject, updateMilestones, retry: () => loadProjects(),
    getProject: (id) => projects.find((p) => p.id === String(id)) || null,
  }}>{children}</ProjectContext.Provider>;
};
