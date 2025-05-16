import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import JsonComparer from "./components/JsonComparer";
import ThemeController from "./components/ThemeController";

function App() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || "purplewind";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
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
