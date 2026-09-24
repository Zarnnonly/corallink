import ProjectState from '../components/ProjectState';
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './TakeAction.css';
import { useProjects } from '../context/ProjectContext';

const TakeAction = () => {
  const { projects } = useProjects();

  return (
    <>
      <div className="take-action-page container">
          <ProjectState />
        {projects.map((project) => (
          <div key={project.id} className="action-card">
            <div className="action-card-left">
              {project.image ? <img src={project.image} alt={`Action ${project.name}`} className="action-card-image" loading="lazy" decoding="async" /> : <div role="img" aria-label="Project image unavailable">Image not available yet</div>}
            </div>
            <div className="action-card-right">
              <h2>{project.name}</h2>
              <h3>{project.subtitle}</h3>
              <p>{project.description}</p>
              <Link to={`/invest/${project.id}`} className="action-btn">
                View Project
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TakeAction;
