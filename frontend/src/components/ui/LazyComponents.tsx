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

// Create lazy-loaded components for the Index page
export const LazyGlobeSection = lazy(() => import("../sections/GlobeSection"));
export const LazyTimelineSection = lazy(
  () => import("../sections/TimelineSection")
);
export const LazyGeminiEffect = lazy(
  () => import("./google-gemini-effect-demo")
);
export const LazyFooter = lazy(() => import("../layout/Footer"));

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
