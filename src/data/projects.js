// Single source of truth for the projects, shared by the 3D city on the home
// page and the detailed /works page. `key` names the building in city.glb.
import theLaddersImg from "../assets/screencapture-theladders-tech.webp";

export const projects = [
  {
    id: 9,
    key: "erp",
    title: "ERP Edge",
    category: "Enterprise / AI ERP",
    year: "2026",
    role: "Senior Architect & Team Lead",
    client: "AI Global Tech Solutions",
    accent: "#f59e0b",
    services: ["Spring Boot", "React + TypeScript", "AI Assistant (MCP)"],
    stack: ["Java 21", "Spring Boot", "React", "TypeScript", "PostgreSQL", "pgvector", "MCP"],
    summary:
      "An AI-enabled ERP that runs an apparel manufacturer end to end, from first sample to final dispatch. I designed the architecture, built the core and led the engineering team.",
    highlights: [
      "65 of 65 scoped items live in production",
      "100+ features delivered beyond scope",
      "Multi-tenant: one codebase, a schema per company",
    ],
    description:
      "Designed, built and led the team behind ERP Edge, an AI-enabled ERP that runs an apparel manufacturer's entire order lifecycle: sampling, costing, orders, procurement, production, quality, packing and dispatch. As senior architect I set the multi-tenant design (one codebase, a PostgreSQL schema per company), the Spring Boot and React + TypeScript platform, and a release pipeline where every change is proven on staging and every release has a tested rollback. Delivered 65 of 65 scoped items into production plus 100+ features beyond scope, including GST invoicing, Hindi and Marathi, a multi-company admin console, six photo-evidenced QC checkpoints and an in-app AI assistant built on MCP and pgvector.",
  },
  {
    id: 6,
    key: "motoriq",
    title: "Motoriq.in",
    category: "SaaS / Automotive",
    year: "2025",
    role: "Architect & Full-Stack Engineer",
    client: "Motoriq (motoriq.in)",
    accent: "#6366f1",
    services: ["Spring Boot", "React 19 PWA", "Multi-tenant SaaS"],
    stack: ["Spring Boot", "React 19", "PostgreSQL", "PWA", "JWT"],
    summary:
      "Multi-tenant SaaS that runs Indian vehicle dealerships: inventory, sales, CRM, expenses and staff, with GST Margin Scheme and RTO-ready invoices built in.",
    highlights: [
      "Strict tenant isolation with role-based access",
      "Installable, offline-capable React 19 PWA",
      "360° vehicle viewer and AI-written listings",
    ],
    description:
      "Architected and built a multi-tenant SaaS that runs the day-to-day operations of Indian vehicle dealerships: inventory, sales, CRM, expenses and staff, each dealership fully isolated. The Spring Boot backend enforces strict tenant isolation and role-based access (Super Admin / Admin / Staff) over JWT, while the React 19 PWA delivers an installable, offline-capable dashboard with 360° vehicle viewers, QR vehicle profiles and AI-generated listings. Ships India-specific compliance including the GST Margin Scheme and RTO-ready invoices.",
    link: "https://motoriq.in",
  },
  {
    id: 7,
    key: "pravak",
    title: "Pravak AI",
    category: "AI / Voice Agents",
    year: "2025",
    role: "Architect & Engineer",
    client: "Pravak AI",
    accent: "#22d3ee",
    services: ["Voice AI", "Real-time Telephony", "LLM Agents"],
    stack: ["Streaming STT", "LLM Agents", "TTS", "Telephony", "React"],
    summary:
      "An autonomous voice agent that answers and places phone calls in natural conversation, books appointments, qualifies leads and hands off to a human cleanly.",
    highlights: [
      "Low-latency streaming STT to LLM to TTS pipeline",
      "Takes real actions: books slots, sends confirmations",
      "Clean human handoff when it matters",
    ],
    description:
      "Designed Pravak AI, an autonomous voice agent that answers and places phone calls in natural, human-like conversation, handling appointment booking, lead qualification and customer support around the clock. The pipeline streams low-latency speech-to-text into an LLM reasoning layer with business-aware context, then expressive text-to-speech, and takes real actions like reserving slots and sending confirmations. Built to never miss a call and to hand off cleanly to a human whenever needed.",
    comingSoon: true,
    previewLink: "https://call-agent-frontend.pages.dev/",
  },
  {
    id: 1,
    key: "medbot",
    title: "MedBot",
    category: "AI / Healthcare",
    year: "2024",
    role: "Full-Stack Engineer",
    client: "Personal Project",
    accent: "#34d399",
    services: ["MERN Stack", "AI Integration", "Voice Features"],
    stack: ["MongoDB", "Express", "React", "Node.js", "Whisper", "ElevenLabs"],
    summary:
      "A voice-first AI medical assistant: speak a question, get a grounded answer back in natural speech, with secure patient and clinician roles.",
    highlights: [
      "Whisper STT and ElevenLabs TTS round trip",
      "JWT auth with role-based access",
      "Patient and clinician views",
    ],
    description:
      "Developed a smart healthcare app that integrates AI-powered medical assistance with voice recognition. The project involved building a secure MERN stack application with JWT authentication, role-based access control, and a responsive patient-clinician interface. Integrated Llama 4 Maverick with Whisper STT and ElevenLabs TTS for real-time voice-based medical queries, allowing users to interact naturally with the AI assistant.",
    link: "https://ai-medbot.vercel.app/",
  },
  {
    id: 5,
    key: "ladders",
    title: "TheLadders.tech",
    category: "Web / Content Platform",
    year: "2024",
    role: "Full-Stack Engineer",
    client: "TheLadders.tech",
    accent: "#bfe0ff",
    services: ["Technical & Marketing", "Portfolio", "Dynamic Blog System"],
    stack: ["React", "Node.js", "CMS", "SEO"],
    summary:
      "Company site with separate technical and marketing sections, a portfolio of delivered work and a bespoke blog engine the team runs themselves.",
    highlights: [
      "Custom blog and content system",
      "Portfolio of delivered client work",
      "Built for the team to update without a developer",
    ],
    description:
      "Developed a comprehensive website featuring dedicated sections for both Technical and Marketing departments. The platform includes a full-featured portfolio to showcase completed works and a bespoke dynamic blog handling system, empowering the team with an easy-to-manage content architecture.",
    image: theLaddersImg,
    scrollableImage: theLaddersImg,
    link: "https://theladders.tech",
  },
];
