import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Homepage from './pages/Homepage';
import AllWorksPage from './pages/AllWorksPage';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    if (!loadingComplete) return;

    const lenisOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    };
    
    const lenis = new Lenis(lenisOptions);
    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Ensure layout is captured correctly after preloader
    setTimeout(() => {
      lenis.resize();
    }, 100);

    return () => {
      lenis.destroy();
      window.lenis = null;
      cancelAnimationFrame(rafId);
    };
  }, [loadingComplete]);

  // Secondary effect to handle dynamic height changes when content becomes interactive
  useEffect(() => {
    if (loadingComplete && window.lenis) {
      const timer = setTimeout(() => {
        window.lenis.resize();
      }, 800); // After the 600ms opacity transition
      return () => clearTimeout(timer);
    }
  }, [loadingComplete]);

  return (
    <>
      <CustomCursor />
      <Preloader onLoadingComplete={() => setLoadingComplete(true)} />
      {/* App Content */}
      <div
        style={{
          opacity: loadingComplete ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: loadingComplete ? 'auto' : 'none'
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/works" element={<AllWorksPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}


export default App;