import { useCallback, useState } from "react";
import type { JsonValidationError } from "../utils/jsonUtils";
import { parseJsonInput } from "../utils/jsonUtils";

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
  const [error, setError] = useState<JsonValidationError | null>(null);

  const validate = useCallback((value: string): boolean => {
    const parsed = parseJsonInput(value);
    setError(parsed.error);
    return parsed.error === null;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isValid = useCallback((value: string): boolean => {
    return parseJsonInput(value).error === null;
  }, []);

  return {
    error,
    validate,
    clearError,
    isValid,
    hasError: Boolean(error),
  };
};
