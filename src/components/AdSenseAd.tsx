import { useEffect, useRef } from "react";

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

  useEffect(() => {
    // Skip ad loading in development environment to avoid console errors
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      return;
    }

    try {
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
    }
  }, [adSlot, adFormat]);

  return (
    <div ref={adRef} className="adsense-container my-4">
      {/* AdSense ad will be inserted here */}
    </div>
  );
};

export default AdSenseAd;
