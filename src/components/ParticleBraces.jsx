import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ParticleBraces = ({ children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        let interval;
        if (isHovered) {
            interval = setInterval(() => {
                setParticles((prev) => [
                    ...prev.slice(-12), // keep max 12 particles
                    {
                        id: Date.now() + Math.random(),
                        angle: Math.random() * Math.PI * 2,
                        distance: 15 + Math.random() * 30, // Random distance from center
                        size: Math.random() * 2 + 1,
                        duration: 0.6 + Math.random() * 0.4,
                    },
                ]);
            }, 150);
        } else {
            setParticles([]);
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                padding: "0 4px",
            }}
        >
            {/* Left Brace */}
            <motion.span
                initial={{ opacity: 0, x: 10, filter: "blur(2px)" }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? -16 : 10,
                    filter: isHovered ? "blur(0px)" : "blur(2px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    left: "-10px",
                    fontSize: "56px",
                    fontWeight: "200",
                    color: "#444",
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: "none",
                    lineHeight: 1,
                }}
            >
                {"{"}
            </motion.span>

            {/* Children content */}
            <div style={{ position: "relative", zIndex: 1 }}>{children}</div>

            {/* Right Brace */}
            <motion.span
                initial={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 16 : -10,
                    filter: isHovered ? "blur(0px)" : "blur(2px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    right: "-10px",
                    fontSize: "56px",
                    fontWeight: "200",
                    color: "#444",
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: "none",
                    lineHeight: 1,
                }}
            >
                {"}"}
            </motion.span>

            {/* Particles */}
            <AnimatePresence>
                {particles.map((p) => {
                    const x = Math.cos(p.angle) * p.distance;
                    const y = Math.sin(p.angle) * p.distance;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{
                                opacity: 0,
                                x: 0,
                                y: 0,
                                scale: 0,
                            }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                x,
                                y,
                                scale: [0, 1, 0],
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                duration: p.duration,
                                ease: "easeOut",
                            }}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: p.size,
                                height: p.size,
                                backgroundColor: "#666",
                                borderRadius: "50%",
                                pointerEvents: "none",
                                zIndex: 0,
                                marginTop: -p.size / 2,
                                marginLeft: -p.size / 2,
                                boxShadow: "0 0 6px #666",
                            }}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default ParticleBraces;
