import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import type { SampleType } from "../utils/jsonUtils";
import { getSampleJsonByType, sampleOptions } from "../utils/jsonUtils";

/**
 * Props for the SampleSelector component
 *
 * @property selectedSample - Currently selected sample type
 * @property onSelect - Callback for sample selection
 * @property mode - Component mode: 'compare' for side-by-side comparison or 'single' for tree view
 */
interface SampleSelectorProps {
  selectedSample: SampleType;
  onSelect: (
    sampleType: SampleType,
    leftSample: string,
    rightSample?: string
  ) => void;
  mode?: "compare" | "single";
}

/**
 * Dropdown component for selecting sample JSON data
 *
 * Features:
 * - Dropdown menu with sample options
 * - Support for single and compare modes
 * - Click outside to close
 * - Keyboard accessibility
 * - Visual feedback
 *
 * The component:
 * - Manages dropdown state
 * - Handles sample selection
 * - Provides consistent styling
 * - Maintains accessibility
 */
const SampleSelector: React.FC<SampleSelectorProps> = ({
  selectedSample,
  onSelect,
  mode = "compare", // Default to compare mode for backward compatibility
}) => {
  // Refs and state for dropdown management
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle sample selection based on mode
  const handleExampleSelect = useCallback(
    (sampleType: SampleType) => {
      setIsDropdownOpen(false);

      const leftSample = getSampleJsonByType(sampleType, "left");

      if (mode === "single") {
        // Single mode (TreeViewer) only needs left sample
        onSelect(sampleType, leftSample);
      } else {
        // Compare mode (JsonComparer) needs both samples
        const rightSample = getSampleJsonByType(sampleType, "right");
        onSelect(sampleType, leftSample, rightSample);
      }
    },
    [onSelect, mode]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        className="btn btn-secondary btn-sm m-1"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      >
        Try Example
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="ml-1"
          aria-hidden="true"
        >
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </button>

      {/* Sample options dropdown */}
      {isDropdownOpen && (
        <ul
          className="absolute z-[1] mt-1 p-2 shadow bg-base-200 rounded-box w-52"
          role="listbox"
          aria-label="Example options"
        >
          {sampleOptions.map((option) => (
            <li key={option.value} className="hover:bg-base-300 rounded">
              <button
                onClick={() => handleExampleSelect(option.value as SampleType)}
                className="w-full text-left p-2"
                role="option"
                aria-selected={option.value === selectedSample}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(SampleSelector);
