// src/components/Contact.jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const Contacts = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Public Key:", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    setStatus("Sending...");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (res) => {
          console.log("SUCCESS", res.status, res.text);
          setStatus("Message sent!");
          formRef.current.reset();
        },
        (err) => {
          console.error("EMAILJS ERROR", err);
          setStatus("Something went wrong. Try again.");
        }
      );
  };

  return (
    <motion.section
      id="contact"
      className="bg-black text-white py-8 md:py-12"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="mx-auto grid max-w-12xl grid-cols-1 gap-6 px-4 md:gap-1 md:px-1 md:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col justify-between px-2 py-6 md:px-6 md:py-10 lg:px-12">
          <div>
            <div className="mb-8 flex items-start gap-4 md:mb-12">
              <svg
                className="mt-1 h-8 w-8 flex-shrink-0 text-white md:h-10 md:w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
              <h2 className="font-inter text-[32px] leading-tight text-white md:text-[40px]">
                Let's get in touch
              </h2>
            </div>

            <div className="mb-8 md:mb-10">
              <p className="mb-2 font-inter text-[16px] text-gray-400 md:text-[18px]">
                Email
              </p>
              <a
                href="mailto:muhammedumarshaikh7@gmail.com"
                className="break-all font-inter text-[20px] text-white hover:text-gray-300 md:text-[22px]"
              >
                muhammedumarshaikh7@gmail.com
              </a>
            </div>

            <div className="mb-8 md:mb-10">
              <p className="mb-3 font-inter text-[16px] text-gray-400 md:text-[18px]">
                Channels
              </p>
              <div className="space-y-2">
                <a
                  href="https://github.com/umar7shaikh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-inter text-[20px] text-white hover:text-gray-300 md:text-[22px]"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammed-umar-shaikh-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-inter text-[20px] text-white hover:text-gray-300 md:text-[22px]"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <p className="mt-2 font-inter text-[14px] text-gray-500 md:mt-4 md:text-[16px]">
            © 2025 Muhammed Umar
          </p>
        </div>

        {/* Right Column - EmailJS Form */}
        <div className="px-2 pb-6 pt-2 md:px-6 md:py-10 lg:px-12">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div>
              <label
                htmlFor="user_name"
                className="mb-2 block font-inter text-[14px] text-gray-400 md:text-[16px]"
              >
                Name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                placeholder="Enter your name"
                required
                className="w-full rounded-lg bg-[#1f1f1f] px-3 py-3 font-inter text-[16px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 md:px-4 md:text-[18px]"
              />
            </div>

            <div>
              <label
                htmlFor="user_email"
                className="mb-2 block font-inter text-[14px] text-gray-400 md:text-[16px]"
              >
                Email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full rounded-lg bg-[#1f1f1f] px-3 py-3 font-inter text-[16px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 md:px-4 md:text-[18px]"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block font-inter text-[14px] text-gray-400 md:text-[16px]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Type your message"
                required
                className="w-full rounded-lg bg-[#1f1f1f] px-3 py-3 font-inter text-[16px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 md:px-4 md:text-[18px]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#2b2b2b] px-6 py-3 font-inter text-[16px] text-white transition-colors hover:bg-[#3a3a3a] md:text-[18px]"
            >
              Submit
            </button>

            {status && (
              <p className="font-inter text-[14px] text-gray-400">{status}</p>
            )}
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default Contacts;
