import { useState } from "react";

const Header: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <header className="bg-base-300 shadow-md">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <a
            href="https://www.jsontapose.com/"
            className="flex items-center"
            title="Go to JSONtapose homepage"
          >
            <img
              src="/logo.svg"
              alt="JSONtapose Logo"
              className="h-9 w-9 mr-2"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JSONtapose
            </span>
          </a>
        </div>
        <div className="navbar-center hidden md:block">
          <p className="italic text-sm text-base-content/70">
            Spot the difference, reveal the truth.
          </p>
        </div>
        <div className="navbar-end">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setShowInfoModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
        </div>
      </div>

      {/* Updated Info Modal using the latest daisyUI syntax */}
      <dialog
        id="info_modal"
        className={`modal ${showInfoModal ? "modal-open" : ""}`}
      >
        <div className="modal-box">
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
              alt="JSONtapose Logo"
              className="h-12 w-12 mr-3"
            />
            <h3 className="font-bold text-lg">About JSONtapose</h3>
          </div>
          <p className="py-2 text-left">
            <span className="font-semibold">JSON + juxtapose</span>
          </p>
          <p className="py-2 text-left">
            JSONtapose is a tool for comparing two JSON files and displaying
            their differences visually, similar to GitHub or GitKraken diff
            views. The tool focuses on comparing the data content rather than
            the ordering of fields.
          </p>
          <div className="py-2 text-left">
            <span className="font-semibold">How to use:</span>
            <ol className="list-decimal list-inside mt-2 ml-2">
              <li>
                Paste or type JSON data in both the left and right editors
              </li>
              <li>Click the "Compare" button to see the differences</li>
              <li>
                The comparison will highlight added, removed, and changed fields
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
