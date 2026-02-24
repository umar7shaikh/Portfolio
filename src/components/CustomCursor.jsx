import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            // Only hide the custom cursor based on screen width, 
            // since many modern desktop monitors/laptops have touchscreens too.
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            // Check if hovering over interactive elements
            if (
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("hover-target")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("resize", checkMobile);
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            width: 16,
            height: 16,
            backgroundColor: "#fff",
            mixBlendMode: "difference",
            transition: {
                type: "spring",
                stiffness: 700,
                damping: 40,
                mass: 0.5
            }
        },
        hover: {
            x: mousePosition.x - 30,
            y: mousePosition.y - 30,
            width: 60,
            height: 60,
            backgroundColor: "transparent",
            border: "2px solid #fff",
            mixBlendMode: "difference",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8
            }
        }
    };
    if (isMobile) return null;

    return (
        <motion.div
            variants={variants}
            animate={isHovering ? "hover" : "default"}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        />
    );
};

export default CustomCursor;
