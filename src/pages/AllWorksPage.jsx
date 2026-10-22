// src/pages/AllWorksPage.jsx
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import SmoothImage from "../components/SmoothImage.jsx";
import { projects } from "../data/projects.js";

// Each demo is its own chunk, fetched when its project is expanded.
const DEMOS = {
  9: lazy(() => import("../components/demos/ErpEdgeDemo.jsx")),
  6: lazy(() => import("../components/demos/MotoriqDemo.jsx")),
  7: lazy(() => import("../components/demos/PravakDemo.jsx")),
  1: lazy(() => import("../components/demos/MedBotDemo.jsx")),
};


const projectsData = projects;

const AllWorksPage = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  // Set initial expanded project from URL or default to first project
  const [expandedProject, setExpandedProject] = useState(
    projectIdFromUrl ? parseInt(projectIdFromUrl) : projectsData[0].id
  );

  // Refs for detail sections
  const detailRefs = useRef({});

  // Open the project named in the URL whenever it changes (state adjusted
  // during render rather than in an effect, per the React docs).
  const [urlProject, setUrlProject] = useState(projectIdFromUrl);
  if (projectIdFromUrl !== urlProject) {
    setUrlProject(projectIdFromUrl);
    if (projectIdFromUrl) setExpandedProject(parseInt(projectIdFromUrl));
  }

  // Scroll to the project from the URL
  useEffect(() => {
    if (projectIdFromUrl) {
      const projectId = parseInt(projectIdFromUrl);

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

      <div className="pt-32 pb-16 px-6 md:px-16 lg:px-24 w-full">
        <header className="mb-24 flex justify-between items-end border-b border-[#333] pb-8">
          <div>
            <p className="text-gray-400 text-[11px] uppercase tracking-[0.2em] mb-4">Detailed Work</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">PROJECTS.</h1>
          </div>
          <Link to="/" className="text-gray-400 text-[11px] uppercase tracking-[0.2em] hover:text-white transition-colors mb-2">
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
                className="border-b border-gray-800 last:border-none pb-4"
              >
                {/* Header Section */}
                <div
                  onClick={() => toggleProject(project.id)}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-12 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-8">
                    <span className="text-gray-600 font-mono text-sm">{projectIndex}</span>
                    <h2 className={`text-4xl md:text-6xl font-bold tracking-tight transition-all duration-500 ${isExpanded ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {project.title}
                    </h2>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-12">
                    <div className="hidden md:block text-right">
                      <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Category</p>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">{project.services[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Year</p>
                      <p className="text-gray-400 text-xs font-mono">{project.year}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-gray-500"
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
                          {DEMOS[project.id] ? (
                            <Suspense fallback={<div className="aspect-[16/11] rounded-xl border border-gray-800 bg-[#111318]" />}>
                              {React.createElement(DEMOS[project.id])}
                            </Suspense>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.8 }}
                              className="relative aspect-[4/3] md:aspect-video rounded-lg overflow-hidden border border-gray-800 group"
                            >
                              <SmoothImage
                                src={project.scrollableImage || project.image}
                                thumbnailSrc={project.image}
                                alt={project.title}
                                className={`w-full h-full object-cover grayscale group-hover:grayscale-0 portfolio-img ${project.scrollableImage
                                  ? 'object-top group-hover:object-bottom portfolio-img-scroll'
                                  : ''
                                  }`}
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                            </motion.div>
                          )}
                        </div>

                        {/* Info Column */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                          <div className="space-y-12">
                            <div>
                              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-4">Description</p>
                              <p className="text-gray-300 text-lg leading-relaxed">
                                {project.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-4">Client</p>
                                <p className="text-gray-300 text-sm">{project.client}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-4">Scope</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                  {project.services.map((s) => (
                                    <span key={s} className="text-gray-300 text-sm">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-16 flex flex-wrap items-center gap-6">
                            {project.comingSoon || !project.link ? (
                              <span className="inline-flex items-center gap-3 py-4 px-8 border border-gray-700 text-gray-400 text-xs font-bold uppercase tracking-widest cursor-default">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Launching Soon
                              </span>
                            ) : (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 py-4 px-8 bg-[#f0f0f0] text-[#0a0a0a] text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                              >
                                Launch Project [↗]
                              </a>
                            )}
                            {project.previewLink && (
                              <a
                                href={project.previewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-700 pb-1 hover:text-white hover:border-white transition-colors"
                              >
                                Preview the app [↗]
                              </a>
                            )}
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
