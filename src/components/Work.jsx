// src/components/Works.jsx
import React, { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import medbotImg from "../assets/medbot.png";
import financeImg from "../assets/finance.png";
import franccoImg from "../assets/francco.png";
import cliImg from "../assets/cli.png";
import { Link } from "react-router-dom";

const projectsData = [
  {
    id: 1,
    title: "MedBot",
    image: medbotImg,
    link: "https://github.com/yourusername/medbot",
  },
  {
    id: 2,
    title: "Financial Analyzer",
    image: financeImg,
    link: "https://github.com/yourusername/financial-analyzer",
  },
  {
    id: 3,
    title: "Franz Co",
    image: franccoImg,
    link: "https://franzco.com",
  },
  {
    id: 4,
    title: "DevStack CLI",
    image: cliImg,
    link: "https://github.com/yourusername/devstack-cli",
  },
];

const Works = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Smooth spring animation for badge position
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleProjectClick = (projectId) => {
    navigate(`/works?project=${projectId}`);
  };

  return (
    <motion.section
      id="works"
      className="relative min-h-screen bg-white"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Projects Grid with button overlay */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-1 p-1 md:grid-cols-2">
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group relative block aspect-square cursor-pointer overflow-hidden rounded-[1.5rem] border-4 border-white"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
              
              {/* Magnetic Image */}
              <motion.img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                initial={false}
                animate={hoveredProject === project.id ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* Glass Overlay + Tech Stack */}
              {hoveredProject === project.id && (
                <motion.div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm border-2 border-white/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                      <span className="font-inter text-xl font-bold text-white drop-shadow-lg">
                        {project.title}
                      </span>
                    </motion.div>
                    {/* Tech badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['React', 'Node.js', 'AI'].map((tech, i) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/30 transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Scrolling Text Banner - Centered */}
              {hoveredProject === project.id && (
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden">
                  <div className="animate-scroll flex whitespace-nowrap">
                    {[...Array(20)].map((_, i) => (
                      <span
                        key={i}
                        className="font-inter text-4xl text-white md:text-5xl lg:text-4xl"
                        style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
                      >
                        {project.title} •{" "}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* See All Works Button - Centered over grid */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Link
            to="/works"
            className="inline-block rounded-full bg-white px-8 py-3 font-inter text-sm font-medium text-black shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-2xl hover:scale-105"
          >
            See all works
          </Link>
        </div>
      </div>

      {/* Cursor-Following Badge - Top-left offset from cursor */}
      <motion.div
        className="pointer-events-none fixed z-50"
        style={{
          left: mouseX,
          top: mouseY,
          x: -80,
          y: -50,
        }}
        animate={{
          opacity: hoveredProject ? 1 : 0,
          scale: hoveredProject ? 1 : 0.8,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
      >
        <div className="rounded-full border border-white/30 bg-white/10 px-6 py-2 shadow-xl backdrop-blur-md hover:bg-white/20">
          <span className="whitespace-nowrap font-inter text-sm font-medium text-white">
            Open Project
          </span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Works;
