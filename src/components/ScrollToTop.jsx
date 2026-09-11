import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`scroll-to-top${visible ? ' visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTop;
