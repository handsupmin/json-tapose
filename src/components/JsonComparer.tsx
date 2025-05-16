import { useState } from "react";
import type { JsonDiffItem, SampleType } from "../utils/jsonUtils";
import {
  compareJson,
  formatJson,
  getSampleJsonByType,
  isValidJson,
  sampleOptions,
} from "../utils/jsonUtils";
import JsonDiffView from "./JsonDiffView";

const JsonComparer: React.FC = () => {
  const [leftJson, setLeftJson] = useState<string>("");
  const [rightJson, setRightJson] = useState<string>("");
  const [diffResult, setDiffResult] = useState<JsonDiffItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSample, setSelectedSample] =
    useState<SampleType>("productExample");
  const [leftJsonError, setLeftJsonError] = useState<string | null>(null);
  const [rightJsonError, setRightJsonError] = useState<string | null>(null);

  const handleCompare = () => {
    setError(null);
    setLoading(true);

    try {
      if (!leftJson.trim() || !rightJson.trim()) {
        throw new Error("Both input fields are required");
      }

      if (!isValidJson(leftJson) || !isValidJson(rightJson)) {
        throw new Error("Invalid JSON in one or both inputs");
      }

      const leftParsed = JSON.parse(leftJson);
      const rightParsed = JSON.parse(rightJson);

      // Only compare objects at root level
      if (
        typeof leftParsed !== "object" ||
        typeof rightParsed !== "object" ||
        leftParsed === null ||
        rightParsed === null ||
        Array.isArray(leftParsed) ||
        Array.isArray(rightParsed)
      ) {
        throw new Error(
          "JSON must be an object at the root level, not an array or primitive"
        );
      }

      const result = compareJson(leftParsed, rightParsed);
      setDiffResult(result);
    } catch (e) {
      setError((e as Error).message);
      setDiffResult(null);
    } finally {
      setLoading(false);
    }
  };

  const validateJson = (side: "left" | "right", value: string) => {
    if (!value.trim()) return;

    if (!isValidJson(value)) {
      if (side === "left") {
        setLeftJsonError("Invalid JSON format");
      } else {
        setRightJsonError("Invalid JSON format");
      }
    } else {
      if (side === "left") {
        setLeftJsonError(null);
      } else {
        setRightJsonError(null);
      }
    }
  };

  const handleFormat = (side: "left" | "right") => {
    try {
      if (side === "left" && leftJson.trim()) {
        if (isValidJson(leftJson)) {
          setLeftJson(formatJson(leftJson));
          setLeftJsonError(null);
          setError(null);
        } else {
          setLeftJsonError("Invalid JSON format");
          setError("Invalid JSON in left editor");
        }
      } else if (side === "right" && rightJson.trim()) {
        if (isValidJson(rightJson)) {
          setRightJson(formatJson(rightJson));
          setRightJsonError(null);
          setError(null);
        } else {
          setRightJsonError("Invalid JSON format");
          setError("Invalid JSON in right editor");
        }
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const loadSampleData = () => {
    setLeftJson(getSampleJsonByType(selectedSample, "left"));
    setRightJson(getSampleJsonByType(selectedSample, "right"));
    setLeftJsonError(null);
    setRightJsonError(null);
    setError(null);
    setDiffResult(null);
  };

  const handleSampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSample(e.target.value as SampleType);
  };

  const clearAll = () => {
    setLeftJson("");
    setRightJson("");
    setLeftJsonError(null);
    setRightJsonError(null);
    setError(null);
    setDiffResult(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="form-control max-w-xs">
          <select
            className="select select-bordered w-full"
            value={selectedSample}
            onChange={handleSampleChange}
          >
            {sampleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSampleData} className="btn btn-secondary btn-sm">
            Load Sample
          </button>
          <button onClick={clearAll} className="btn btn-ghost btn-sm">
            Clear All
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <div className="flex justify-between items-center mb-2">
            <label className="label-text text-lg font-semibold">
              Left JSON
            </label>
            <button
              onClick={() => handleFormat("left")}
              className="btn btn-xs btn-outline"
            >
              Format
            </button>
          </div>
          <div className="relative">
            <textarea
              className={`textarea font-mono bg-base-200 text-base-content w-full h-80 ${
                leftJsonError ? "textarea-error border-2" : "textarea-bordered"
              }`}
              value={leftJson}
              onChange={(e) => {
                setLeftJson(e.target.value);
                if (leftJsonError) setLeftJsonError(null);
              }}
              onBlur={(e) => validateJson("left", e.target.value)}
              placeholder='{"example": "Paste your JSON here"}'
            ></textarea>
            {leftJsonError && (
              <div className="absolute top-1 right-2 badge badge-error gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                {leftJsonError}
              </div>
            )}
          </div>
        </div>

        <div className="form-control w-full">
          <div className="flex justify-between items-center mb-2">
            <label className="label-text text-lg font-semibold">
              Right JSON
            </label>
            <button
              onClick={() => handleFormat("right")}
              className="btn btn-xs btn-outline"
            >
              Format
            </button>
          </div>
          <div className="relative">
            <textarea
              className={`textarea font-mono bg-base-200 text-base-content w-full h-80 ${
                rightJsonError ? "textarea-error border-2" : "textarea-bordered"
              }`}
              value={rightJson}
              onChange={(e) => {
                setRightJson(e.target.value);
                if (rightJsonError) setRightJsonError(null);
              }}
              onBlur={(e) => validateJson("right", e.target.value)}
              placeholder='{"example": "Paste your JSON here"}'
            ></textarea>
            {rightJsonError && (
              <div className="absolute top-1 right-2 badge badge-error gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                {rightJsonError}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button
          onClick={handleCompare}
          className="btn btn-primary btn-wide"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Comparing...
            </>
          ) : (
            "Compare JSON"
          )}
        </button>
      </div>

      {diffResult && (
        <div className="card bg-base-200 shadow-xl overflow-hidden">
          <div className="card-body p-0">
            <div className="bg-base-300 px-4 py-2 border-b border-base-300">
              <h2 className="card-title m-0 text-base">Comparison Result</h2>
            </div>
            <div className="overflow-auto">
              <JsonDiffView diffItems={diffResult} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonComparer;
