import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Works from '../components/Work.jsx'
import AboutMe from '../components/AboutMe.jsx'
import Contacts from '../components/ContactMe.jsx'

const Homepage = () => {
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
