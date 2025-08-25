import { useEffect } from 'react';

/**
 * Hook to handle viewport scaling issues in PWA mode
 * This helps prevent the app from appearing zoomed in on mobile devices
 */
export function useViewportScaling() {
  useEffect(() => {
    // Check if running in standalone/PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    if (isStandalone) {
      // Set meta viewport dynamically for better control in PWA mode
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        // This provides better control over scaling in PWA mode
        // Note: Using maximum-scale and user-scalable is necessary for PWAs even though
        // it may trigger accessibility warnings in development
        viewportMeta.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }

      // Add event listener to ensure correct viewport when orientation changes
      const handleResize = () => {
        // Force re-render at correct scale after orientation change
        document.body.style.opacity = '0.99';
        setTimeout(() => {
          document.body.style.opacity = '1';
        }, 10);
      };

      window.addEventListener('orientationchange', handleResize);
      
      // Apply iOS-specific fixes
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Add iOS-specific class for additional styling
        document.documentElement.classList.add('ios-pwa');
        
        // Prevent bouncing/rubber-banding effect on iOS
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Re-enable scrolling on the main content
        const appRoot = document.getElementById('root');
        if (appRoot) {
          appRoot.style.overflow = 'auto';
          appRoot.style.height = '100%';
        }
      }

      return () => {
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);
}
