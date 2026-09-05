import React from 'react';
import './FAQ.css';

const FAQ = () => {
  return (
    <section className="container faq-section" id="faq">
      <h2 className="section-title">FAQ</h2>
      
      <div className="faq-list">
        {[1, 2, 3, 4].map((item) => (
          <div className="faq-item" key={item}></div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
