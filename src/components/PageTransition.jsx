import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Wraps children in a container that plays a fade-slide entrance animation
 * every time the route (location.pathname) changes.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-enter');
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Start exit animation
      setTransitionStage('page-exit');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'page-exit') {
      // Switch to new page and start enter animation
      setDisplayLocation(location);
      setTransitionStage('page-enter');
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
