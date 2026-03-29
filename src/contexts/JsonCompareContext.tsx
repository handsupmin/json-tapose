import type { ReactNode } from "react";
import React, { useCallback, useState } from "react";
import type { JsonCompareContextType } from "../types/contextTypes";
import type {
  JsonComparisonResult,
  JsonRootValue,
  JsonValidationError,
} from "../utils/jsonUtils";
import {
  compareJsonDocuments,
  formatJson,
  parseJsonInput,
} from "../utils/jsonUtils";
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
 * - Root-level object or array comparison
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
  const [diffResult, setDiffResult] = useState<JsonComparisonResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leftJsonError, setLeftJsonError] =
    useState<JsonValidationError | null>(null);
  const [rightJsonError, setRightJsonError] =
    useState<JsonValidationError | null>(null);

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
    const parsed = parseJsonInput(value);

    if (side === "left") {
      setLeftJsonError(parsed.error);
    } else {
      setRightJsonError(parsed.error);
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

      const leftParsed = parseJsonInput(leftJson);
      const rightParsed = parseJsonInput(rightJson);

      setLeftJsonError(leftParsed.error);
      setRightJsonError(rightParsed.error);

      if (leftParsed.error || rightParsed.error) {
        throw new Error("Invalid JSON in one or both inputs");
      }

      if (
        !isJsonRootValue(leftParsed.value) ||
        !isJsonRootValue(rightParsed.value)
      ) {
        throw new Error(
          "JSON compare supports only object or array roots, not null or primitives"
        );
      }

      const result = compareJsonDocuments(leftParsed.value, rightParsed.value);
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
      if (side === "left" && leftJson.trim()) {
        const parsed = parseJsonInput(leftJson);

        if (parsed.error) {
          setLeftJsonError(parsed.error);
          setError(parsed.error.message);
          return;
        }

        setLeftJsonState(formatJson(leftJson));
        setLeftJsonError(null);
        setError(null);
      } else if (side === "right" && rightJson.trim()) {
        const parsed = parseJsonInput(rightJson);

        if (parsed.error) {
          setRightJsonError(parsed.error);
          setError(parsed.error.message);
          return;
        }

        setRightJsonState(formatJson(rightJson));
        setRightJsonError(null);
        setError(null);
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

const isJsonRootValue = (value: unknown): value is JsonRootValue => {
  return typeof value === "object" && value !== null;
};
