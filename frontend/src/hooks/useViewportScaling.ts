import { useEffect } from 'react';

/**
 * Hook to handle viewport scaling issues in PWA mode
 * This helps prevent the app from appearing zoomed in on mobile devices
 * while still allowing user control
 */
export function useViewportScaling() {
  useEffect(() => {
    // Check if running in standalone/PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    if (isStandalone) {
      // Handle orientation changes to fix rendering issues
      const handleOrientationChange = () => {
        // Force reflow to ensure proper rendering after orientation change
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      };

      window.addEventListener('orientationchange', handleOrientationChange);
      
      // Remove any fixed positioning that might prevent scrolling
      const fixScrolling = () => {
        const appRoot = document.getElementById('root');
        if (appRoot) {
          appRoot.style.height = '100%';
          appRoot.style.overflowY = 'auto';
          appRoot.style.overflowX = 'hidden';
          // Use standard property with vendor prefix fallback
          try {
            (appRoot.style as any).webkitOverflowScrolling = 'touch';
          } catch (e) {
            // Ignore if not supported
          }
        }
        
        // Make sure body doesn't have fixed positioning
        document.body.style.position = '';
        document.body.style.overflow = 'auto';
      };
      
      // Apply fix after a short delay to ensure DOM is ready
      setTimeout(fixScrolling, 100);
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }
  }, []);
}
