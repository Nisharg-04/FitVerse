import React from "react";
import { motion } from "framer-motion";
import WorldMapDemo from "@/components/ui/world-map-demo";

export default function GlobeSection() {
  return (
    <section className="py-0 bg-background relative overflow-hidden">
      <WorldMapDemo />
    </section>
  );
}