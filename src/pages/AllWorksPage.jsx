// src/pages/AllWorksPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import medbotImg from "../assets/medbot.png";
import financeImg from "../assets/finance.png";
import franccoImg from "../assets/francco.png";
import cliImg from "../assets/cli.png";

const projectsData = [
  {
    id: 1,
    title: "MedBot",
    client: "Personal Project",
    year: "2024",
    services: ["MERN Stack", "AI Integration", "Voice Features"],
    description: "Developed a smart healthcare app that seamlessly integrates AI-powered medical assistance with voice recognition. The project involved building a secure MERN stack application with JWT authentication, role-based access control, and a responsive patient-clinician interface. Integrated Llama 4 Maverick with Whisper STT and ElevenLabs TTS for real-time voice-based medical queries, allowing users to interact naturally with the AI assistant.",
    image: medbotImg,
    link: "https://ai-medbot.vercel.app/"
  },
  {
    id: 2,
    title: "Financial Analyzer",
    client: "FinTech Solutions",
    year: "2024",
    services: ["React", "FastAPI", "AI Agents"],
    description: "Built a production-ready financial analysis system with background processing, multi-user support, and responsive React interface. The platform features advanced document processing capabilities, real-time analysis, and AI-powered investment recommendations using CrewAI multi-agent system for comprehensive market research.",
    image: financeImg,
    link: "https://financial-analyzer-frontend.onrender.com/"
  },
  {
    id: 3,
    title: "Franz Co",
    client: "Franz Corporation",
    year: "2024",
    services: ["React.js", "SEO Optimization", "Performance Tuning"],
    description: "Architected a high-performance corporate website supporting 10,000+ monthly visitors with modern UI/UX design. Launched a dynamic content management system with API-driven content reducing update time by 70%. Achieved 95+ Google PageSpeed score through advanced optimization techniques, improving conversion rate by 25%.",
    image: franccoImg,
    link: "https://franzco.vercel.app/"
  },
  {
    id: 4,
    title: "DevStack CLI",
    client: "Open Source",
    year: "2024",
    services: ["Node.js", "CLI Development", "NPM"],
    description: "Created an automated project scaffolding tool that reduces development setup time by 75%. Executed a powerful template engine with customizable boilerplates for 10+ different frameworks including React, Vue, Angular, and Node.js. Published as an NPM package with comprehensive documentation.",
    image: cliImg,
    link: "https://github.com/umar7shaikh/devstack-cli"
  }
];

const AllWorksPage = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");
  
  // Set initial expanded project from URL or default to first project
  const [expandedProject, setExpandedProject] = useState(
    projectIdFromUrl ? parseInt(projectIdFromUrl) : projectsData[0].id
  );

  // Refs for detail sections
  const detailRefs = useRef({});

  // Handle URL parameter changes and scroll to project
  useEffect(() => {
    if (projectIdFromUrl) {
      const projectId = parseInt(projectIdFromUrl);
      setExpandedProject(projectId);
      
      // Scroll to the specific project after a short delay
      setTimeout(() => {
        const element = document.getElementById(`project-${projectId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [projectIdFromUrl]);

  const toggleProject = (projectId) => {
    if (expandedProject === projectId) {
      // Collapse
      setExpandedProject(null);
    } else {
      // Expand and scroll to details
      setExpandedProject(projectId);
      
      // Wait for animation to start, then scroll to details
      setTimeout(() => {
        const detailElement = detailRefs.current[projectId];
        if (detailElement) {
          detailElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* All Projects */}
      <div className="space-y-2 p-2">
        {projectsData.map((project) => {
          const isExpanded = expandedProject === project.id;
          
          return (
            <motion.div 
              key={project.id}
              id={`project-${project.id}`}
              layout
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Hero Image Section - Clickable with rounded corners and dark overlay */}
              <motion.div
                onClick={() => toggleProject(project.id)}
                className="relative h-[70vh] w-full cursor-pointer overflow-hidden rounded-[1.5rem] border-4 border-white"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Static Text Overlay - Centered */}
                <div className="absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2 text-center">
                  <h2 className="font-inter text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                      style={{ textShadow: "2px 2px 12px rgba(0,0,0,0.9)" }}>
                    {project.title}
                  </h2>
                </div>
              </motion.div>

              {/* Project Details Section - Expandable with animation */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.section
                    ref={(el) => (detailRefs.current[project.id] = el)}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full overflow-hidden px-0"
                  >
                    <div className="py-16">
                      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        {/* Left Column - Meta Info */}
                        <motion.div 
                          className="space-y-8 px-8 md:px-12 lg:px-16"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <div>
                            <h3 className="font-inter text-sm font-medium text-gray-500">Client</h3>
                            <p className="mt-2 font-inter text-lg text-black">{project.client}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-inter text-sm font-medium text-gray-500">Year</h3>
                            <p className="mt-2 font-inter text-lg text-black">{project.year}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-inter text-sm font-medium text-gray-500">Services</h3>
                            <ul className="mt-2 space-y-1">
                              {project.services.map((service, index) => (
                                <li key={index} className="font-inter text-lg text-black">
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>

                        {/* Right Column - Description */}
                        <motion.div 
                          className="px-8 md:col-span-2 md:px-12 lg:px-16"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <p className="font-inter text-2xl leading-relaxed text-black md:text-3xl">
                            {project.description}
                          </p>
                          
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-block rounded-full bg-black px-8 py-3 font-inter text-sm font-medium text-white transition-colors hover:bg-gray-800"
                          >
                            See project
                          </a>
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AllWorksPage;
