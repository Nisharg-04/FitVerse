import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative w-40 h-20">
        {/* Running person animation */}
        <motion.div
          className="absolute bottom-0 left-0"
          animate={{
            x: [0, 80, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="30"
            height="40"
            viewBox="0 0 30 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M15 8C17.7614 8 20 5.76142 20 3C20 0.238576 17.7614 -2 15 -2C12.2386 -2 10 0.238576 10 3C10 5.76142 12.2386 8 15 8Z"
              fill="currentColor"
              className="text-primary"
            />
            <motion.g
              animate={{
                rotate: [-15, 15, -15],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.path
                d="M15 12C15 12 14 15 8 15C2 15 0 22 0 22L4 24C4 24 6 18 10 18C14 18 15 20 15 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
              />
              <motion.path
                d="M15 12C15 12 16 15 22 15C28 15 30 22 30 22L26 24C26 24 24 18 20 18C16 18 15 20 15 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
              />
              <motion.path
                d="M15 20V30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
              />
              <motion.path
                d="M15 30L10 38"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
              />
              <motion.path
                d="M15 30L20 38"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Ground/track */}
        <motion.div className="absolute bottom-0 w-full h-1 bg-muted-foreground/30 rounded-full" />

        {/* Loading text */}
        <div className="absolute -bottom-10 w-full text-center text-sm font-medium text-muted-foreground">
          Loading FitVerse...
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
