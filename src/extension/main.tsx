import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Popup from "./Popup";
import "./popup.css";

const rootElement = document.getElementById("extension-root");

if (!rootElement) {
  throw new Error("Extension root element not found.");
}

document.documentElement.setAttribute(
  "data-theme",
  localStorage.getItem("theme") || "purplewind"
);

createRoot(rootElement).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
