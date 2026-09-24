import ProjectState from '../components/ProjectState';
import React from 'react';
import useScrollReveal from '../lib/useScrollReveal';
import './Projects.css';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

const Projects = () => {
  const { projects } = useProjects();
  const gridRef = useScrollReveal();

  return (
    <section className="container projects-section">
      <h2 className="section-title">Our Project</h2>

      <div className="projects-container">
        <div className="projects-header">
          <div>
            <h3 className="projects-subtitle">Explore Restoration</h3>
            <p className="projects-description">
              Discover and support active coral reef restoration initiatives in
              need of funding.
            </p>
          </div>
        </div>

        <div className="projects-grid reveal-stagger" ref={gridRef}>
          <ProjectState />
          {projects.map((project) => (
            <Link
              to={`/invest/${project.id}`}
              className="project-card"
              key={project.id}
              style={{ textDecoration: 'none' }}
            >
              {project.image ? <img
                src={project.image}
                alt={project.name}
                className="project-image"
                loading="lazy"
                decoding="async"
              /> : <div role="img" aria-label="Project image unavailable">Image not available yet</div>}
              <div className="project-overlay">
                <h4 className="project-title">{project.name}</h4>
                <p className="project-subtitle-card">{project.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/take-action">
          <button className="btn-view-more">View More</button>
        </Link>
      </div>
    </section>
  );
};

export default Projects;