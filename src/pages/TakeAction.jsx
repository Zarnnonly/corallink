import React from 'react';
import Footer from '../components/Footer';
import './TakeAction.css';

const projects = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 }
];

const TakeAction = () => {
  return (
    <>
      <div className="take-action-page container">
        {projects.map((project) => (
          <div key={project.id} className="action-card">
            <div className="action-card-left">
              <div className="action-card-image-placeholder"></div>
              <button className="action-btn">Investment</button>
              <button className="action-btn">Join</button>
            </div>
            <div className="action-card-right">
              <h2>MAIN HEADING</h2>
              <h3>CORALLINK</h3>
              <p>
                Deskripsi dari CORALLINK deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi
              </p>
              <p>
                Deskripsi dari CORALLINK deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi
              </p>
              <p>
                Deskripsi dari CORALLINK deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi deskripsi
              </p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TakeAction;
