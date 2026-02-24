import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const MagneticButton = ({ children, onClick, className = "", style = {} }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring physics for smooth return
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();

        // Calculate center of button
        const xCenter = left + width / 2;
        const yCenter = top + height / 2;

        // Calculate distance from center (dampened)
        const xDist = (clientX - xCenter) * 0.2;
        const yDist = (clientY - yCenter) * 0.2;

        x.set(xDist);
        y.set(yDist);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                ...style,
                x,
                y,
                position: "relative",
                zIndex: 10,
            }}
            className={`hover-target ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
};

export default MagneticButton;
