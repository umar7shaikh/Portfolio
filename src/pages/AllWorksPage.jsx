// src/pages/AllWorksPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import MedBotInteractiveDemo from "../components/MedBotInteractiveDemo.jsx";
import FinancialAnalyzerDemo from "../components/FinancialAnalyzerDemo.jsx";
import DevStackCLIDemo from "../components/DevStackCLIDemo.jsx";
import MotoriqDemo from "../components/MotoriqDemo.jsx";
import PravakDemo from "../components/PravakDemo/index.tsx";
import GadgetBazaarDemo from "../components/GadgetBazaarDemo/index.tsx";
import MotoriqMobile from "../components/mobile/MotoriqMobile.jsx";
import PravakMobile from "../components/mobile/PravakMobile.jsx";
import GadgetBazaarMobile from "../components/mobile/GadgetBazaarMobile.jsx";
import useIsMobile from "../components/useIsMobile.js";
import SmoothImage from "../components/SmoothImage.jsx";

import medbot1 from "../assets/medbot1.png";
import financeImg from "../assets/finance.png";
import franccoImg from "../assets/francco.png";
import franzcoScrollImg from "../assets/screencapture-franzco.jpg";
import cliImg from "../assets/cli.png";
import theLaddersImg from "../assets/screencapture-theladders-tech.png";
import motoriqCover from "../assets/motoriq-cover.svg";
import pravakCover from "../assets/pravak-cover.svg";
import gadgetbazaarCover from "../assets/gadgetbazaar-cover.svg";

const projectsData = [
  {
    id: 6,
    title: "Motoriq.in",
    client: "Motoriq (motoriq.in)",
    year: "2025",
    services: ["Spring Boot", "React 19 PWA", "Multi-tenant SaaS"],
    description: "Architected and built a multi-tenant SaaS that runs the day-to-day operations of Indian vehicle dealerships — inventory, sales, CRM, expenses and staff, each dealership fully isolated. The Spring Boot backend enforces strict tenant isolation and role-based access (Super Admin / Admin / Staff) over JWT, while the React 19 PWA delivers an installable, offline-capable dashboard with 360° vehicle viewers, QR vehicle profiles and AI-generated listings. Ships India-specific compliance including the GST Margin Scheme and RTO-ready invoices.",
    image: motoriqCover,
    isInteractiveDemo: true,
    link: "https://motoriq.in"
  },
  {
    id: 7,
    title: "Pravak AI",
    client: "Pravak AI",
    year: "2025",
    services: ["Voice AI", "Real-time Telephony", "LLM Agents"],
    description: "Designed Pravak AI, an autonomous voice agent that answers and places phone calls in natural, human-like conversation — handling appointment booking, lead qualification and customer support around the clock. The pipeline streams low-latency speech-to-text into an LLM reasoning layer with business-aware context, then expressive text-to-speech, and takes real actions like reserving slots and sending confirmations. Built to never miss a call and to hand off cleanly to a human whenever needed.",
    image: pravakCover,
    isInteractiveDemo: true,
    comingSoon: true,
    previewLink: "https://call-agent-frontend.pages.dev/"
  },
  {
    id: 8,
    title: "GadgetBazaar",
    client: "GadgetBazaar",
    year: "2025",
    services: ["Next.js 16", "Supabase", "Razorpay"],
    description: "Built a complete production e-commerce store for mobile and electronics accessories — earbuds, covers, chargers, power banks and more. The Next.js 16 storefront serves SEO-friendly server-rendered product pages with search, filtering, wishlist and cart, backed by Razorpay/UPI payments, Cash-on-Delivery and automated Shiprocket fulfilment. A full admin panel manages products, orders and a dynamic blog, all on Supabase (Postgres + storage).",
    image: gadgetbazaarCover,
    isInteractiveDemo: true,
    link: "https://ecommerce-omega-nine-38.vercel.app/"
  },
  {
    id: 1,
    title: "MedBot",
    client: "Personal Project",
    year: "2024",
    services: ["MERN Stack", "AI Integration", "Voice Features"],
    description: "Developed a smart healthcare app that seamlessly integrates AI-powered medical assistance with voice recognition. The project involved building a secure MERN stack application with JWT authentication, role-based access control, and a responsive patient-clinician interface. Integrated Llama 4 Maverick with Whisper STT and ElevenLabs TTS for real-time voice-based medical queries, allowing users to interact naturally with the AI assistant.",
    image: medbot1,
    isInteractiveDemo: true,
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
    isInteractiveDemo: true,
    link: "https://financial-analyzer-frontend.onrender.com/"
  },
  {
    id: 5,
    title: "TheLadders.tech",
    client: "TheLadders.tech",
    year: "2024",
    services: ["Technical & Marketing", "Portfolio", "Dynamic Blog System"],
    description: "Developed a comprehensive website featuring dedicated sections for both Technical and Marketing departments. The platform includes a full-featured portfolio to showcase completed works and a bespoke dynamic blog handling system, empowering the team with an easy-to-manage content architecture.",
    image: theLaddersImg,
    scrollableImage: theLaddersImg,
    link: "https://theladders.tech"
  },
  {
    id: 4,
    title: "DevStack CLI",
    client: "Open Source",
    year: "2024",
    services: ["Node.js", "CLI Development", "NPM"],
    description: "Created an automated project scaffolding tool that reduces development setup time by 75%. Executed a powerful template engine with customizable boilerplates for 10+ different frameworks including React, Vue, Angular, and Node.js. Published as an NPM package with comprehensive documentation.",
    image: cliImg,
    isInteractiveDemo: true,
    link: "https://github.com/umar7shaikh/devstack-cli"
  },
  {
    id: 3,
    title: "Franz Co",
    client: "Franz Corporation",
    year: "2024",
    services: ["React.js", "SEO Optimization", "Performance Tuning"],
    description: "Architected a high-performance corporate website supporting 10,000+ monthly visitors with modern UI/UX design. Launched a dynamic content management system with API-driven content reducing update time by 70%. Achieved 95+ Google PageSpeed score through advanced optimization techniques, improving conversion rate by 25%.",
    image: franccoImg,
    scrollableImage: franzcoScrollImg,
    link: "https://franzco.vercel.app/"
  }
];

const AllWorksPage = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");
  const isMobile = useIsMobile();

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
                          {project.isInteractiveDemo ? (
                            project.id === 1 ? (
                              <MedBotInteractiveDemo />
                            ) : project.id === 2 ? (
                              <FinancialAnalyzerDemo />
                            ) : project.id === 4 ? (
                              <DevStackCLIDemo />
                            ) : project.id === 6 ? (
                              isMobile ? <MotoriqMobile /> : <MotoriqDemo />
                            ) : project.id === 7 ? (
                              isMobile ? <PravakMobile /> : <PravakDemo />
                            ) : project.id === 8 ? (
                              isMobile ? <GadgetBazaarMobile /> : <GadgetBazaarDemo />
                            ) : null
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
