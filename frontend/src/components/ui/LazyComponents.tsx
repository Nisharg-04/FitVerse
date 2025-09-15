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

// Enhanced LazySection with aggressive preloading for heavy components
export const LazyEarlySection: React.FC<{
  children: React.ReactNode;
  preloadMargin?: string;
  renderMargin?: string;
}> = ({ children, preloadMargin = "1000px", renderMargin = "300px" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPreloading, setIsPreloading] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    // Main observer for rendering
    const renderObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          renderObserver.disconnect();
        }
      },
      { rootMargin: renderMargin }
    );

    // Early preload observer
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPreloading) {
          setIsPreloading(true);
          // Start importing the component early
          import("../sections/GlobeSection").catch(console.error);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: preloadMargin }
    );

    renderObserver.observe(sectionRef.current);
    preloadObserver.observe(sectionRef.current);

    return () => {
      renderObserver.disconnect();
      preloadObserver.disconnect();
    };
  }, [preloadMargin, renderMargin, isPreloading]);

  return (
    <div ref={sectionRef}>
      {isVisible ? children : <div className="min-h-[500px]" />}
    </div>
  );
};
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

// Enhanced wrapper for heavy components like Globe with better loading state
export const GlobeSuspenseWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="py-20 dark:bg-black bg-white w-full">
          <div className="max-w-7xl mx-auto text-center px-4">
            {/* Title skeleton */}
            <div className="space-y-4 mb-16">
              <div className="h-12 md:h-16 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse mx-auto max-w-2xl" />
              <div className="h-6 bg-muted/70 rounded-lg animate-pulse mx-auto max-w-3xl" />
              <div className="h-6 bg-muted/50 rounded-lg animate-pulse mx-auto max-w-xl" />
            </div>

            {/* Map skeleton */}
            <div className="relative w-full h-[400px] md:h-[500px] bg-muted/30 rounded-xl mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="text-sm text-muted-foreground animate-pulse">
                    Loading Global Fitness Community...
                  </div>
                </div>
              </div>

              {/* Fake dots for visual appeal */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-secondary/30 rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-700" />
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
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
