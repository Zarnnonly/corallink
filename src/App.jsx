import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Impact from './components/Impact';
import VisionMission from './components/VisionMission';
import Projects from './components/Projects';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Impact />
        <VisionMission />
        <Projects />
        <FAQ />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

export default App;
