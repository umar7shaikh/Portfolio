import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Works from '../components/Work.jsx'
import AboutMe from '../components/AboutMe.jsx'
import Contacts from '../components/ContactMe.jsx'

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        if (window.lenis) {
          // Delay slightly to ensure layout is ready
          setTimeout(() => {
            window.lenis.scrollTo(el, { duration: 1.5 });
          }, 100);
        } else {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }, [location]);

  return (
    <div>
        <Navbar />
        <Hero />
        <Works />
        <AboutMe />
        <Contacts />
    </div>
  )
}

export default Homepage
