import { useState, useEffect } from 'react';

// Utility function to get a user's preference for reduced motion
export const usePreferredReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports matchMedia
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery?.matches || false);

    // Add listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Add event listener
    mediaQuery?.addEventListener?.('change', handleChange);

    // Clean up
    return () => {
      mediaQuery?.removeEventListener?.('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

// Function to optimize animations based on device performance
export const getOptimizedAnimationDuration = (
  baseDuration: number,
  prefersReducedMotion: boolean
): number => {
  if (prefersReducedMotion) return 0;
  
  // You could also check for low-end devices
  // This is a simple example - you might want to use more sophisticated detection
  const nav = navigator as Navigator & { deviceMemory?: number };
  const isLowEndDevice = 
    navigator.hardwareConcurrency <= 4 || 
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4);
  
  return isLowEndDevice ? baseDuration * 0.5 : baseDuration;
};

// Detect if dark mode is enabled
export const useColorScheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check
    setIsDarkMode(window.matchMedia?.('(prefers-color-scheme: dark)').matches || 
                document.documentElement.classList.contains('dark'));

    // Watch for changes to color scheme
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    
    // Watch for class changes (for manual toggles)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  return isDarkMode;
};

// Function to detect low-end devices for further optimizations
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const { hardwareConcurrency, deviceMemory } = navigator as Navigator & {
    deviceMemory?: number;
  };
  
  // Low-end device criteria
  return (
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 4) ||
    (deviceMemory !== undefined && deviceMemory < 4)
  );
};
