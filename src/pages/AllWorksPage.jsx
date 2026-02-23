// src/pages/AllWorksPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

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
    // Set background to dark
    document.body.style.backgroundColor = "#0a0a0a";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [projectIdFromUrl]);

  const toggleProject = (projectId) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
      setTimeout(() => {
        const detailElement = detailRefs.current[projectId];
        if (detailElement) {
          detailElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] font-inter">
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-12 lg:px-16 max-w-[1440px] mx-auto">
        <header className="mb-24 flex justify-between items-end border-b border-[#1a1a1a] pb-8">
          <div>
            <p className="text-[#333] text-[11px] uppercase tracking-[0.2em] mb-4">Detailed Work</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">PROJECTS.</h1>
          </div>
          <Link to="/" className="text-[#555] text-[11px] uppercase tracking-[0.2em] hover:text-white transition-colors mb-2">
            Back to Home →
          </Link>
        </header>

        <div className="space-y-4">
          {projectsData.map((project, index) => {
            const isExpanded = expandedProject === project.id;
            const projectIndex = (index + 1).toString().padStart(2, '0');

            return (
              <motion.div
                key={project.id}
                id={`project-${project.id}`}
                layout
                className="border-b border-[#141414] last:border-none pb-4"
              >
                {/* Header Section */}
                <div
                  onClick={() => toggleProject(project.id)}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-12 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-8">
                    <span className="text-[#1a1a1a] font-mono text-sm">{projectIndex}</span>
                    <h2 className={`text-4xl md:text-6xl font-bold tracking-tight transition-all duration-500 ${isExpanded ? 'text-white' : 'text-[#222] group-hover:text-[#444]'}`}>
                      {project.title}
                    </h2>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-12">
                    <div className="hidden md:block text-right">
                      <p className="text-[#1a1a1a] text-[10px] uppercase tracking-widest mb-1">Category</p>
                      <p className="text-[#333] text-xs uppercase tracking-wider">{project.services[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#1a1a1a] text-[10px] uppercase tracking-widest mb-1">Year</p>
                      <p className="text-[#333] text-xs font-mono">{project.year}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-[#222]"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Details Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      ref={(el) => (detailRefs.current[project.id] = el)}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-12">
                        {/* Image Column */}
                        <div className="lg:col-span-7">
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-video rounded-lg overflow-hidden border border-[#1a1a1a]"
                          >
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                          </motion.div>
                        </div>

                        {/* Info Column */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                          <div className="space-y-12">
                            <div>
                              <p className="text-[#333] text-[10px] uppercase tracking-[0.2em] mb-4">Description</p>
                              <p className="text-[#888] text-lg leading-relaxed">
                                {project.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <p className="text-[#333] text-[10px] uppercase tracking-[0.2em] mb-4">Client</p>
                                <p className="text-[#aaa] text-sm">{project.client}</p>
                              </div>
                              <div>
                                <p className="text-[#333] text-[10px] uppercase tracking-[0.2em] mb-4">Scope</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                  {project.services.map((s) => (
                                    <span key={s} className="text-[#aaa] text-sm">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-16">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-4 py-4 px-8 bg-[#f0f0f0] text-[#0a0a0a] text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                            >
                              Launch Project [↗]
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllWorksPage;
