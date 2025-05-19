import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Extract createRoot call into a constant for performance optimization
const rootElement = document.getElementById("root");

// Null check and error handling
if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure there is a div with id 'root' in your HTML."
  );
}

// Create root
const root = createRoot(rootElement);

// Render
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
