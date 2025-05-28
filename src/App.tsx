import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AdSenseAd from "./components/AdSenseAd";
import ContentSections from "./components/ContentSections";
import Footer from "./components/Footer";
import Header from "./components/Header";
import JsonComparer from "./components/JsonComparer";
import JsonTreeViewer from "./components/JsonTreeViewer";
import SEO from "./components/SEO";
import ThemeController from "./components/ThemeController";
import { JsonCompareProvider } from "./contexts/JsonCompareContext";
import { defaultTheme } from "./utils/themeUtils";

const CONTENT_LOAD_DELAY_MS = 1500;
const SCROLL_OFFSET = 80;

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
  const location = useLocation();

  // Set theme in document and localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle hash anchor scrolling
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Remove the # from hash
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);

      if (element) {
        // Use setTimeout to ensure the page has rendered
        setTimeout(() => {
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - SCROLL_OFFSET;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <SEO />
      <Header
        themeController={
          <ThemeController currentTheme={theme} onChange={setTheme} />
        }
      />
      <main id="main-content" className="container mx-auto flex-grow p-4">
        <div className="flex flex-col gap-4">
          <JsonCompareProvider>
            <Routes>
              <Route path="/" element={<JsonComparer />} />
              <Route path="/treeviewer" element={<JsonTreeViewer />} />
            </Routes>
          </JsonCompareProvider>

          <AdContainer adSlot="9448272363" className="mt-6" />

          {/* Add comprehensive content sections */}
          <ContentSections />
        </div>
      </main>
      <AdContainer adSlot="3301739018" className="container mx-auto mb-4" />
      <Footer />
    </div>
  );
}

export default App;
