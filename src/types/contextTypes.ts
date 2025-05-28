// Types for JSON comparison context state and actions
// Used throughout the app for managing JSON input, diff results, and error handling
import type { JsonDiffItem } from "../utils/jsonUtils";

/**
 * State for JSON comparison context
 * - Holds both JSON inputs, diff result, error states, and loading status
 */
export interface JsonCompareState {
  leftJson: string; // Left-side JSON input
  rightJson: string; // Right-side JSON input
  diffResult: JsonDiffItem[] | null; // Diff result array or null
  error: string | null; // General error message
  loading: boolean; // Loading state for async operations
  leftJsonError: string | null; // Error for left JSON input
  rightJsonError: string | null; // Error for right JSON input
}

/**
 * Actions for JSON comparison context
 * - Methods to update state, validate, compare, format, and load sample data
 */
export interface JsonCompareActions {
  setLeftJson: (json: string) => void;
  setRightJson: (json: string) => void;
  validateJson: (side: "left" | "right", value: string) => void;
  compareJson: () => void;
  formatJson: (side: "left" | "right") => void;
  clearAll: () => void;
  loadSampleData: (leftJson: string, rightJson: string) => void;
}

/**
 * Combined context type for use in React context
 */
export interface JsonCompareContextType
  extends JsonCompareState,
    JsonCompareActions {}
