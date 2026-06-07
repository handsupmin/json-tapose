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
    <section className="mt-3 flex flex-col gap-2">
      <label className="form-control">
        <span className="label-text text-xs font-semibold">Left JSON</span>
        <textarea
          className={`textarea textarea-bordered h-28 font-mono text-xs ${
            leftError ? "textarea-error" : ""
          }`}
          value={leftJson}
          onChange={(event) => onLeftJsonChange(event.target.value)}
          placeholder='{"left": true}'
        />
      </label>
      <label className="form-control">
        <span className="label-text text-xs font-semibold">Right JSON</span>
        <textarea
          className={`textarea textarea-bordered h-28 font-mono text-xs ${
            rightError ? "textarea-error" : ""
          }`}
          value={rightJson}
          onChange={(event) => onRightJsonChange(event.target.value)}
          placeholder='{"right": true}'
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={compareJson}
          disabled={!canCompare}
        >
          Compare
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            onLeftJsonChange("");
            onRightJsonChange("");
            setDiffResult(null);
            setCompareError(null);
          }}
        >
          Clear
        </button>
      </div>
      {compareError && (
        <div className="alert alert-error py-2 text-xs">{compareError}</div>
      )}
      {diffResult && (
        <div className="max-h-64 overflow-auto">
          <JsonDiffView
            diffItems={diffResult.items}
            leftRootType={diffResult.leftRootType}
            rightRootType={diffResult.rightRootType}
            mode="json"
          />
        </div>
      )}
    </section>
  );
};

export default CompareTool;
