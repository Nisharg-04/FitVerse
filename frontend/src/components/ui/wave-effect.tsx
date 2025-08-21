"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

export const WaveEffect = ({ className }: { className?: string }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const animate = async () => {
      while (true) {
        await controls.start({
          pathLength: 1,
          transition: { duration: 2, ease: "easeInOut" },
        });
        await controls.start({
          pathLength: 0,
          transition: { duration: 0 },
        });
      }
    };

    animate();
  }, [controls]);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path
          d="M0 100 Q360 50 720 100 Q1080 150 1440 100"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={controls}
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
            <stop offset="0%" stopColor="#4FABFF" />
            <stop offset="50%" stopColor="#B1C5FF" />
            <stop offset="100%" stopColor="#FFB7C5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
