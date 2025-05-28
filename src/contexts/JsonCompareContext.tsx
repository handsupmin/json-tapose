import type { ReactNode } from "react";
import React, { useCallback, useState } from "react";
import type { JsonCompareContextType } from "../types/contextTypes";
import type { JsonDiffItem } from "../utils/jsonUtils";
import { compareJson, formatJson, isValidJson } from "../utils/jsonUtils";
import { JsonCompareContext } from "./JsonCompareContextInstance";

/**
 * Provider component for JSON comparison functionality
 *
 * This provider manages:
 * - JSON input state for both sides
 * - JSON validation and error handling
 * - JSON comparison and diff generation
 * - JSON formatting
 * - Sample data loading
 *
 * Key features:
 * - Real-time validation with detailed error messages
 * - Root-level object comparison only
 * - Automatic error clearing on valid input
 * - Loading state for async operations
 * - Sample data support for testing
 */
interface JsonCompareProviderProps {
  children: ReactNode;
}

export const JsonCompareProvider: React.FC<JsonCompareProviderProps> = ({
  children,
}) => {
  // State management for JSON inputs, diff results, and errors
  const [leftJson, setLeftJsonState] = useState<string>("");
  const [rightJson, setRightJsonState] = useState<string>("");
  const [diffResult, setDiffResult] = useState<JsonDiffItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leftJsonError, setLeftJsonError] = useState<string | null>(null);
  const [rightJsonError, setRightJsonError] = useState<string | null>(null);

  // State setters with automatic error clearing
  const setLeftJson = useCallback(
    (json: string) => {
      setLeftJsonState(json);
      if (leftJsonError) setLeftJsonError(null);
    },
    [leftJsonError]
  );

  const setRightJson = useCallback(
    (json: string) => {
      setRightJsonState(json);
      if (rightJsonError) setRightJsonError(null);
    },
    [rightJsonError]
  );

  // JSON validation with side-specific error handling
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

  // Compare JSON objects with validation and error handling
  const handleCompare = useCallback(() => {
    setError(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!leftJson.trim() || !rightJson.trim()) {
        throw new Error("Both input fields are required");
      }

      if (!isValidJson(leftJson) || !isValidJson(rightJson)) {
        throw new Error("Invalid JSON in one or both inputs");
      }

      const leftParsed = JSON.parse(leftJson);
      const rightParsed = JSON.parse(rightJson);

      // Ensure root-level objects only
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

  // Format JSON with error handling
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

  // Load sample data with state reset
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

  // Reset all state to initial values
  const clearAll = useCallback(() => {
    setLeftJsonState("");
    setRightJsonState("");
    setLeftJsonError(null);
    setRightJsonError(null);
    setError(null);
    setDiffResult(null);
  }, []);

  // Context value with all state and actions
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
