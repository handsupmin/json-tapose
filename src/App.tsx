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

function App() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || defaultTheme;
  });

  // Check if we're in production environment
  const isProduction = import.meta.env.PROD;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <SEO />
      <Header />
      {isProduction && (
        <div className="container mx-auto">
          <AdSenseAd adSlot="9448272363" adFormat="in-article" />
        </div>
      )}
      <main id="main-content" className="container mx-auto flex-grow p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mb-2">
            <ThemeController currentTheme={theme} onChange={setTheme} />
          </div>
          <JsonCompareProvider>
            <JsonComparer />
          </JsonCompareProvider>
        </div>
      </main>
      {isProduction && (
        <div className="container mx-auto">
          <AdSenseAd adSlot="3301739018" adFormat="in-article" />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
