import React from 'react';
import { LampContainer } from '@/components/ui/lamp';
import { motion } from 'framer-motion';

const LampDemo = () => {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        FitVerse Lamp <br /> Effect Demo
      </motion.h1>
      <motion.p
        initial={{ opacity: 0.5, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-6 text-center text-lg text-slate-400 max-w-2xl"
      >
        Experience the stunning lamp effect - a beautiful lighting animation 
        that creates an elegant atmosphere for your fitness journey.
      </motion.p>
    </LampContainer>
  );
};

export default LampDemo;
