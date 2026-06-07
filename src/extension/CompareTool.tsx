import { useCallback, useMemo, useState } from "react";
import JsonDiffView from "../components/JsonDiffView";
import type {
  JsonComparisonResult,
  JsonRootValue,
  JsonValidationError,
} from "../utils/jsonUtils";
import {
  compareJsonDocuments,
  parseJsonInput,
} from "../utils/jsonUtils";
import CompactDiffSummary from "./CompactDiffSummary";

interface CompareToolProps {
  readonly leftJson: string;
  readonly rightJson: string;
  readonly onLeftJsonChange: (json: string) => void;
  readonly onRightJsonChange: (json: string) => void;
}

const isJsonRootValue = (value: unknown): value is JsonRootValue => {
  return typeof value === "object" && value !== null;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  throw error;
};

const CompareTool: React.FC<CompareToolProps> = ({
  leftJson,
  rightJson,
  onLeftJsonChange,
  onRightJsonChange,
}) => {
  const [leftError, setLeftError] = useState<JsonValidationError | null>(null);
  const [rightError, setRightError] = useState<JsonValidationError | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [diffResult, setDiffResult] = useState<JsonComparisonResult | null>(
    null
  );

  const compareJson = useCallback(() => {
    const leftParsed = parseJsonInput(leftJson);
    const rightParsed = parseJsonInput(rightJson);

    setLeftError(leftParsed.error);
    setRightError(rightParsed.error);
    setCompareError(null);

    if (leftParsed.error || rightParsed.error) {
      setDiffResult(null);
      setCompareError("Invalid JSON in one or both inputs");
      return;
    }

    if (
      !isJsonRootValue(leftParsed.value) ||
      !isJsonRootValue(rightParsed.value)
    ) {
      setDiffResult(null);
      setCompareError("Compare supports object or array roots");
      return;
    }

    try {
      setDiffResult(compareJsonDocuments(leftParsed.value, rightParsed.value));
    } catch (error) {
      setDiffResult(null);
      setCompareError(getErrorMessage(error));
    }
  }, [leftJson, rightJson]);

  const canCompare = useMemo(() => {
    return Boolean(leftJson.trim() && rightJson.trim());
  }, [leftJson, rightJson]);

  return (
    <section className="flex flex-col gap-3">
      <div className="tool-heading">
        <span className="tool-heading-icon" aria-hidden="true">
          ⇄
        </span>
        <h2>Compare</h2>
      </div>
      <label className="block">
        <span className="mb-1 flex items-center justify-between text-xs font-semibold text-base-content/70">
          <span>Left</span>
          {leftError && <span className="text-error">Invalid</span>}
        </span>
        <textarea
          className={`textarea textarea-bordered h-20 w-full resize-none font-mono text-xs leading-5 ${
            leftError ? "textarea-error" : ""
          }`}
          value={leftJson}
          onChange={(event) => onLeftJsonChange(event.target.value)}
          placeholder='{"left": true}'
        />
      </label>
      <label className="block">
        <span className="mb-1 flex items-center justify-between text-xs font-semibold text-base-content/70">
          <span>Right</span>
          {rightError && <span className="text-error">Invalid</span>}
        </span>
        <textarea
          className={`textarea textarea-bordered h-20 w-full resize-none font-mono text-xs leading-5 ${
            rightError ? "textarea-error" : ""
          }`}
          value={rightJson}
          onChange={(event) => onRightJsonChange(event.target.value)}
          placeholder='{"right": true}'
        />
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <button
          className="mini-action-button mini-action-primary"
          onClick={compareJson}
          disabled={!canCompare}
          aria-label="Compare JSON documents"
        >
          <span aria-hidden="true">⇄</span>
          <span>Compare</span>
        </button>
        <button
          className="mini-icon-button"
          onClick={() => {
            onLeftJsonChange("");
            onRightJsonChange("");
            setDiffResult(null);
            setCompareError(null);
          }}
          aria-label="Clear compare inputs"
          title="Clear compare inputs"
        >
          ×
        </button>
      </div>
      {compareError && (
        <div className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {compareError}
        </div>
      )}
      {diffResult && (
        <>
          <CompactDiffSummary diffItems={diffResult.items} />
          <details className="rounded-lg border border-base-300 bg-base-100 p-3">
            <summary className="cursor-pointer text-xs font-semibold text-base-content/70">
              Full diff
            </summary>
            <div className="mt-2 max-h-56 overflow-auto">
              <JsonDiffView
                diffItems={diffResult.items}
                leftRootType={diffResult.leftRootType}
                rightRootType={diffResult.rightRootType}
                mode="json"
              />
            </div>
          </details>
        </>
      )}
    </section>
  );
};

export default CompareTool;
