import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, .hover-target";

// Position lives in motion values, so mouse movement never re-renders React.
// The dot is centred with translate(-50%, -50%) and grows with scale, so the
// hover state never shifts its position.
const CustomCursor = () => {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [pressed, setPressed] = useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const springX = useSpring(x, { stiffness: 1200, damping: 60, mass: 0.3 });
    const springY = useSpring(y, { stiffness: 1200, damping: 60, mass: 0.3 });

    useEffect(() => {
        // Only show it for a real mouse, so touch laptops keep working on touch
        // and phones never see it.
        const query = window.matchMedia("(hover: hover) and (pointer: fine)");
        const update = () => setEnabled(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!enabled) return;
        document.documentElement.classList.add("has-custom-cursor");

        let first = true;
        const onMove = (e) => {
            if (first) {
                // Jump straight to the pointer instead of flying in from a corner.
                springX.jump(e.clientX);
                springY.jump(e.clientY);
                first = false;
            }
            x.set(e.clientX);
            y.set(e.clientY);
            setVisible(true);
        };
        const onOver = (e) => setHovering(!!e.target.closest?.(INTERACTIVE));
        const onLeave = () => setVisible(false);
        const onDown = () => setPressed(true);
        const onUp = () => setPressed(false);
        // The 3D work section reports hovers over canvas objects this way.
        const onCanvasHover = (e) => setHovering(!!e.detail);

        window.addEventListener("cursor-hover", onCanvasHover);
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerover", onOver, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        return () => {
            document.documentElement.classList.remove("has-custom-cursor");
            window.removeEventListener("cursor-hover", onCanvasHover);
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerover", onOver);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
        };
    }, [enabled, x, y, springX, springY]);

    if (!enabled) return null;

    const scale = (hovering ? 3.2 : 1) * (pressed ? 0.8 : 1);

    return (
        <motion.div
            aria-hidden
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
                zIndex: 9999,
                mixBlendMode: "difference",
            }}
        >
            <motion.div
                animate={{ scale, opacity: visible ? 1 : 0 }}
                transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#fff",
                }}
            />
        </motion.div>
    );
};

export default CustomCursor;
