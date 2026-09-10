import React from 'react';
import { useProjects } from '../context/ProjectContext';
export default function ProjectState() {
  const { projects, loading, error, retry } = useProjects();
  if (loading) return <p role="status">Loading projects…</p>;
  if (error) return <div role="alert"><p>{error}</p><button onClick={retry}>Try again</button></div>;
  if (!projects.length) return <p>No projects published yet. Please check back later.</p>;
  return null;
}
