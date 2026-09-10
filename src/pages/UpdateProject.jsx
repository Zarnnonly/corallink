import React, { useState } from 'react';
import Footer from '../components/Footer';
import './UpdateProject.css';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';

const statusOptions = ['Not Started', 'In Progress', 'Complete'];

const UpdateProject = () => {
  const { projects, updateMilestones } = useProjects();
  const { showToast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [milestoneUpdates, setMilestoneUpdates] = useState([]);
  const [progressNote, setProgressNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleProjectSelect = (e) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    setSubmitted(false);
    const project = projects.find((p) => p.id === id);
    if (project) {
      setMilestoneUpdates(
        project.milestones.map((m) => ({
          phase: m.phase,
          title: m.title,
          months: m.months,
          status: m.done ? 'Complete' : 'Not Started',
        }))
      );
    } else {
      setMilestoneUpdates([]);
    }
  };

  const handleStatusChange = (index, newStatus) => {
    setMilestoneUpdates((prev) =>
      prev.map((m, i) => (i === index ? { ...m, status: newStatus } : m))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProjectId) return;

    updateMilestones(selectedProjectId, selectedProject?.name, milestoneUpdates, progressNote);
    
    showToast('Project milestones updated successfully!', 'success');
    setSubmitted(true);
  };

  return (
    <>
      <div className="update-page">
        <div className="update-container">
          <div className="update-header">
            <h1>Update Project Progress</h1>
            <p>Select a coral restoration project and update its milestone progress to keep investors informed.</p>
          </div>

          <form className="update-form" onSubmit={handleSubmit}>
            {/* Project Selector */}
            <div className="update-card">
              <h2>Select Project</h2>
              <select
                className="project-select"
                value={selectedProjectId}
                onChange={handleProjectSelect}
                required
              >
                <option value="" disabled>— Choose a project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.subtitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Milestones Update */}
            {selectedProject && (
              <div className="update-card">
                <h2>Milestone Progress</h2>
                <p className="update-card-desc">Update the status of each phase for <strong>{selectedProject.name}</strong>.</p>

                <div className="milestones-list">
                  {milestoneUpdates.map((m, i) => (
                    <div key={i} className="milestone-row">
                      <div className="milestone-info">
                        <span className="milestone-phase-badge">{m.phase}</span>
                        <div className="milestone-details">
                          <span className="milestone-title">{m.title}</span>
                          <span className="milestone-months">{m.months}</span>
                        </div>
                      </div>
                      <div className="milestone-status-select">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`status-chip ${m.status === opt ? 'active' : ''} ${opt.toLowerCase().replace(' ', '-')}`}
                            onClick={() => handleStatusChange(i, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Note */}
                <div className="progress-note-section">
                  <label>Progress Notes</label>
                  <textarea
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    placeholder="Describe what work has been completed, any challenges, and next steps..."
                    rows={5}
                  />
                </div>

                <button type="submit" className="update-submit-btn">
                  Submit Progress Update
                </button>
              </div>
            )}

            {/* Success Message */}
            {submitted && (
              <div className="update-success">
                <span className="update-success-icon">&#10003;</span>
                <div>
                  <h3>Progress Updated Successfully!</h3>
                  <p>The milestone data for <strong>{selectedProject?.name}</strong> has been saved. Investors will be notified of the progress update.</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProject;
