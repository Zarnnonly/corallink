import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Impact from '../components/Impact';
import VisionMission from '../components/VisionMission';
import Projects from '../components/Projects';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home = () => {
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
