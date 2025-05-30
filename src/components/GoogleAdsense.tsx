import { useEffect } from "react";

export const GoogleAdsense = () => {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="googlesyndication.com"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6022353980017733";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
};
