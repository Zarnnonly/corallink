import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { request } from '../lib/api';
const ProjectContext = createContext();
export const useProjects = () => useContext(ProjectContext);
const unavailable = 'Not available yet';
export const adaptProject = (p) => ({
  id: String(p.id), name: p.namaProyek, location: p.lokasi,
  subtitle: p.tingkatKerusakan || '', description: p.targetRestorasi || unavailable,
  image: p.imageUrl || null, species: unavailable,
  status: p.statusVerifikasi || 'pending', statusColor: '#666',
  goal: { fragments: p.targetRestorasi || unavailable, area: unavailable, duration: unavailable },
  fundingTarget: unavailable, fundingPercent: null, milestones: [],
  condition: p.aiStatus || unavailable, conditionType: 'unknown',
  confidenceScore: p.confidenceScore == null ? unavailable : `${p.confidenceScore}%`,
  analysisStatus: p.aiStatus ? 'AI estimate — requires review' : unavailable,
  characteristics: [], supportingFactors: [], whyThisMatters: [], recommendations: [],
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
  return <ProjectContext.Provider value={{ projects, loading, error, retry: () => loadProjects(),
    getProject: (id) => projects.find((p) => p.id === String(id)) || null,
  }}>{children}</ProjectContext.Provider>;
};
