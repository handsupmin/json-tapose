import { useCallback, useRef } from "react";

// Define the interface for scrollable elements
interface ScrollableElement {
  scrollTo: (scrollLeft: number, scrollTop: number) => void;
}

/**
 * Hook for synchronizing scroll positions between two scrollable elements
 *
 * This hook provides scroll synchronization with performance optimizations:
 * - Uses refs instead of state to avoid unnecessary re-renders
 * - Implements a sync lock to prevent infinite scroll loops
 * - Uses requestAnimationFrame for smooth scrolling
 * - Maintains separate scroll positions for both panels
 *
 * The sync lock (isScrollingSynced) is crucial for preventing infinite loops
 * that could occur when one panel's scroll triggers the other panel's scroll,
 * which in turn triggers the first panel again.
 */
export const useSyncedScroll = () => {
  // Refs to hold scroll positions (more performant than state)
  const leftScrollRef = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const rightScrollRef = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Track whether scroll is being synced to prevent infinite loop
  const isScrollingSynced = useRef<boolean>(false);

  // Direct references to component containers (used for immediate updates)
  const leftComponentRef = useRef<ScrollableElement | null>(null);
  const rightComponentRef = useRef<ScrollableElement | null>(null);

  // Register component refs
  const registerLeftComponent = useCallback((component: ScrollableElement) => {
    leftComponentRef.current = component;
  }, []);

  const registerRightComponent = useCallback((component: ScrollableElement) => {
    rightComponentRef.current = component;
  }, []);

  // Handle scroll from left panel with debounce
  const handleLeftScroll = useCallback(
    (scrollTop: number, scrollLeft: number) => {
      if (isScrollingSynced.current) return;

      // Update stored position
      leftScrollRef.current = { top: scrollTop, left: scrollLeft };

      // Set syncing flag
      isScrollingSynced.current = true;

      // Apply scroll directly if component is available
      if (rightComponentRef.current) {
        rightComponentRef.current.scrollTo(scrollLeft, scrollTop);
      }

      // Reset flag quickly
      requestAnimationFrame(() => {
        isScrollingSynced.current = false;
      });
    },
    []
  );

  // Handle scroll from right panel with debounce
  const handleRightScroll = useCallback(
    (scrollTop: number, scrollLeft: number) => {
      if (isScrollingSynced.current) return;

      // Update stored position
      rightScrollRef.current = { top: scrollTop, left: scrollLeft };

      // Set syncing flag
      isScrollingSynced.current = true;

      // Apply scroll directly if component is available
      if (leftComponentRef.current) {
        leftComponentRef.current.scrollTo(scrollLeft, scrollTop);
      }

      // Reset flag quickly
      requestAnimationFrame(() => {
        isScrollingSynced.current = false;
      });
    },
    []
  );

  return {
    registerLeftComponent,
    registerRightComponent,
    handleLeftScroll,
    handleRightScroll,
    getLeftScroll: () => leftScrollRef.current,
    getRightScroll: () => rightScrollRef.current,
  };
};
