import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormatMode } from "../contexts/FormatModeContext";
import { useWideView } from "../hooks/useWideView";
import HeaderInfoModal from "./HeaderInfoModal";
import HeaderMobileMenu, { type HeaderTab } from "./HeaderMobileMenu";
import WideViewToggle from "./WideViewToggle";

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
  const navigate = useNavigate();
  const { mode } = useFormatMode();
  const { isWideView } = useWideView();

  const isCompare =
    location.pathname === "/" || location.pathname === "/yaml-compare";
  const isTreeViewer =
    location.pathname === "/treeviewer" ||
    location.pathname === "/treeviewer/yaml-compare";

  // Navigate to the mode-appropriate route when switching format
  const handleModeSwitch = (newMode: "json" | "yaml") => {
    if (newMode === "yaml") {
      navigate(isTreeViewer ? "/treeviewer/yaml-compare" : "/yaml-compare");
    } else {
      navigate(isTreeViewer ? "/treeviewer" : "/");
    }
  };

  // Navigation tabs configuration — mode-aware paths
  const tabs: HeaderTab[] = [
    {
      path: mode === "yaml" ? "/yaml-compare" : "/",
      label: "Compare",
      isActive: isCompare,
    },
    {
      path: mode === "yaml" ? "/treeviewer/yaml-compare" : "/treeviewer",
      label: "TreeViewer",
      isActive: isTreeViewer,
    },
  ];

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div
        className={`py-3 ${
          isWideView
            ? "app-shell-container app-shell-container--wide"
            : "container mx-auto px-4"
        }`}
      >
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
                  onClick={() => handleModeSwitch("json")}
                >
                  JSON
                </button>
                <button
                  className={`btn btn-sm join-item ${
                    mode === "yaml" ? "btn-primary" : ""
                  }`}
                  onClick={() => handleModeSwitch("yaml")}
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
                  tab.isActive
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
            <WideViewToggle className="mr-1" />
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

        <HeaderMobileMenu
          isOpen={isMobileMenuOpen}
          tabs={tabs}
          mode={mode}
          onModeSwitch={handleModeSwitch}
          onInfoOpen={() => setShowInfoModal(true)}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <HeaderInfoModal
        mode={mode}
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </header>
  );
};

export default Header;
