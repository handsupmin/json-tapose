import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import JsonComparer from "./components/JsonComparer";
import SEO from "./components/SEO";
import ThemeController from "./components/ThemeController";
import { defaultTheme } from "./utils/themeUtils";

function App() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || defaultTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <SEO />
      <Header />
      <main className="container mx-auto flex-grow p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end mb-2">
            <ThemeController currentTheme={theme} onChange={setTheme} />
          </div>
          <JsonComparer />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
