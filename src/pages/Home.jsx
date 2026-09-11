import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Impact from '../components/Impact';
import VisionMission from '../components/VisionMission';
import Projects from '../components/Projects';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home = () => {
  const { hash } = useLocation();

  // Smooth-scroll to the target section when navigating from another page
  useEffect(() => {
    if (hash) {
      // Small delay to ensure DOM is rendered after page transition
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <>
      <main>
        <Hero />
        <About />
        <Impact />
        <VisionMission />
        <Projects />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;
