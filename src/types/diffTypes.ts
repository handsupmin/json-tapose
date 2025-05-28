// Types for representing JSON diff lines, processed diff results, and related props
// Used for rendering and managing JSON diff views in the app
import type { JsonDiffItem } from "../utils/jsonUtils";

/**
 * Represents a single line in the JSON diff view
 * - Used for rendering lines with type, indentation, and metadata
 */
export interface DiffLine {
  content: string; // The text content of the line
  type:
    | "unchanged"
    | "added"
    | "removed"
    | "changed"
    | "header"
    | "placeholder"
    | "expandable"; // Type of diff line
  indentLevel: number; // Indentation level for nested structures
  isOpening?: boolean; // Marks opening bracket/brace
  isClosing?: boolean; // Marks closing bracket/brace
  isComma?: boolean; // Marks if line ends with a comma
  collapsedLines?: number; // Number of lines collapsed (for expandable)
  originalIndex?: number; // Original index in the source
  nextLineNumber?: number; // Next visible line number
  collapsedRange?: { start: number; end: number }; // Range of collapsed lines
}

/**
 * CSS style for diagonal pattern backgrounds (used for placeholders)
 */
export const diagonalPattern = {
  background: `repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--color-base-content) 20%, var(--color-base-100) 80%),
    color-mix(in srgb, var(--color-base-content) 20%, var(--color-base-100) 80%) 10px,
    color-mix(in srgb, var(--color-base-content) 5%, var(--color-base-100) 95%) 10px,
    color-mix(in srgb, var(--color-base-content) 5%, var(--color-base-100) 95%) 20px
  )`,
};

/**
 * Processed diff lines for left and right JSON, including line numbers
 */
export interface ProcessedDiffLines {
  left: DiffLine[];
  right: DiffLine[];
  leftLineNumbers: number[];
  rightLineNumbers: number[];
}

/**
 * Props for the JSON diff view component
 */
export interface JsonDiffViewProps {
  diffItems: JsonDiffItem[];
}

/**
 * Props for the JSON input panel component
 */
export interface JsonInputPanelProps {
  id: string;
  label: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  onFormat: () => void;
  onErrorDismiss?: () => void;
}
