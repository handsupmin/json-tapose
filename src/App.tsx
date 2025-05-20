import { useEffect, useState } from "react";
import "./App.css";
import AdSenseAd from "./components/AdSenseAd";
import Footer from "./components/Footer";
import Header from "./components/Header";
import JsonComparer from "./components/JsonComparer";
import SEO from "./components/SEO";
import ThemeController from "./components/ThemeController";
import { JsonCompareProvider } from "./contexts/JsonCompareContext";
import { defaultTheme } from "./utils/themeUtils";

// Named constants
const CONTENT_LOAD_DELAY_MS = 1500;

// Separate component for ad container
const AdContainer = ({
  adSlot,
  className,
}: {
  adSlot: string;
  className?: string;
}) => {
  const isProduction = import.meta.env.PROD;
  const [contentLoaded, setContentLoaded] = useState(false);

  // Setup content loaded detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, CONTENT_LOAD_DELAY_MS);

    window.addEventListener("load", () => {
      setContentLoaded(true);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", () => {
        setContentLoaded(true);
      });
    };
  }, []);

  if (!isProduction || !contentLoaded) {
    return null;
  }

  return (
    <div className={className}>
      <AdSenseAd adSlot={adSlot} adFormat="in-article" />
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || defaultTheme;
  });

  // Set theme in document and localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <SEO />
      <Header />
      <main id="main-content" className="container mx-auto flex-grow p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mb-2">
            <ThemeController currentTheme={theme} onChange={setTheme} />
          </div>
          <JsonCompareProvider>
            <JsonComparer />
          </JsonCompareProvider>

          <AdContainer adSlot="9448272363" className="mt-6" />
        </div>
      </main>
      <AdContainer adSlot="3301739018" className="container mx-auto mb-4" />
      <Footer />
    </div>
  );
}

export default App;
