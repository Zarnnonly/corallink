import React from 'react';
import useScrollReveal from '../lib/useScrollReveal';
import './VisionMission.css';

const VisionMission = () => {
  const gridRef = useScrollReveal();
  const messageRef = useScrollReveal();

  return (
    <section className="container vm-section">
      <h2 className="section-title">Vision & Mission</h2>

      <div className="vm-grid reveal-stagger" ref={gridRef}>
        {/* Vision Card */}
        <article className="vm-card">
          <div className="vm-card-header">
            <h3 className="vm-card-title">Our Vision</h3>
          </div>
          <div className="vm-card-body">
            <p className="vm-card-text">
              "To be the leading global catalyst in saving the world's coral
              reefs through a transparent, measurable, and inclusive green
              investment ecosystem for future generations."
            </p>
          </div>
        </article>

        {/* Mission Card */}
        <article className="vm-card">
          <div className="vm-card-header">
            <h3 className="vm-card-title">Our Mission</h3>
          </div>
          <div className="vm-card-body">
            <ol className="vm-list">
              <li>
                <strong>Capital Mobilisation:</strong> Opening up access to
                sustainable funding for grassroots conservation initiatives
              </li>
              <li>
                <strong>Data Transparency:</strong> Providing an accountable
                digital monitoring system for investors.
              </li>
              <li>
                <strong>Community Impact:</strong> Empowering the economies of
                coastal communities around restoration sites.
              </li>
            </ol>
          </div>
        </article>
      </div>

      <div className="vm-message reveal-fade-up" ref={messageRef}>
        <p>
          'The coral bleaching crisis calls for swift action and decentralised
          funding. CoralLink is here to align long-term ecological benefits
          with the sustainability goals of its investor partners.'
        </p>
      </div>
    </section>
  );
};

export default VisionMission;