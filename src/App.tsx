import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import ContentSections from "./components/ContentSections";
import Footer from "./components/Footer";
import Header from "./components/Header";
import JsonComparer from "./components/JsonComparer";
import JsonTreeViewer from "./components/JsonTreeViewer";
import SEO from "./components/SEO";
import ThemeController from "./components/ThemeController";
import { JsonCompareProvider } from "./contexts/JsonCompareContext";
import { getDefaultTheme } from "./utils/themeUtils";

const SCROLL_OFFSET = 80;

function App() {
  const [theme, setTheme] = useState<string>(() => {
    // Check if user has a saved preference, otherwise use system preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || getDefaultTheme();
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
          {/* Add comprehensive content sections */}
          <ContentSections />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
