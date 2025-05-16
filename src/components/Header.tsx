import { useState } from "react";

const Header: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <header className="bg-base-300 shadow-md">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JSONtapose
            </span>
          </div>
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
          <h3 className="font-bold text-lg">About JSONtapose</h3>
          <p className="py-4">
            JSONtapose is a tool for comparing two JSON files and displaying
            their differences visually, similar to GitHub or GitKraken diff
            views. The tool focuses on comparing the data content rather than
            the ordering of fields.
          </p>
          <div className="py-2">
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
