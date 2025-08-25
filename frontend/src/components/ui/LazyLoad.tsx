import React, { Suspense, lazy, ComponentType } from "react";
import LoadingAnimation from "./LoadingAnimation";

// Using React components only to maintain compatibility with Fast Refresh
const LazyWrapper = <T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <LoadingAnimation />
) => {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// IntersectionObserver based lazy loading as a hook inside a component
const LazyLoadHook = () => {
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const registerObserver = React.useCallback(
    (node: Element | null, callback: () => void) => {
      if (!node) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback();
            observerRef.current?.disconnect();
          }
        },
        { rootMargin: "200px" }
      );

      observerRef.current.observe(node);
    },
    []
  );

  return { registerObserver };
};

// Component that defers loading until visible
export const LazyLoadComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({
  children,
  fallback = <div className="min-h-[200px] flex items-center justify-center" />,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const { registerObserver } = useLazyLoad();

  return (
    <div ref={(node) => registerObserver(node, () => setIsVisible(true))}>
      {isVisible ? children : fallback}
    </div>
  );
};
