import React from 'react';
import './Impact.css';

const Impact = () => {
  return (
    <section className="container impact-section">
      <h2 className="section-title">Impact</h2>
      
      <div className="impact-grid">
        {/* Left side: Bars and Icons */}
        <div className="impact-left">
          <div className="impact-bars">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
          </div>
          
          <div className="impact-icons">
            <div className="icon-group">
              <div className="icon-circle"></div>
              <div className="icon-base"></div>
              <div className="icon-line"></div>
            </div>
            <div className="icon-group">
              <div className="icon-circle"></div>
              <div className="icon-base"></div>
              <div className="icon-line"></div>
            </div>
            <div className="icon-group">
              <div className="icon-circle"></div>
              <div className="icon-base"></div>
              <div className="icon-line"></div>
            </div>
          </div>
        </div>

        {/* Right side: Stat blocks */}
        <div className="impact-right">
          {[1, 2, 3].map((item) => (
            <div className="stat-card" key={item}>
              <div className="stat-square"></div>
              <div className="stat-lines">
                <div className="stat-line-short"></div>
                <div className="stat-line-long"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
