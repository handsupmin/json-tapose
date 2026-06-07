import { Link } from "react-router-dom";
import type { FormatMode } from "../contexts/FormatModeContext";
import WideViewToggle from "./WideViewToggle";

export interface HeaderTab {
  readonly path: string;
  readonly label: string;
  readonly isActive: boolean;
}

interface HeaderMobileMenuProps {
  readonly isOpen: boolean;
  readonly tabs: readonly HeaderTab[];
  readonly mode: FormatMode;
  readonly onModeSwitch: (newMode: FormatMode) => void;
  readonly onInfoOpen: () => void;
  readonly onClose: () => void;
}

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  isOpen,
  tabs,
  mode,
  onModeSwitch,
  onInfoOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-base-300">
      <div className="flex flex-col gap-2 mt-4">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab.isActive
                ? "bg-primary text-primary-content"
                : "text-base-content/70 hover:text-base-content hover:bg-base-200"
            }`}
            onClick={onClose}
          >
            {tab.label}
          </Link>
        ))}
        <div className="flex items-center gap-2 px-4 py-2">
          <WideViewToggle className="mr-auto" />
          <div className="join">
            <button
              className={`btn btn-sm join-item ${
                mode === "json" ? "btn-primary" : ""
              }`}
              onClick={() => {
                onModeSwitch("json");
                onClose();
              }}
            >
              JSON
            </button>
            <button
              className={`btn btn-sm join-item ${
                mode === "yaml" ? "btn-primary" : ""
              }`}
              onClick={() => {
                onModeSwitch("yaml");
                onClose();
              }}
            >
              YAML
            </button>
          </div>
          <button
            className="btn btn-ghost btn-sm flex-1 justify-start"
            onClick={() => {
              onInfoOpen();
              onClose();
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
            onClick={onClose}
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
  );
};

export default HeaderMobileMenu;
