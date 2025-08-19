import { memo, useCallback, useState } from "react";
import { useYamlCompare } from "../hooks/useYamlCompareHook";
import type { SampleType } from "../utils/jsonUtils";
import { getSampleYamlByType } from "../utils/yamlUtils";
import JsonDiffView from "./JsonDiffView";
import JsonInputPanel from "./JsonInputPanel";
import SampleSelector from "./SampleSelector";

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

const YamlToolbar = ({
  selectedSample,
  onSampleSelect,
  onClearAll,
}: {
  selectedSample: SampleType;
  onSampleSelect: (
    type: SampleType,
    leftSample: string,
    rightSample?: string
  ) => void;
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
      {isLoading ? "Comparing..." : "Compare YAML"}
    </button>
  </div>
);

const YamlComparer: React.FC = () => {
  const {
    leftYaml,
    rightYaml,
    diffResult,
    error,
    loading,
    leftYamlError,
    rightYamlError,
    setLeftYaml,
    setRightYaml,
    validateYaml,
    compareYaml,
    formatYaml: handleFormat,
    clearAll,
    loadSampleData,
  } = useYamlCompare();

  const [selectedSample, setSelectedSample] =
    useState<SampleType>("productExample");

  const handleSampleSelect = useCallback(
    (sampleType: SampleType) => {
      setSelectedSample(sampleType);
      const leftYamlSample = getSampleYamlByType(sampleType, "left");
      const rightYamlSample = getSampleYamlByType(sampleType, "right");
      loadSampleData(leftYamlSample, rightYamlSample);
    },
    [loadSampleData]
  );

  const isCompareButtonDisabled =
    loading ||
    !leftYaml ||
    !rightYaml ||
    Boolean(leftYamlError) ||
    Boolean(rightYamlError);

  return (
    <div className="flex flex-col gap-4">
      <YamlToolbar
        selectedSample={selectedSample}
        onSampleSelect={handleSampleSelect}
        onClearAll={clearAll}
      />

      {error && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JsonInputPanel
          id="leftYaml"
          label="Left YAML"
          value={leftYaml}
          error={leftYamlError}
          onChange={setLeftYaml}
          onBlur={(value) => validateYaml("left", value)}
          onFormat={() => handleFormat("left")}
          placeholder={"example: |\n  Paste your YAML here\n"}
        />

        <JsonInputPanel
          id="rightYaml"
          label="Right YAML"
          value={rightYaml}
          error={rightYamlError}
          onChange={setRightYaml}
          onBlur={(value) => validateYaml("right", value)}
          onFormat={() => handleFormat("right")}
          placeholder={"example: |\n  Paste your YAML here\n"}
        />
      </div>

      <CompareButton
        onClick={compareYaml}
        isLoading={loading}
        isDisabled={isCompareButtonDisabled}
      />

      {diffResult && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Comparison Result</h2>
          <JsonDiffView diffItems={diffResult} mode={"yaml"} />
        </div>
      )}
    </div>
  );
};

export default memo(YamlComparer);
