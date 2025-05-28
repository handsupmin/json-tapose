import React from "react";

/**
 * Component for diff view controls
 *
 * Features:
 * - Toggle between full view and diff-only mode
 * - Context lines selection for diff-only mode
 * - Visual legend for diff line types
 *
 * The component provides:
 * - A toggle button for diff-only mode
 * - A context lines selector (visible in diff-only mode)
 * - A legend showing the meaning of different line colors
 */
interface DiffControlsProps {
  showOnlyDiff: boolean;
  contextLines: number;
  toggleDiffMode: () => void;
  handleContextChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DiffControls: React.FC<DiffControlsProps> = ({
  showOnlyDiff,
  contextLines,
  toggleDiffMode,
  handleContextChange,
}) => {
  return (
    <div className="bg-base-300 px-4 py-2 border-b border-base-300 flex justify-between items-center rounded-lg">
      {/* Diff mode controls */}
      <div className="flex gap-2 items-center">
        <button
          onClick={toggleDiffMode}
          className={`btn btn-xs ${
            showOnlyDiff
              ? "btn-primary bg-primary text-primary-content"
              : "btn-secondary bg-secondary text-secondary-content hover:bg-secondary-focus"
          }`}
          aria-pressed={showOnlyDiff}
        >
          {showOnlyDiff ? "Show All" : "Show Diff Only"}
        </button>

        {/* Context lines selector (only visible in diff-only mode) */}
        {showOnlyDiff && (
          <div className="flex items-center gap-2">
            <span className="text-xs">Context:</span>
            <select
              value={contextLines}
              onChange={handleContextChange}
              className="select select-xs select-bordered"
              aria-label="Context lines"
            >
              <option value="0">0 lines</option>
              <option value="1">1 line</option>
              <option value="2">2 lines</option>
              <option value="3">3 lines</option>
              <option value="5">5 lines</option>
              <option value="10">10 lines</option>
            </select>
          </div>
        )}
      </div>

      {/* Diff line type legend */}
      <div className="flex gap-3 text-xs">
        <span className="flex items-center">
          <span
            className="inline-block w-3 h-3 rounded-full bg-error/60 mr-1"
            aria-hidden="true"
          ></span>{" "}
          Removed
        </span>
        <span className="flex items-center">
          <span
            className="inline-block w-3 h-3 rounded-full bg-success/60 mr-1"
            aria-hidden="true"
          ></span>{" "}
          Added
        </span>
        <span className="flex items-center">
          <span
            className="inline-block w-3 h-3 rounded-full bg-base-content/20 mr-1"
            aria-hidden="true"
          ></span>{" "}
          Unchanged
        </span>
      </div>
    </div>
  );
};

export default DiffControls;
