import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectsData as staticProjects } from '../data/projects';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

const STORAGE_KEY_UPLOADED = 'corallink_uploaded_projects';
const STORAGE_KEY_MILESTONES = 'corallink_milestone_updates';

/**
 * ProjectProvider merges static project data with localStorage-persisted
 * uploaded projects and milestone updates. This creates a single source
 * of truth for the entire app.
 */
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  // Load and merge all project data
  const loadProjects = useCallback(() => {
    const uploaded = JSON.parse(localStorage.getItem(STORAGE_KEY_UPLOADED) || '[]');
    const milestoneUpdates = JSON.parse(localStorage.getItem(STORAGE_KEY_MILESTONES) || '[]');

    // Combine static + uploaded projects
    const allProjects = [...staticProjects, ...uploaded];

    // Apply milestone updates
    const merged = allProjects.map((project) => {
      const update = milestoneUpdates.find((u) => u.projectId === project.id);
      if (update) {
        const updatedMilestones = project.milestones.map((m, i) => {
          const milestoneUpdate = update.milestones[i];
          if (milestoneUpdate) {
            return {
              ...m,
              done: milestoneUpdate.status === 'Complete',
            };
          }
          return m;
        });
        return { ...project, milestones: updatedMilestones };
      }
      return project;
    });

    setProjects(merged);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Add a new project (called from UploadProject)
  const addProject = (newProject) => {
    const uploaded = JSON.parse(localStorage.getItem(STORAGE_KEY_UPLOADED) || '[]');
    uploaded.push(newProject);
    localStorage.setItem(STORAGE_KEY_UPLOADED, JSON.stringify(uploaded));
    loadProjects(); // Re-merge everything
  };

  // Update milestones for a project (called from UpdateProject)
  const updateMilestones = (projectId, projectName, milestoneUpdates, progressNote) => {
    const updateRecord = {
      projectId,
      projectName,
      milestones: milestoneUpdates,
      progressNote,
      updatedAt: new Date().toISOString(),
    };

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_MILESTONES) || '[]');
    const existingIndex = stored.findIndex((u) => u.projectId === projectId);
    if (existingIndex >= 0) {
      stored[existingIndex] = updateRecord;
    } else {
      stored.push(updateRecord);
    }
    localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(stored));
    loadProjects(); // Re-merge everything
  };

  // Find a single project by ID
  const getProject = (projectId) => {
    return projects.find((p) => p.id === projectId) || null;
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateMilestones, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
