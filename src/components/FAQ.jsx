import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How does CoralLink connect conservation organisations with investors?",
      answer: "CoralLink provides a curated platform where verified conservation organisations can list their reef restoration projects, and investors can browse, evaluate, and fund these projects directly. We facilitate transparent connections and provide due diligence."
    },
    {
      question: "How do investors monitor the performance and accountability of the funds disbursed?",
      answer: "Investors receive regular progress reports, including financial breakdowns, impact metrics, and photographic evidence. Our platform includes a dashboard for tracking milestones and a third-party audit system to ensure funds are used as intended."
    },
    {
      question: "Is this funding purely a donation, or is there a return on investment?",
      answer: "CoralLink offers both donation-based and investment-based models. Some projects are purely philanthropic, while others provide a financial return through mechanisms like blue carbon credits or eco-tourism revenue sharing. Each project clearly states its funding type."
    },
    {
      question: "Who can register a conservation project on CoralLink?",
      answer: "Any legally registered non-profit, NGO, community group, or research institution working on coral reef conservation can apply. Projects undergo a vetting process to ensure they meet our standards for impact and transparency."
    }
  ];

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container faq-section" id="faq">
      <h2 className="section-title">FAQ</h2>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            className={`faq-item ${openIndex === index ? 'active' : ''}`}
            key={index}
          >
            <button
              className="faq-question"
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;