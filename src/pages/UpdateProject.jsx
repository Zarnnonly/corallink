import React from 'react';
import Footer from '../components/Footer';
import ProjectState from '../components/ProjectState';
import './UpdateProject.css';
export default function UpdateProject() {
  return <><div className="update-page"><div className="update-container"><div className="update-header">
    <h1>Update Project Progress</h1><p>Milestone updates are not available yet. No changes can be submitted.</p>
    <ProjectState />
  </div></div></div><Footer /></>;
}
