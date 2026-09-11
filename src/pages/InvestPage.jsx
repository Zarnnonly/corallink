import ProjectState from '../components/ProjectState';
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Waves, Check } from 'lucide-react';
import Footer from '../components/Footer';
import './InvestPage.css';
import { useProjects } from '../context/ProjectContext';

const InvestPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { getProject, loading, error } = useProjects();
  const project = getProject(projectId);

  if (loading || error) return <div className="container"><ProjectState /></div>;

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project not found.</h2>
        <Link to="/take-action">Back to Take Action</Link>
      </div>
    );
  }

  return (
    <>
      <div className="project-detail-page">
        {/* Hero Section */}
        <section className="pd-hero">
          <div className="pd-hero-inner">
            <Link to="/take-action" className="pd-back-link">
              <ArrowLeft size={16} />
              <span>Back to Projects</span>
            </Link>

            <div className="pd-hero-grid">
              {/* Left: Info */}
              <div className="pd-info">
                <h1 className="pd-name">{project.name}</h1>
                <h2 className="pd-subtitle">{project.subtitle}</h2>
                <p className="pd-description">{project.description}</p>

                <div className="pd-tags">
                  <span className="pd-tag">
                    <MapPin size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {project.location}
                  </span>
                  <span className="pd-tag">
                    <Waves size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {project.species}
                  </span>
                  <span className="pd-tag pd-tag-status" style={{ color: project.statusColor }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: project.statusColor || '#2E7D32', marginRight: 4 }} />
                    {project.status}
                  </span>
                </div>

                <div className="pd-stats-row">
                  <div className="pd-stat-block">
                    <span className="pd-stat-label">PROJECT GOAL</span>
                    <ul className="pd-stat-list">
                      <li>{project.goal.fragments}</li>
                      <li>{project.goal.area}</li>
                      <li>{project.goal.duration}</li>
                    </ul>
                  </div>
                  <div className="pd-stat-block">
                    <span className="pd-stat-label">ESTIMATED FUNDING</span>
                    <p className="pd-funding-amount">{project.fundingTarget}</p>
                    {project.fundingPercent !== null && <div className="pd-progress-wrap">
                      <div className="pd-progress-bar">
                        <div
                          className="pd-progress-fill"
                          style={{ width: `${project.fundingPercent}%` }}
                        />
                      </div>
                      <span className="pd-progress-pct">{project.fundingPercent}%</span>
                    </div>}
                  </div>
                </div>

                <div className="pd-action-buttons">
                  <button
                    className="pd-invest-btn"
                    onClick={() => navigate(`/invest-form/${project.id}`)}
                  >
                    Investment
                  </button>
                  <Link to={`/project/${project.id}`} className="pd-detail-project-btn">
                    Detail Project
                  </Link>
                </div>
              </div>

              {/* Right: Image */}
              <div className="pd-image-wrap">
                <Link to={`/project/${project.id}`}>
                  {project.image ? <img src={project.image} alt={project.name} className="pd-hero-image" /> : <div role="img" aria-label="Project image unavailable">Image not available yet</div>}
                  <div className="pd-image-overlay">
                    <span>View AI Analysis Result</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones Section */}
        <section className="pd-milestones-section">
          <div className="pd-milestones-inner">
            <h3 className="pd-milestones-title">Project Milestones</h3>
            {!project.milestones.length && <p>Milestones are not available yet.</p>}
            <div className="pd-milestones-track">
              {project.milestones.map((m, i) => (
                <div key={i} className={`pd-milestone${m.done ? ' done' : ' pending'}`}>
                  <div className="pd-milestone-dot-wrap">
                    <div className="pd-milestone-dot">
                      {m.done && <span className="pd-milestone-check"><Check size={12} strokeWidth={3} /></span>}
                    </div>
                    {i < project.milestones.length - 1 && (
                      <div className={`pd-milestone-line${m.done ? ' line-done' : ''}`} />
                    )}
                  </div>
                  <div className="pd-milestone-text">
                    <span className="pd-milestone-phase">{m.phase}</span>
                    <span className="pd-milestone-name">{m.title}</span>
                    <span className="pd-milestone-months">{m.months}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default InvestPage;
