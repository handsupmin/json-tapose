import type { ReactNode } from "react";
import React, { useCallback, useState } from "react";
import type { JsonCompareContextType } from "../types/contextTypes";
import type { JsonDiffItem } from "../utils/jsonUtils";
import { compareJson, formatJson, isValidJson } from "../utils/jsonUtils";
import { JsonCompareContext } from "./JsonCompareContextInstance";

// Provider props type
interface JsonCompareProviderProps {
  children: ReactNode;
}

// Provider component
export const JsonCompareProvider: React.FC<JsonCompareProviderProps> = ({
  children,
}) => {
  // State
  const [leftJson, setLeftJsonState] = useState<string>("");
  const [rightJson, setRightJsonState] = useState<string>("");
  const [diffResult, setDiffResult] = useState<JsonDiffItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leftJsonError, setLeftJsonError] = useState<string | null>(null);
  const [rightJsonError, setRightJsonError] = useState<string | null>(null);

  // Set left JSON and clear its error
  const setLeftJson = useCallback(
    (json: string) => {
      setLeftJsonState(json);
      if (leftJsonError) setLeftJsonError(null);
    },
    [leftJsonError]
  );

  // Set right JSON and clear its error
  const setRightJson = useCallback(
    (json: string) => {
      setRightJsonState(json);
      if (rightJsonError) setRightJsonError(null);
    },
    [rightJsonError]
  );

  // Validate JSON
  const validateJson = useCallback((side: "left" | "right", value: string) => {
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
  }, []);

  // Compare JSON
  const handleCompare = useCallback(() => {
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
  }, [leftJson, rightJson]);

  // Format JSON
  const handleFormat = useCallback(
    (side: "left" | "right") => {
      try {
        if (side === "left" && leftJson.trim()) {
          if (isValidJson(leftJson)) {
            setLeftJsonState(formatJson(leftJson));
            setLeftJsonError(null);
            setError(null);
          } else {
            setLeftJsonError("Invalid JSON format");
            setError("Invalid JSON in left editor");
          }
        } else if (side === "right" && rightJson.trim()) {
          if (isValidJson(rightJson)) {
            setRightJsonState(formatJson(rightJson));
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
    },
    [leftJson, rightJson]
  );

  // Load sample data
  const loadSampleData = useCallback(
    (leftSample: string, rightSample: string) => {
      setLeftJsonState(leftSample);
      setRightJsonState(rightSample);
      setLeftJsonError(null);
      setRightJsonError(null);
      setError(null);
      setDiffResult(null);
    },
    []
  );

  // Clear all fields
  const clearAll = useCallback(() => {
    setLeftJsonState("");
    setRightJsonState("");
    setLeftJsonError(null);
    setRightJsonError(null);
    setError(null);
    setDiffResult(null);
  }, []);

  // Context value
  const contextValue: JsonCompareContextType = {
    // State
    leftJson,
    rightJson,
    diffResult,
    error,
    loading,
    leftJsonError,
    rightJsonError,

    // Actions
    setLeftJson,
    setRightJson,
    validateJson,
    compareJson: handleCompare,
    formatJson: handleFormat,
    clearAll,
    loadSampleData,
  };

  return (
    <JsonCompareContext.Provider value={contextValue}>
      {children}
    </JsonCompareContext.Provider>
  );
};
