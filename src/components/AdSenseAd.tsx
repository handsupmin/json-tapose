import { useEffect, useRef, useState } from "react";

/**
 * AdSenseAd Component
 *
 * Dynamically loads and displays a Google AdSense ad based on content availability and user engagement.
 * - Only renders ads if the main content is sufficiently long, has enough words, and the user has interacted with the tool.
 * - Handles ad loading, error detection, and responsive display.
 * - Hides ads in development mode or if requirements are not met.
 *
 * Props:
 * - adSlot: AdSense slot ID
 * - adFormat: AdSense format (auto, fluid, rectangle, etc.)
 */
// Define window.adsbygoogle type
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdSenseAdProps {
  adSlot: string;
  adFormat?:
    | "auto"
    | "fluid"
    | "rectangle"
    | "horizontal"
    | "vertical"
    | "in-article";
}

// Named constants for clarity
const AD_CLIENT = "ca-pub-6022353980017733";
const MIN_CONTENT_HEIGHT_PX = 800;
const AD_LOAD_TIMEOUT_MS = 3000;
const MIN_CONTENT_WORDS = 300;

const AdSenseAd: React.FC<AdSenseAdProps> = ({ adSlot, adFormat = "auto" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [contentAvailable, setContentAvailable] = useState(false);

  /**
   * Check if the main content is long enough, has enough words, and user has engaged.
   * Only then allow ads to be shown.
   */
  useEffect(() => {
    const checkContentAvailability = () => {
      const mainContent = document.getElementById("main-content");
      if (!mainContent) {
        setContentAvailable(false);
        return;
      }
      // Check content height
      const hasAdequateHeight =
        mainContent.offsetHeight > MIN_CONTENT_HEIGHT_PX;
      // Check content word count
      const textContent = mainContent.textContent || "";
      const wordCount = textContent.trim().split(/\s+/).length;
      const hasAdequateWords = wordCount > MIN_CONTENT_WORDS;
      // Check if user has interacted with the tool (has JSON content)
      const hasJsonContent =
        textContent.includes("Compare JSON") &&
        (textContent.includes("Left JSON") ||
          textContent.includes("Right JSON"));
      // Only show ads if there's substantial content AND user engagement
      const shouldShowAd =
        hasAdequateHeight && hasAdequateWords && hasJsonContent;
      setContentAvailable(shouldShowAd);
    };
    // Initial check
    checkContentAvailability();
    // Check periodically for content updates
    const interval = setInterval(checkContentAvailability, 2000);
    // Check on resize
    window.addEventListener("resize", checkContentAvailability);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", checkContentAvailability);
    };
  }, []);

  /**
   * Handle ad creation and loading. Only runs if not in development and content is available.
   * Sets error state if ad fails to load in time.
   */
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment || !contentAvailable) {
      // Skip ad loading in development or if not enough content
      return;
    }
    let timeoutId: number;
    try {
      // Set a timeout to detect if ad fails to load
      timeoutId = window.setTimeout(() => {
        const adHasNoContent =
          !adLoaded && adRef.current?.children.length === 0;
        if (adHasNoContent) {
          setAdError(true);
        }
      }, AD_LOAD_TIMEOUT_MS);
      if (!window.adsbygoogle) {
        return;
      }
      // Create and configure the ad element
      const adElement = createAdElement(adFormat, adSlot);
      // Insert the ad element into the DOM
      if (adRef.current) {
        adRef.current.innerHTML = "";
        adRef.current.appendChild(adElement);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      setAdError(true);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [adSlot, adFormat, adLoaded, contentAvailable]);

  /**
   * Helper to create and configure the AdSense <ins> element
   */
  const createAdElement = (
    format: AdSenseAdProps["adFormat"],
    slot: string
  ) => {
    const adElement = document.createElement("ins");
    adElement.className = "adsbygoogle";
    adElement.style.display = "block";
    adElement.style.textAlign = "center";
    // Configure format-specific attributes
    if (format === "in-article") {
      adElement.setAttribute("data-ad-layout", "in-article");
      adElement.setAttribute("data-ad-format", "fluid");
    } else {
      adElement.setAttribute("data-ad-format", format || "auto");
    }
    adElement.setAttribute("data-ad-client", AD_CLIENT);
    adElement.setAttribute("data-ad-slot", slot);
    // Listen for ad load
    adElement.addEventListener("load", () => {
      setAdLoaded(true);
    });
    return adElement;
  };

  // Don't render anything if ad shouldn't be shown
  if (adError || !contentAvailable) {
    return null;
  }

  const containerClassName = adLoaded
    ? "adsense-container my-8 p-4 bg-base-200 rounded-lg border border-base-300"
    : "adsense-container h-0 overflow-hidden";

  return (
    <div ref={adRef} className={containerClassName}>
      {!adLoaded && (
        <div className="text-xs text-center text-base-content/50 py-2">
          Advertisement
        </div>
      )}
      {/* AdSense ad will be inserted here */}
    </div>
  );
};

export default AdSenseAd;
