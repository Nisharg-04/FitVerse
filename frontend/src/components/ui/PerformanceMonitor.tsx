import React, { useState, useEffect } from "react";

// Define the extended Performance interface with memory property
interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Performance monitor for development mode only
const PerformanceMonitor = () => {
  const [fps, setFps] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;

        // Memory usage if available (Chrome only)
        const extendedPerformance = performance as ExtendedPerformance;
        if (extendedPerformance.memory) {
          setMemoryUsage(
            Math.round(
              extendedPerformance.memory.usedJSHeapSize / (1024 * 1024)
            )
          );
        }
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Only start if user opts in by pressing P key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" && e.ctrlKey) {
        setShowStats((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Start/stop based on showStats
    if (showStats) {
      animationFrameId = requestAnimationFrame(measureFPS);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showStats]);

  if (!showStats || process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-0 left-0 bg-black/80 text-white px-4 py-2 text-xs z-50 font-mono">
      <div>FPS: {fps}</div>
      {memoryUsage !== null && <div>Memory: {memoryUsage} MB</div>}
      <div className="text-[10px] text-gray-400">Press Ctrl+P to hide</div>
    </div>
  );
};

export default PerformanceMonitor;
