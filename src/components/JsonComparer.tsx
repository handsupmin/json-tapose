import { memo, useCallback, useState } from "react";
import { useJsonCompare } from "../hooks/useJsonCompareHook";
import type { SampleType } from "../utils/jsonUtils";
import JsonDiffView from "./JsonDiffView";
import JsonInputPanel from "./JsonInputPanel";
import SampleSelector from "./SampleSelector";

// Separate component for error display
const ErrorAlert = ({ message }: { message: string }) => (
  <div className="alert alert-error" role="alert">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{message}</span>
  </div>
);

// Separate component for toolbar
const JsonToolbar = ({
  selectedSample,
  onSampleSelect,
  onClearAll,
}: {
  selectedSample: SampleType;
  onSampleSelect: (type: SampleType, left: string, right: string) => void;
  onClearAll: () => void;
}) => (
  <div className="flex flex-wrap items-center gap-2">
    <SampleSelector selectedSample={selectedSample} onSelect={onSampleSelect} />
    <div className="ml-auto">
      <button
        onClick={onClearAll}
        className="btn btn-accent btn-sm"
        aria-label="Clear all inputs"
      >
        Clear All
      </button>
    </div>
  </div>
);

// Separate component for comparison button
const CompareButton = ({
  onClick,
  isLoading,
  isDisabled,
}: {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={onClick}
      className={`btn btn-primary ${isLoading ? "loading" : ""}`}
      disabled={isDisabled}
    >
      {isLoading ? "Comparing..." : "Compare JSON"}
    </button>
  </div>
);

const JsonComparer: React.FC = () => {
  const {
    leftJson,
    rightJson,
    diffResult,
    error,
    loading,
    leftJsonError,
    rightJsonError,
    setLeftJson,
    setRightJson,
    validateJson,
    compareJson,
    formatJson: handleFormat,
    clearAll,
    loadSampleData,
  } = useJsonCompare();

  // Sample selection state
  const [selectedSample, setSelectedSample] =
    useState<SampleType>("productExample");

  // Sample selection handler
  const handleSampleSelect = useCallback(
    (sampleType: SampleType, leftSample: string, rightSample: string) => {
      setSelectedSample(sampleType);
      loadSampleData(leftSample, rightSample);
    },
    [loadSampleData]
  );

  // Check if comparison button should be disabled
  const isCompareButtonDisabled =
    loading ||
    !leftJson ||
    !rightJson ||
    Boolean(leftJsonError) ||
    Boolean(rightJsonError);

  return (
    <div className="flex flex-col gap-4">
      <JsonToolbar
        selectedSample={selectedSample}
        onSampleSelect={handleSampleSelect}
        onClearAll={clearAll}
      />

      {error && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JsonInputPanel
          id="leftJson"
          label="Left JSON"
          value={leftJson}
          error={leftJsonError}
          onChange={setLeftJson}
          onBlur={(value) => validateJson("left", value)}
          onFormat={() => handleFormat("left")}
        />

        <JsonInputPanel
          id="rightJson"
          label="Right JSON"
          value={rightJson}
          error={rightJsonError}
          onChange={setRightJson}
          onBlur={(value) => validateJson("right", value)}
          onFormat={() => handleFormat("right")}
        />
      </div>

      <CompareButton
        onClick={compareJson}
        isLoading={loading}
        isDisabled={isCompareButtonDisabled}
      />

      {diffResult && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Comparison Result</h2>
          <JsonDiffView diffItems={diffResult} />
        </div>
      )}
    </div>
  );
};

// Use memo for performance optimization
export default memo(JsonComparer);
