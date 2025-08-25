import React, { useEffect, useRef } from "react";

interface MapContainerProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * A specialized component for map containers in PWA mode
 * Prevents unwanted zooming and improves touch handling
 */
export const MapContainer: React.FC<MapContainerProps> = ({
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if running in standalone/PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone && containerRef.current) {
      // Add touch event handlers for PWA mode
      const container = containerRef.current;

      // Prevent pinch zoom on the map container
      const preventZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      // Add event listeners
      container.addEventListener("touchstart", preventZoom, { passive: false });
      container.addEventListener("touchmove", preventZoom, { passive: false });

      return () => {
        // Clean up event listeners
        container.removeEventListener("touchstart", preventZoom);
        container.removeEventListener("touchmove", preventZoom);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`map-container touch-manipulation ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
