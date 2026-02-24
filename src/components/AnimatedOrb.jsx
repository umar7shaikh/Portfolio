import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const AnimatedOrb = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Use springs for smooth following
    const springConfig = { damping: 40, stiffness: 100, mass: 2 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 0,
                overflow: "hidden",
            }}
        >
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    position: "absolute",
                    top: "-30vh", // offset by half size to center on cursor
                    left: "-30vh",
                    width: "60vh",
                    height: "60vh",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)", // soft electric blue
                    filter: "blur(60px)",
                    opacity: isHovering ? 1 : 0,
                    transition: "opacity 0.6s ease",
                }}
            />
        </div>
    );
};

export default AnimatedOrb;
