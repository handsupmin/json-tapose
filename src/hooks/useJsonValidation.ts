import { useCallback, useState } from "react";
import { isValidJson } from "../utils/jsonUtils";

/**
 * Hook for JSON validation with error state management
 *
 * This hook provides:
 * - Real-time JSON validation
 * - Detailed error messages for invalid JSON
 * - Empty string handling (considered valid)
 * - Error state management and clearing
 *
 * The validation strategy:
 * - Empty strings are considered valid to allow for partial input
 * - Detailed error messages from JSON.parse are preserved
 * - Error state is cleared when input becomes valid
 */
export const useJsonValidation = () => {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError(null);
      return true;
    }

    try {
      JSON.parse(value);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isValid = useCallback((value: string): boolean => {
    return !value.trim() || isValidJson(value);
  }, []);

  return {
    error,
    validate,
    clearError,
    isValid,
    hasError: Boolean(error),
  };
};
