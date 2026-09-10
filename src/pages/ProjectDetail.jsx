import ProjectState from '../components/ProjectState';
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './ProjectDetail.css';
import { useProjects } from '../context/ProjectContext';

const conditionColors = {
  healthy: { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  unhealthy: { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' },
  atrisk: { bg: '#FFF8E1', text: '#E65100', border: '#FFE082' },
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, loading, error } = useProjects();
  const project = getProject(projectId);

  if (loading || error) return <div className="container"><ProjectState /></div>;

  if (!project) {
    return (
      <div className="pdv2-not-found">
        <h2>Project not found.</h2>
        <Link to="/take-action">Back to Take Action</Link>
      </div>
    );
  }

  const cond = conditionColors[project.conditionType] || { bg: '#eee', text: '#555', border: '#ddd' };

  return (
    <>
      <div className="pdv2-page">

        {/* Header Bar */}
        <div className="pdv2-header-bar">
          <button onClick={() => navigate(-1)} className="pdv2-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}>&#8592;</button>
          <h1 className="pdv2-header-title">Detail Project</h1>
        </div>

        {/* Main Card */}
        <div className="pdv2-card">

          {/* Image + AI Result Row */}
          <div className="pdv2-top-row">
            <div className="pdv2-img-wrap">
              {project.image ? <img src={project.image} alt={project.name} className="pdv2-coral-img" /> : <div role="img" aria-label="Project image unavailable">Image not available yet</div>}
            </div>

            <div className="pdv2-ai-block">
              <h2 className="pdv2-ai-title">AI Analysis Result</h2>

              <div className="pdv2-ai-row">
                <span className="pdv2-ai-label">Detected Condition</span>
                <span
                  className="pdv2-condition-badge"
                  style={{ background: cond.bg, color: cond.text, border: `1px solid ${cond.border}` }}
                >
                  {project.condition}
                </span>
              </div>

              <div className="pdv2-ai-row">
                <span className="pdv2-ai-label">Confidence Score</span>
                <span className="pdv2-confidence-badge">{project.confidenceScore}</span>
              </div>

              <div className="pdv2-ai-row">
                <span className="pdv2-ai-label">Analysis Status</span>
                <span className="pdv2-status-badge">{project.analysisStatus}</span>
              </div>
            </div>
          </div>

          <hr className="pdv2-divider" />

          {/* Characteristics */}
          <div className="pdv2-section">
            <h3 className="pdv2-section-title">Characteristics</h3>
            <ul className="pdv2-bullet-list">
              {!project.characteristics.length && <li>Not available yet.</li>}
              {project.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Supporting Factors */}
          <div className="pdv2-section">
            <h3 className="pdv2-section-title">Supporting Factors</h3>
            <ul className="pdv2-bullet-list">
              {!project.supportingFactors.length && <li>Not available yet.</li>}
              {project.supportingFactors.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Why This Matters */}
          <div className="pdv2-section">
            <h3 className="pdv2-section-title">Why This Matters</h3>
            <ul className="pdv2-bullet-list">
              {!project.whyThisMatters.length && <li>Not available yet.</li>}
              {project.whyThisMatters.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="pdv2-section">
            <h3 className="pdv2-section-title">Recommendations:</h3>
            <ul className="pdv2-bullet-list">
              {!project.recommendations.length && <li>Not available yet.</li>}
              {project.recommendations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetail;
