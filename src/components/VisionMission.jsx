import React from 'react';
import useScrollReveal from '../lib/useScrollReveal';
import './VisionMission.css';

const VisionMission = () => {
  const gridRef = useScrollReveal();
  const messageRef = useScrollReveal();

  return (
    <section className="container vm-section">
      <h2 className="section-title">Visi dan Misi</h2>

      <div className="vm-grid reveal-stagger" ref={gridRef}>
        {/* Kartu Visi */}
        <article className="vm-card">
          <div className="vm-card-header">
            <h3 className="vm-card-title">Our Vision</h3>
          </div>
          <div className="vm-card-body">
            <p className="vm-card-text">
              "To become the world's leading catalyst for coral reef restoration,\
              through a transparent, measurable, and inclusive collaboration ecosystem for
              generations to come."
            </p>
          </div>
        </article>

        {/* Kartu Misi */}
        <article className="vm-card">
          <div className="vm-card-header">
            <h3 className="vm-card-title">Our Mission</h3>
          </div>
          <div className="vm-card-body">
            <ol className="vm-list">
              <li>
                <strong>Support Mobilisation:</strong> Opening up access to sustainable
                funding for grassroots conservation initiatives.
              </li>
              <li>
                <strong>Data Transparency:</strong> Providing an accountable digital
                monitoring system for all stakeholders.
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
          'The coral bleaching crisis calls for swift action and decentralised funding.
          CoralLink is here to align long-term ecological benefits with a more sustainable
          future for our oceans.'
        </p>
      </div>
    </section>
  );
};

export default VisionMission;