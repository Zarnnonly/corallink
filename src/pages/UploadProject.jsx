import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './UploadProject.css';
import { useProjects } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';

const UploadProject = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    projectName: '',
    species: '',
    location: '',
    description: '',
    fundingGoal: '',
    duration: '',
    fragments: '',
    area: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'loading' | 'passed' | 'failed'
  const [verificationResult, setVerificationResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setVerificationStatus(null);
      setVerificationResult(null);
    }
  };

  const handleVerify = async () => {
    if (!imageFile) return;

    setVerificationStatus('loading');
    setVerificationResult(null);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('file', imageFile);

      const response = await fetch('https://api.corallink.web.id/predict', {
        method: 'POST',
        body: formDataPayload,
      });

      const data = await response.json();

      // Try to extract condition from various possible response formats
      const condition = (
        data.condition ||
        data.prediction ||
        data.result ||
        data.class ||
        data.label ||
        ''
      ).toLowerCase();

      if (condition.includes('healthy') && !condition.includes('unhealthy')) {
        setVerificationStatus('failed');
        setVerificationResult({
          condition: data.condition || data.prediction || data.result || data.class || data.label || 'Healthy',
          confidence: data.confidence || data.confidence_score || data.score || null,
          message: 'Image indicates healthy coral. This project cannot be uploaded because only damaged or unhealthy coral reefs qualify for restoration projects.',
        });
      } else {
        setVerificationStatus('passed');
        setVerificationResult({
          condition: data.condition || data.prediction || data.result || data.class || data.label || 'Unhealthy',
          confidence: data.confidence || data.confidence_score || data.score || null,
          message: 'Image verified! Coral appears damaged or unhealthy. This project qualifies for restoration funding.',
        });
      }
    } catch (error) {
      setVerificationStatus('failed');
      setVerificationResult({
        condition: 'Error',
        confidence: null,
        message: `Verification failed: ${error.message}. Please try again or check your connection.`,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationStatus !== 'passed') return;

    // Save new project to localStorage
    const newProject = {
      id: formData.projectName.toLowerCase().replace(/\s+/g, '-'),
      name: formData.projectName.toUpperCase(),
      subtitle: `${formData.species} Restoration Project`,
      description: formData.description,
      location: formData.location,
      species: formData.species,
      status: 'Needs Restoration',
      statusColor: '#E53935',
      goal: {
        fragments: `${formData.fragments} coral fragments`,
        area: `${formData.area} m² restoration area`,
        duration: `${formData.duration} months project duration`,
      },
      fundingTarget: `Rp ${Number(formData.fundingGoal).toLocaleString('id-ID')}`,
      fundingPercent: 0,
      milestones: [
        { phase: 'Phase 1', title: 'Site Assessment & Coral Collection', months: 'Month 1–3', done: false },
        { phase: 'Phase 2', title: 'Nursery Cultivation & Growth Monitoring', months: 'Month 4–9', done: false },
        { phase: 'Phase 3', title: 'Reef Transplantation', months: 'Month 10–14', done: false },
        { phase: 'Phase 4', title: 'Monitoring & Reporting', months: 'Month 15–18', done: false },
      ],
      condition: verificationResult?.condition || 'Unhealthy',
      conditionType: 'unhealthy',
      confidenceScore: verificationResult?.confidence ? `${(verificationResult.confidence * 100).toFixed(2)}%` : 'N/A',
      analysisStatus: 'Verified',
      characteristics: ['Coral condition assessed via AI image analysis.'],
      supportingFactors: ['Environmental data pending field assessment.'],
      whyThisMatters: ['Restoring damaged coral reefs helps rebuild marine biodiversity and protect coastal communities.'],
      recommendations: ['Conduct regular monitoring to track restoration progress.'],
      image: imagePreview || '',
    };

    addProject(newProject);
    showToast('Project uploaded successfully!', 'success');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <div className="upload-page">
          <div className="upload-success-card">
            <div className="success-icon">&#10003;</div>
            <h2>Project Uploaded Successfully!</h2>
            <p>Your coral restoration project <strong>{formData.projectName}</strong> has been submitted for review.</p>
            <div className="success-actions">
              <button className="success-btn primary" onClick={() => navigate('/take-action')}>
                View All Projects
              </button>
              <button className="success-btn secondary" onClick={() => { setSubmitted(false); setFormData({ projectName: '', species: '', location: '', description: '', fundingGoal: '', duration: '', fragments: '', area: '' }); setImageFile(null); setImagePreview(null); setVerificationStatus(null); setVerificationResult(null); }}>
                Upload Another Project
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="upload-page">
        <div className="upload-container">
          <div className="upload-header">
            <h1>Upload New Project</h1>
            <p>Submit a new coral restoration project. Your coral image must be verified by our AI system before the project can be published.</p>
          </div>

          <form className="upload-form" onSubmit={handleSubmit}>
            {/* Section 1: ML Verification */}
            <div className="upload-section verification-section">
              <div className="section-number">1</div>
              <div className="section-content">
                <h2>AI Coral Verification</h2>
                <p className="section-desc">Upload a photo of the coral reef. Our AI will analyze the image to confirm it needs restoration.</p>

                <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">&#128247;</span>
                      <span>Click to select coral image</span>
                      <span className="upload-hint">JPG, PNG, WEBP (max 10MB)</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    hidden
                  />
                </div>

                {imageFile && (
                  <button
                    type="button"
                    className={`verify-btn ${verificationStatus === 'loading' ? 'loading' : ''}`}
                    onClick={handleVerify}
                    disabled={verificationStatus === 'loading'}
                  >
                    {verificationStatus === 'loading' ? (
                      <>
                        <span className="spinner"></span>
                        Analyzing...
                      </>
                    ) : (
                      '🔬 Verify Coral Image'
                    )}
                  </button>
                )}

                {verificationResult && (
                  <div className={`verification-result ${verificationStatus}`}>
                    <div className="vr-header">
                      <span className="vr-icon">{verificationStatus === 'passed' ? '✅' : '❌'}</span>
                      <span className="vr-condition">
                        Detected: <strong>{verificationResult.condition}</strong>
                      </span>
                      {verificationResult.confidence && (
                        <span className="vr-confidence">
                          Confidence: {typeof verificationResult.confidence === 'number'
                            ? `${(verificationResult.confidence * 100).toFixed(1)}%`
                            : verificationResult.confidence}
                        </span>
                      )}
                    </div>
                    <p className="vr-message">{verificationResult.message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Project Details */}
            <div className={`upload-section details-section ${verificationStatus !== 'passed' ? 'locked' : ''}`}>
              <div className="section-number">2</div>
              <div className="section-content">
                <h2>Project Details</h2>
                {verificationStatus !== 'passed' && (
                  <div className="lock-overlay">
                    <span>🔒 Complete AI verification first</span>
                  </div>
                )}
                <p className="section-desc">Provide details about the coral restoration project.</p>

                <div className="form-grid">
                  <div className="form-group full">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="e.g., Acropora Cervicornis Restoration"
                      required
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Species *</label>
                    <input
                      type="text"
                      name="species"
                      value={formData.species}
                      onChange={handleInputChange}
                      placeholder="e.g., Acropora cervicornis"
                      required
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Raja Ampat, Indonesia"
                      required
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the current condition and restoration goals..."
                      rows={4}
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Funding Goal (Rp) *</label>
                    <input
                      type="text"
                      name="fundingGoal"
                      value={formData.fundingGoal}
                      onChange={handleInputChange}
                      placeholder="e.g., 60.000.000"
                      required
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Duration (months)</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 18"
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Coral Fragments Target</label>
                    <input
                      type="text"
                      name="fragments"
                      value={formData.fragments}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                  <div className="form-group">
                    <label>Restoration Area (m²)</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      disabled={verificationStatus !== 'passed'}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-project-btn"
                  disabled={verificationStatus !== 'passed'}
                >
                  Upload Project
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadProject;
