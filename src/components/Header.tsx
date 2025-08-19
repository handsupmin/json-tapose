import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFormatMode } from "../contexts/FormatModeContext";

/**
 * Props for the Header component
 *
 * @property themeController - Optional React node for theme control functionality
 */
interface HeaderProps {
  themeController?: React.ReactNode;
}

/**
 * Header Component
 *
 * Renders the main navigation header of the JSONtapose application.
 * Features:
 * - Responsive navigation with mobile hamburger menu
 * - Logo and branding
 * - Info modal with app details
 * - GitHub link
 * - Theme controller integration
 *
 * Navigation:
 * - Compare: Main JSON comparison tool
 * - TreeViewer: Interactive JSON tree visualization
 */
const Header: React.FC<HeaderProps> = ({ themeController }) => {
  // Modal and menu visibility state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { mode, setMode } = useFormatMode();

  // Navigation tabs configuration
  const tabs = [
    {
      path: "/",
      label: "Compare",
    },
    {
      path: "/treeviewer",
      label: "TreeViewer",
    },
  ];

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Branding section with logo */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2"
              title={`Go to ${
                mode === "json" ? "JSONtapose" : "YAMLtapose"
              } homepage`}
            >
              <img
                src="/logo.svg"
                alt={`${mode === "json" ? "JSONtapose" : "YAMLtapose"} Logo`}
                className="h-8 w-8 sm:h-9 sm:w-9"
              />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {mode === "json" ? "JSONtapose" : "YAMLtapose"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation with global format switch between logo and tabs */}
          <div className="hidden md:flex items-center gap-4">
            <div className="mx-2">
              <div className="join">
                <button
                  className={`btn btn-sm join-item ${
                    mode === "json" ? "btn-primary" : ""
                  }`}
                  onClick={() => setMode("json")}
                >
                  JSON
                </button>
                <button
                  className={`btn btn-sm join-item ${
                    mode === "yaml" ? "btn-primary" : ""
                  }`}
                  onClick={() => setMode("yaml")}
                >
                  YAML
                </button>
              </div>
            </div>
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === tab.path
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => setShowInfoModal(true)}
              title={`About ${mode === "json" ? "JSONtapose" : "YAMLtapose"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <a
              href="https://github.com/handsupmin/json-tapose"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle btn-sm"
              title="View on GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {themeController}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {themeController}
            <button
              className="btn btn-ghost btn-square btn-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-base-300">
            <div className="flex flex-col gap-2 mt-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === tab.path
                      ? "bg-primary text-primary-content"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tab.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="join">
                  <button
                    className={`btn btn-sm join-item ${
                      mode === "json" ? "btn-primary" : ""
                    }`}
                    onClick={() => setMode("json")}
                  >
                    JSON
                  </button>
                  <button
                    className={`btn btn-sm join-item ${
                      mode === "yaml" ? "btn-primary" : ""
                    }`}
                    onClick={() => setMode("yaml")}
                  >
                    YAML
                  </button>
                </div>
                <button
                  className="btn btn-ghost btn-sm flex-1 justify-start"
                  onClick={() => {
                    setShowInfoModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About
                </button>
                <a
                  href="https://github.com/handsupmin/json-tapose"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm flex-1 justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info modal with app details and features */}
      <dialog
        id="info_modal"
        className={`modal ${showInfoModal ? "modal-open" : ""}`}
      >
        <div className="modal-box max-w-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowInfoModal(false)}
            >
              ✕
            </button>
          </form>
          <div className="flex items-center mb-4">
            <img
              src="/logo.svg"
              alt={`${mode === "json" ? "JSONtapose" : "YAMLtapose"} Logo`}
              className="h-12 w-12 mr-3"
            />
            <h3 className="font-bold text-lg">
              About {mode === "json" ? "JSONtapose" : "YAMLtapose"}
            </h3>
          </div>
          <p className="py-2 text-left">
            <span className="font-semibold">JSON + juxtapose</span>
          </p>
          <p className="py-2 text-left">
            {mode === "json" ? "JSONtapose" : "YAMLtapose"} is a professional{" "}
            {mode.toUpperCase()} tool that offers both comparison and
            beautification features. Compare two JSON objects side-by-side or
            view JSON data in an interactive tree structure.
          </p>

          <div className="py-4">
            <h4 className="font-semibold mb-3 text-left">
              Why Choose JSONtapose?
            </h4>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-success text-lg">⚡</span>
                <div className="text-left">
                  <div className="font-medium">Fast & Accurate</div>
                  <div className="text-sm opacity-80">
                    Lightning-fast JSON processing with precise difference
                    detection
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-info text-lg">🔒</span>
                <div className="text-left">
                  <div className="font-medium">100% Secure</div>
                  <div className="text-sm opacity-80">
                    All processing happens in your browser - no server uploads
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-secondary text-lg">✨</span>
                <div className="text-left">
                  <div className="font-medium">Beautiful UI</div>
                  <div className="text-sm opacity-80">
                    Modern, intuitive interface with syntax highlighting
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-2 text-left">
            <span className="font-semibold">Available Tools:</span>
            <ol className="list-decimal list-inside mt-2 ml-2 space-y-1">
              <li>
                <strong>Compare:</strong> Side-by-side {mode.toUpperCase()}{" "}
                comparison with difference highlighting
              </li>
              <li>
                <strong>TreeViewer:</strong> Interactive {mode.toUpperCase()}{" "}
                tree view with expand/collapse functionality
              </li>
            </ol>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowInfoModal(false)}>
              Close
            </button>
          </div>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => setShowInfoModal(false)}
        ></div>
      </dialog>
    </header>
  );
};

export default Header;
