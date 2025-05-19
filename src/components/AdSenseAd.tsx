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

const AdSenseAd: React.FC<AdSenseAdProps> = ({ adSlot, adFormat = "auto" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const adClient = "ca-pub-6022353980017733"; // Your AdSense Client ID
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Skip ad loading in development environment to avoid console errors
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      console.log("AdSense ads are disabled in development environment");
      return;
    }

    let timeoutId: number;

    try {
      // Set a timeout to detect if ad fails to load
      timeoutId = window.setTimeout(() => {
        if (!adLoaded && adRef.current?.children.length === 0) {
          // If no ad content after 2 seconds, consider it failed
          setAdError(true);
        }
      }, 2000);

      // Wait for adsense script to load
      if (window.adsbygoogle) {
        // Create an ad unit
        const adElement = document.createElement("ins");
        adElement.className = "adsbygoogle";
        adElement.style.display = "block";
        adElement.style.textAlign = "center";

        // Set specific attributes based on adFormat
        if (adFormat === "in-article") {
          adElement.setAttribute("data-ad-layout", "in-article");
          adElement.setAttribute("data-ad-format", "fluid");
        } else {
          adElement.setAttribute("data-ad-format", adFormat);
        }

        adElement.setAttribute("data-ad-client", adClient);
        adElement.setAttribute("data-ad-slot", adSlot);

        // Listen for ad load
        adElement.addEventListener("load", () => {
          setAdLoaded(true);
        });

        // Clear current content and append the new ad element
        if (adRef.current) {
          adRef.current.innerHTML = "";
          adRef.current.appendChild(adElement);

          // Push the ad to adsense for rendering
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
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
  }, [adSlot, adFormat, adLoaded]);

  // Return null (no element) when ad fails to load to prevent empty space
  if (adError) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={`adsense-container ${adLoaded ? "my-2" : "h-0"}`}
    >
      {/* AdSense ad will be inserted here */}
    </div>
  );
};

export default AdSenseAd;
