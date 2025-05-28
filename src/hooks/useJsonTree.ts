import { useCallback, useState } from "react";
import type { SampleType } from "../utils/jsonUtils";
import { formatJson } from "../utils/jsonUtils";
import { useJsonValidation } from "./useJsonValidation";

/**
 * Hook for managing JSON tree state and operations
 *
 * This hook provides:
 * - JSON input state management
 * - Real-time validation
 * - JSON formatting
 * - Sample data loading
 * - Error handling
 *
 * Key features:
 * - Maintains input state with validation
 * - Provides formatting with error recovery
 * - Supports sample data loading for testing
 * - Manages error state and dismissal
 * - Controls tree visibility based on input validity
 */
export const useJsonTree = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [selectedSample, setSelectedSample] =
    useState<SampleType>("productExample");
  const { error, validate, clearError } = useJsonValidation();

  // Handle input change with validation
  const handleInputChange = useCallback(
    (value: string) => {
      setJsonInput(value);
      validate(value);
    },
    [validate]
  );

  // Handle input blur (same as change for this use case)
  const handleInputBlur = useCallback(
    (value: string) => {
      handleInputChange(value);
    },
    [handleInputChange]
  );

  // Format JSON
  const handleFormat = useCallback(() => {
    if (!jsonInput.trim()) return;

    try {
      const formatted = formatJson(jsonInput);
      setJsonInput(formatted);
      clearError();
    } catch {
      validate(jsonInput); // Re-validate to show error if formatting fails
    }
  }, [jsonInput, clearError, validate]);

  // Clear all data
  const handleClear = useCallback(() => {
    setJsonInput("");
    clearError();
  }, [clearError]);

  // Load sample data
  const handleSampleSelect = useCallback(
    (sampleType: SampleType, leftSample: string) => {
      setSelectedSample(sampleType);
      setJsonInput(leftSample);
      clearError();
    },
    [clearError]
  );

  // Handle error dismissal
  const handleErrorDismiss = useCallback(() => {
    clearError();
  }, [clearError]);

  // Tree is only shown when there is valid JSON input
  const shouldShowTree = jsonInput.trim() && !error;

  return {
    // State
    jsonInput,
    error,
    selectedSample,
    shouldShowTree,

    // Handlers
    handleInputChange,
    handleInputBlur,
    handleFormat,
    handleClear,
    handleSampleSelect,
    handleErrorDismiss,
  };
};
