"use client";

import { useRef, useMemo, memo, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import DottedMap from "dotted-map";
import { useStore } from "@/store/useStore";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const WorldMap = memo(function WorldMap({
  dots = [],
  lineColor = "#ec4899", // Pink color that matches website theme
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const [isMapReady, setIsMapReady] = useState(false);

  const { theme } = useStore();

  // Defer heavy computation until component is needed
  useEffect(() => {
    if (isInView && !isMapReady) {
      // Use requestIdleCallback to avoid blocking the main thread
      const idleCallback = (deadline: IdleDeadline) => {
        if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
          setIsMapReady(true);
        } else {
          requestIdleCallback(idleCallback);
        }
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(idleCallback);
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => setIsMapReady(true), 100);
      }
    }
  }, [isInView, isMapReady]);

  // Memoize the map creation since it involves calculations
  const svgMap = useMemo(() => {
    if (!isMapReady) return null;

    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: theme === "dark" ? "#FFFFFF40" : "#00000040",
      shape: "circle",
      backgroundColor: theme === "dark" ? "black" : "white",
    });
  }, [theme, isMapReady]);

  // Memoize point projection function
  const projectPoint = useMemo(
    () => (lat: number, lng: number) => {
      const x = (lng + 180) * (800 / 360);
      const y = (90 - lat) * (400 / 180);
      return { x, y };
    },
    []
  );

  // Memoize curved path creation
  const createCurvedPath = useMemo(
    () => (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midX = (start.x + end.x) / 2;
      const midY = Math.min(start.y, end.y) - 50;
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    },
    []
  );

  // Memoize projected points for dots
  const projectedDots = useMemo(
    () =>
      dots.map((dot) => ({
        ...dot,
        startPoint: projectPoint(dot.start.lat, dot.start.lng),
        endPoint: projectPoint(dot.end.lat, dot.end.lng),
      })),
    [dots, projectPoint]
  );

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans"
    >
      {isMapReady && svgMap ? (
        <>
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
            alt="world map"
            height="495"
            width="1056"
            draggable={false}
          />
          <svg
            ref={svgRef}
            viewBox="0 0 800 400"
            className="w-full h-full absolute inset-0 pointer-events-none select-none"
          >
            {projectedDots.map((dot, i) => {
              return (
                <g key={`path-group-${i}`}>
                  <motion.path
                    d={createCurvedPath(dot.startPoint, dot.endPoint)}
                    fill="none"
                    stroke="url(#path-gradient)"
                    strokeWidth="2"
                    initial={{
                      pathLength: 0,
                    }}
                    animate={{
                      pathLength: isInView ? 1 : 0,
                    }}
                    transition={{
                      duration: 2,
                      delay: isInView ? 0.5 * i : 0,
                      ease: "easeOut",
                    }}
                    key={`start-upper-${i}`}
                  ></motion.path>
                </g>
              );
            })}

            <defs>
              <linearGradient
                id="path-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {projectedDots.map((dot, i) => (
              <g key={`points-group-${i}`}>
                <g key={`start-${i}`}>
                  <motion.circle
                    cx={dot.startPoint.x}
                    cy={dot.startPoint.y}
                    r="3"
                    fill={lineColor}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      scale: isInView ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: isInView ? 0.5 * i + 1 : 0,
                    }}
                  />
                  <motion.circle
                    cx={dot.startPoint.x}
                    cy={dot.startPoint.y}
                    r="3"
                    fill={lineColor}
                    opacity="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 0.5 : 0 }}
                    transition={{
                      duration: 0.6,
                      delay: isInView ? 0.5 * i + 1 : 0,
                    }}
                  >
                    {isInView && (
                      <>
                        <animate
                          attributeName="r"
                          from="3"
                          to="12"
                          dur="2s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="2s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </>
                    )}
                  </motion.circle>
                </g>
                <g key={`end-${i}`}>
                  <motion.circle
                    cx={dot.endPoint.x}
                    cy={dot.endPoint.y}
                    r="3"
                    fill={lineColor}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      scale: isInView ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: isInView ? 0.5 * i + 1.5 : 0,
                    }}
                  />
                  <motion.circle
                    cx={dot.endPoint.x}
                    cy={dot.endPoint.y}
                    r="3"
                    fill={lineColor}
                    opacity="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 0.5 : 0 }}
                    transition={{
                      duration: 0.6,
                      delay: isInView ? 0.5 * i + 1.5 : 0,
                    }}
                  >
                    {isInView && (
                      <>
                        <animate
                          attributeName="r"
                          from="3"
                          to="12"
                          dur="2s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="2s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </>
                    )}
                  </motion.circle>
                </g>
              </g>
            ))}
          </svg>
        </>
      ) : (
        // Loading placeholder with same aspect ratio
        <div className="w-full aspect-[2/1] bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

export default WorldMap;
