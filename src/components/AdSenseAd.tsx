import { useEffect, useRef, useState } from "react";

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
const MIN_CONTENT_HEIGHT_PX = 300;
const AD_LOAD_TIMEOUT_MS = 2000;

const AdSenseAd: React.FC<AdSenseAdProps> = ({ adSlot, adFormat = "auto" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [contentAvailable, setContentAvailable] = useState(false);

  // Check content availability on mount and resize
  useEffect(() => {
    const checkContentAvailability = () => {
      const mainContent = document.getElementById("main-content");
      const hasAdequateContent = !!(
        mainContent && mainContent.offsetHeight > MIN_CONTENT_HEIGHT_PX
      );
      setContentAvailable(hasAdequateContent);
    };

    checkContentAvailability();
    window.addEventListener("resize", checkContentAvailability);

    return () => {
      window.removeEventListener("resize", checkContentAvailability);
    };
  }, []);

  // Handle ad creation and loading
  useEffect(() => {
    // Skip ad loading if not appropriate
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment || !contentAvailable) {
      console.log(
        "AdSense ads are disabled in development environment or no content available"
      );
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
    } catch (error) {
      console.error("Error loading AdSense ad:", error);
      setAdError(true);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [adSlot, adFormat, adLoaded, contentAvailable]);

  // Helper function to create and configure ad element
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
    ? "adsense-container my-4 p-2 bg-base-200 rounded"
    : "adsense-container h-0 overflow-hidden";

  return (
    <div ref={adRef} className={containerClassName}>
      {!adLoaded && (
        <div className="text-xs text-center text-base-content/50">
          Advertisement
        </div>
      )}
      {/* AdSense ad will be inserted here */}
    </div>
  );
};

export default AdSenseAd;
