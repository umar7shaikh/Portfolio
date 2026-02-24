import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // We want an immediate, snappy reaction for brutalism, but spring is smooth. 
    // We'll use a very stiff spring.
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(-100, springConfig);
    const cursorY = useSpring(-100, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            // Check if hovering over clickable elements
            if (
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('a') ||
                e.target.closest('button') ||
                e.target.classList.contains('hover-target')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    // Handle touch screens where cursor shouldn't exist
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#fff",
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
                zIndex: 99999,
                mixBlendMode: "difference", /* The magic: automatically inverts colors */
            }}
            animate={{
                scale: isHovering ? 4 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <motion.span
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#000",
                    fontSize: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: "bold",
                    letterSpacing: "0.1em",
                    opacity: isHovering ? 1 : 0,
                }}
                animate={{
                    rotate: isHovering ? 360 : 0
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
                VIEW
            </motion.span>
        </motion.div>
    );
};

export default CustomCursor;
