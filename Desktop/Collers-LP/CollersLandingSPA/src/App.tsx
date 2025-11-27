import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsStrip from './components/StatsStrip';
import BestSection from './components/BestSection';
import WhyJoin from './components/WhyJoin';
import LoveUs from './components/LoveUs';
import GrowCollection from './components/GrowCollection';
import ShoesCollected from './components/ShoesCollected';
import Articles from './components/Articles';
import Events from './components/Events';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <StatsStrip />
      <BestSection />
      <WhyJoin />
      <LoveUs />
      <GrowCollection />
      <ShoesCollected />
      <Articles />
      <Events />
      <CTA />
      <Footer />
    </>
  );
}

export default App;
