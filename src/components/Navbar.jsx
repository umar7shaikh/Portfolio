// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const basePill =
    "relative flex items-center gap-1 overflow-hidden rounded-[6px] " +
    "bg-black/35 backdrop-blur-xl " +
    "shadow-[0_10px_40px_rgba(0,0,0,0.65)]";

  const btnClasses =
    "relative flex-shrink-0 px-6 py-2 text-xs font-medium text-slate-100 " +
    "transition-all duration-200 hover:bg-white/10 hover:text-white";

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`
        fixed inset-x-0 z-50 flex justify-center transition-all duration-300
        ${scrolled ? "top-4" : "top-6"}
      `}
    >
      <div className="flex max-w-full gap-2 px-3">
        {/* First pill: Home, Works, About */}
        <div className={basePill}>
          <div className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-[2px] bg-white/12 blur-[18px]" />
          <button
            className={btnClasses}
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>
          <button
            className={btnClasses}
            onClick={() => scrollToSection("works")}
          >
            Works
          </button>
          <button
            className={btnClasses}
            onClick={() => scrollToSection("about")}
          >
            About
          </button>
        </div>

        {/* Second pill: Contact */}
        <div className={basePill}>
          <div className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-[2px] bg-white/12 blur-[18px]" />
          <button
            className={btnClasses}
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
