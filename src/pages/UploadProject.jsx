import React, { useState, useRef } from 'react';
import { predict } from '../lib/api';
import Footer from '../components/Footer';
import './UploadProject.css';
import { useToast } from '../context/ToastContext';

const UploadProject = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { showToast('Choose a JPG, PNG or WEBP image up to 10MB.', 'error'); return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setVerificationStatus(null);
      setVerificationResult(null);
    }
  };

  const handleVerify = async () => {
    if (!imageFile || verificationStatus === 'loading') return;

    setVerificationStatus('loading');
    setVerificationResult(null);

    try {
      const data = await predict(imageFile);
      setVerificationStatus('passed');
      setVerificationResult({ ...data, message: 'AI estimate only. This result does not approve a project or funding.' });
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
    showToast('Project publishing with cover images is not available yet.', 'info');
  };

  return (
    <>
      <div className="upload-page">
        <div className="upload-container">
          <div className="upload-header">
            <h1>Upload New Project</h1>
            <p>Project publishing with cover images is not available yet. You can still analyze a coral image below.</p>
          </div>

          <form className="upload-form" onSubmit={handleSubmit}>
            {/* Section 1: ML Verification */}
            <div className="upload-section verification-section">
              <div className="section-number">1</div>
              <div className="section-content">
                <h2>AI Coral Analysis</h2>
                <p className="section-desc">Upload a photo of the coral reef. Our AI will estimate its condition for review.</p>

                <div className="image-upload-area" role="button" tabIndex={0} aria-label="Select coral image" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }} onClick={() => fileInputRef.current?.click()}>
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
                    accept="image/jpeg,image/png,image/webp"
                    disabled={verificationStatus === 'loading'}
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
                      {verificationResult.confidence != null && (
                        <span className="vr-confidence">
                          Confidence: {typeof verificationResult.confidence === 'number'
                            ? `${verificationResult.confidence.toFixed(1)}%`
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
            <div className={`upload-section details-section locked`}>
              <div className="section-number">2</div>
              <div className="section-content">
                <h2>Project Details</h2>
                {(
                  <div className="lock-overlay">
                    <span>🔒 Project publishing is not available yet</span>
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
                      disabled
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
                      disabled
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
                      disabled
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
                      disabled
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
                      disabled
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
                      disabled
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
                      disabled
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
                      disabled
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-project-btn"
                  disabled
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
