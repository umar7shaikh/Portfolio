// src/components/AboutMe.jsx
import React from "react";
import { motion } from "framer-motion";
import myImage from "../assets/myimage.png";

const AboutMe = () => {
  const services = [
    "Full-Stack Web Development",
    "Frontend Development (React.js)",
    "Mobile App Design",
    "Backend API Development",
    "Database Design & Optimization",
    "Website Design",
    "Cloud Deployment (AWS/Azure)",
    "AI/ML Integration",
  ];

  const experience = [
    {
      year: "2024 - 2025",
      role: "Software Development Engineer Intern",
      company: "Rebert Technologies Pvt. Ltd.",
    },
    {
      year: "2023",
      role: "Frontend Developer Intern",
      company: "ITJOBXS",
    },
    {
      year: "2021 - 2025",
      role: "B.E. Computer Engineering",
      company: "Trinity College",
    },
  ];

  return (
    <motion.section
      id="about"
      className="relative bg-white py-8 md:min-h-screen"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-2">
        {/* Left Grid - Text Content */}
        <div className="relative overflow-hidden rounded-[1.5rem] border-4 border-white bg-white">
          <div className="flex flex-col pt-8 pl-3 pr-4 pb-10 md:pt-12 md:pl-4 md:pr-12 md:pb-16">
            {/* About Me Section */}
            <div className="mb-12 md:mb-16">
              <h2 className="font-inter text-[32px] md:text-[40px] text-black">
                About me
              </h2>
              <div className="mt-6 space-y-4">
                <p className="font-inter text-[18px] md:text-[24px] leading-[1.4] tracking-tight text-black">
                  My journey into development began with a fascination for how
                  technology can solve real-world problems and transform user
                  experiences. I'm passionate about building scalable web
                  applications and crafting clean, efficient code that makes a
                  difference. From healthcare to finance, I thrive on
                  understanding unique project requirements and delivering
                  solutions that exceed expectations.
                </p>
                <p className="font-inter text-[18px] md:text-[24px] leading-[1.4] tracking-tight text-black">
                  When I'm not coding, you'll find me exploring new frameworks,
                  contributing to open-source projects, or diving into AI and
                  machine learning. I believe that continuous learning is the
                  key to growth, and I'm always eager to bring innovative
                  approaches to software development.
                </p>
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-12 md:mb-16">
              <h3 className="font-inter text-[32px] md:text-[40px] text-black">
                Services
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {services.map((service, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-4 py-2 md:px-6 md:py-3 font-inter text-[16px] md:text-[20px] text-black"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <h3 className="font-inter text-[32px] md:text-[40px] text-black">
                Experience
              </h3>
              <div className="mt-4 md:mt-6">
                {experience.map((item, index) => (
                  <div key={index}>
                    <div className="py-3 md:py-4 font-inter text-[18px] md:text-[24px] text-black">
                      {item.year}: {item.role} @{item.company}
                    </div>
                    <hr className="border-t border-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid - Image (sticky only on md+) */}
        <div className="relative mt-4 h-80 md:mt-0 md:h-screen md:sticky md:top-1">
          <div className="h-full w-full overflow-hidden rounded-[1.5rem] border-4 border-white">
            <img
              src={myImage}
              alt="Muhammed Umar"
              className="h-full w-full object-cover grayscale"
              style={{ objectPosition: "center 32%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-gray-900/30" />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutMe;
