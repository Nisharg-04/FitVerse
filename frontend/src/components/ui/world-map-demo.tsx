"use client";
import WorldMap from "@/components/ui/world-map";
import { motion } from "framer-motion";

export default function WorldMapDemo() {
  return (
    <div className="py-20 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="font-bold text-3xl md:text-6xl dark:text-white text-black mb-4">
            Global Fitness{" "}
            <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {"Community".split("").map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </p>
          <p className="text-sm md:text-xl text-neutral-500 dark:text-neutral-400 max-w-3xl mx-auto py-4">
            Connect with fitness enthusiasts worldwide. Track workouts, share progress, 
            and find gym partners across 6 continents. Your fitness journey knows no boundaries.
          </p>
        </motion.div>
      </div>
      <div className="mt-16">
        <WorldMap
          lineColor="#ec4899"
          dots={[
            {
              start: { lat: 40.7128, lng: -74.006 }, // New York
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
            {
              start: { lat: -33.8688, lng: 151.2093 }, // Sydney
              end: { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
            },
            {
              start: { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
            {
              start: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
              end: { lat: 55.7558, lng: 37.6176 }, // Moscow
            },
            {
              start: { lat: 1.3521, lng: 103.8198 }, // Singapore
              end: { lat: 25.2048, lng: 55.2708 }, // Dubai
            },
          ]}
        />
      </div>
    </div>
  );
}
