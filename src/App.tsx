import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import ComparePage from "./components/ComparePage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import JsonTreeViewer from "./components/JsonTreeViewer";
import SEO from "./components/SEO";
import ThemeController from "./components/ThemeController";
import {
  FormatModeProvider,
  useFormatMode,
} from "./contexts/FormatModeContext";
import { WideViewProvider } from "./contexts/WideViewProvider";
import { useWideView } from "./hooks/useWideView";
import { getDefaultTheme } from "./utils/themeUtils";

const SCROLL_OFFSET = 80;

const SEO_BY_PATH: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string;
    url: string;
  }
> = {
  "/treeviewer": {
    title: "JSONtapose Tree Viewer - Interactive JSON Tree Visualizer",
    description:
      "Explore JSON data in an interactive tree view with expand/collapse at any depth. Free online JSON tree visualizer - paste your JSON and navigate complex nested structures instantly. 100% client-side.",
    keywords:
      "JSON tree viewer, JSON tree visualizer, JSON explorer, interactive JSON viewer, JSON navigator, nested JSON viewer, JSON structure viewer, online JSON tree",
    url: "https://www.jsontapose.com/treeviewer",
  },
  "/treeviewer/yaml-compare": {
    title: "YAML Tree Viewer - Interactive YAML Tree Visualizer | JSONtapose",
    description:
      "Explore YAML data in an interactive tree view with expand/collapse at any depth. Free online YAML tree visualizer - paste your YAML and navigate complex nested structures instantly. 100% client-side.",
    keywords:
      "YAML tree viewer, YAML tree visualizer, YAML explorer, interactive YAML viewer, YAML navigator, nested YAML viewer, YAML structure viewer, online YAML tree",
    url: "https://www.jsontapose.com/treeviewer/yaml-compare",
  },
  "/yaml-compare": {
    title: "YAML Compare & Diff Tool - Free Online YAML Comparison | JSONtapose",
    description:
      "Compare two YAML files side-by-side with color-coded diffs. Free online YAML comparison and YAML diff tool - added, removed, and changed values highlighted instantly. 100% client-side, no uploads.",
    keywords:
      "YAML compare, YAML diff, YAML comparison tool, compare YAML files, YAML diff online, YAML file compare, YAML vs YAML, online YAML tool, YAML checker",
    url: "https://www.jsontapose.com/yaml-compare",
  },
  "/client-side-json-diff": {
    title: "Client-Side JSON Diff Tool - No Upload | JSONtapose",
    description:
      "Compare JSON files and API responses locally in your browser. JSONtapose is a client-side JSON diff tool with no upload, no account, and semantic structured comparison.",
    keywords:
      "client-side JSON diff, no upload JSON compare, secure JSON diff, private JSON comparison, browser JSON diff, JSON compare no signup",
    url: "https://www.jsontapose.com/client-side-json-diff",
  },
  "/semantic-json-diff": {
    title: "Semantic JSON Diff - Ignore Whitespace and Key Order | JSONtapose",
    description:
      "Use JSONtapose for semantic JSON diff that compares structure and values instead of plain text formatting. Review API responses without noise from whitespace or key order.",
    keywords:
      "semantic JSON diff, compare JSON ignoring key order, JSON diff ignoring whitespace, structured JSON comparison, API response diff",
    url: "https://www.jsontapose.com/semantic-json-diff",
  },
};

// Inner component so we can call useFormatMode (which requires FormatModeProvider above)
function AppContent({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (t: string) => void;
}) {
  const { setMode } = useFormatMode();
  const { isWideView } = useWideView();
  const location = useLocation();

  // Sync format mode with the current route
  useEffect(() => {
    const yamlRoutes = ["/yaml-compare", "/treeviewer/yaml-compare"];
    if (yamlRoutes.includes(location.pathname)) {
      setMode("yaml");
    } else {
      setMode("json");
    }
  }, [location.pathname, setMode]);

  // Handle hash anchor scrolling
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - SCROLL_OFFSET,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [location.hash]);

  const pathname = location.pathname;
  const seoProps = SEO_BY_PATH[pathname] ?? {};

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-base-100">
      <SEO {...seoProps} />
      <Header
        themeController={
          <ThemeController currentTheme={theme} onChange={setTheme} />
        }
      />
      <main
        id="main-content"
        className={`flex-grow py-4 ${
          isWideView
            ? "app-shell-container app-shell-container--wide"
            : "container mx-auto px-4"
        }`}
      >
        <div className="flex flex-col gap-4">
          <Routes>
            <Route path="/" element={<ComparePage />} />
            <Route path="/yaml-compare" element={<ComparePage />} />
            <Route path="/client-side-json-diff" element={<ComparePage />} />
            <Route path="/semantic-json-diff" element={<ComparePage />} />
            <Route path="/treeviewer" element={<JsonTreeViewer />} />
            <Route path="/treeviewer/yaml-compare" element={<JsonTreeViewer />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || getDefaultTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Initialize FormatMode based on the URL at load time to avoid flash on yaml routes
  const initialMode = ["/yaml-compare", "/treeviewer/yaml-compare"].includes(
    window.location.pathname
  )
    ? "yaml"
    : "json";

  return (
    <FormatModeProvider initialMode={initialMode}>
      <WideViewProvider>
        <AppContent theme={theme} setTheme={setTheme} />
      </WideViewProvider>
    </FormatModeProvider>
  );
}

export default App;
