import React, { Suspense, lazy } from "react";
import LoadingAnimation from "./LoadingAnimation";

// LazySection component for lazy loading sections
export const LazySection: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef}>
      {isVisible ? children : <div className="min-h-[200px]" />}
    </div>
  );
};

// Enhanced LazySection with preloading for map components
export const LazyMapSection: React.FC<{
  children: React.ReactNode;
  onPreload?: () => void;
}> = ({ children, onPreload }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPreloaded, setIsPreloaded] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    // Preload observer with larger margin for earlier loading
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPreloaded) {
          setIsPreloaded(true);
          onPreload?.();
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "500px" } // Start preloading when 500px away
    );

    observer.observe(sectionRef.current);
    preloadObserver.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      preloadObserver.disconnect();
    };
  }, [isPreloaded, onPreload]);

  return (
    <div ref={sectionRef}>
      {isVisible ? children : <div className="min-h-[400px]" />}
    </div>
  );
};

// Create lazy-loaded components for the Index page
export const LazyGlobeSection = lazy(() => import("../sections/GlobeSection"));
export const LazyTimelineSection = lazy(
  () => import("../sections/TimelineSection")
);
export const LazyGeminiEffect = lazy(
  () => import("./google-gemini-effect-demo")
);
export const LazyFooter = lazy(() => import("../layout/Footer"));

// Lazy-loaded DeliveryMap for better performance
export const LazyDeliveryMap = lazy(() => import("../../pages/DeliveryMap"));

// Wrapper for lazy components with Suspense
export const SuspenseWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

// Enhanced wrapper for map components with better loading state
export const MapSuspenseWrapper: React.FC<{
  children: React.ReactNode;
  height?: number;
}> = ({ children, height = 400 }) => {
  return (
    <Suspense
      fallback={
        <div
          className={`relative w-full flex items-center justify-center bg-muted/30 rounded-lg border border-border/50 h-[400px]`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-muted-foreground animate-pulse">
              Loading map...
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
