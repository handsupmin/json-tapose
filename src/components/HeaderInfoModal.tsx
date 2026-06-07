import type { FormatMode } from "../contexts/FormatModeContext";
import logoUrl from "/logo.svg";

interface HeaderInfoModalProps {
  readonly mode: FormatMode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const HeaderInfoModal: React.FC<HeaderInfoModalProps> = ({
  mode,
  isOpen,
  onClose,
}) => {
  const appName = mode === "json" ? "JSONtapose" : "YAMLtapose";

  return (
    <dialog id="info_modal" className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-lg">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <div className="flex items-center mb-4">
          <img src={logoUrl} alt={`${appName} Logo`} className="h-12 w-12 mr-3" />
          <h3 className="font-bold text-lg">About {appName}</h3>
        </div>
        <p className="py-2 text-left">
          <span className="font-semibold">JSON + juxtapose</span>
        </p>
        <p className="py-2 text-left">
          {appName} is a professional {mode.toUpperCase()} tool that offers both
          comparison and beautification features. Compare two JSON objects
          side-by-side or view JSON data in an interactive tree structure.
        </p>

        <div className="py-4">
          <h4 className="font-semibold mb-3 text-left">Why Choose JSONtapose?</h4>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span className="text-success text-lg">⚡</span>
              <div className="text-left">
                <div className="font-medium">Fast & Accurate</div>
                <div className="text-sm opacity-80">
                  Lightning-fast JSON processing with precise difference detection
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
              <strong>TreeViewer:</strong> Interactive {mode.toUpperCase()} tree
              view with expand/collapse functionality
            </li>
          </ol>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default HeaderInfoModal;
