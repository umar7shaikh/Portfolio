import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SmoothImage = ({ src, thumbnailSrc, alt, wrapperClassName, className, style, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    // In production, images served from cache fire `load` before React attaches
    // the onLoad handler — so the opacity stays at 0 forever. Checking
    // img.complete after mount catches those already-loaded images.
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className={`relative overflow-hidden w-full h-full ${wrapperClassName || ""}`} style={style}>
            {/* Skeleton / Pulse Loader */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-0 bg-neutral-900 overflow-hidden"
                    >
                        {/* Thumbnail blur-up */}
                        {thumbnailSrc && (
                            <img
                                src={thumbnailSrc}
                                alt="loading placeholder"
                                className="w-full h-full object-cover blur-md opacity-50 absolute inset-0 transform scale-105"
                            />
                        )}
                        {/* Shimmer effect */}
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actual Image */}
            <motion.img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`w-full h-full object-cover relative z-10 ${className || ""}`}
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                    // If the full image fails (e.g. too large / network), fall back
                    // to the thumbnail so the slot never renders blank in prod.
                    if (thumbnailSrc && e.currentTarget.src !== thumbnailSrc) {
                        e.currentTarget.src = thumbnailSrc;
                    } else {
                        setIsLoaded(true);
                    }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: "block" }} // Prevent inline spacing bugs
                {...props}
            />
        </div>
    );
};

export default SmoothImage;
