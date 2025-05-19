import type { JsonDiffItem } from "../utils/jsonUtils";

// Line type definition used for JSON comparison
export interface DiffLine {
  content: string;
  type:
    | "unchanged"
    | "added"
    | "removed"
    | "changed"
    | "header"
    | "placeholder"
    | "expandable";
  indentLevel: number;
  isOpening?: boolean;
  isClosing?: boolean;
  isComma?: boolean;
  collapsedLines?: number;
  originalIndex?: number;
  nextLineNumber?: number;
  collapsedRange?: { start: number; end: number };
}

// Diagonal pattern CSS style
export const diagonalPattern = {
  background: `repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--color-base-content) 20%, var(--color-base-100) 80%),
    color-mix(in srgb, var(--color-base-content) 20%, var(--color-base-100) 80%) 10px,
    color-mix(in srgb, var(--color-base-content) 5%, var(--color-base-100) 95%) 10px,
    color-mix(in srgb, var(--color-base-content) 5%, var(--color-base-100) 95%) 20px
  )`,
};

// Processed JSON line type
export interface ProcessedDiffLines {
  left: DiffLine[];
  right: DiffLine[];
  leftLineNumbers: number[];
  rightLineNumbers: number[];
}

// JSON comparison result Props type
export interface JsonDiffViewProps {
  diffItems: JsonDiffItem[];
}

// JSON input panel Props type
export interface JsonInputPanelProps {
  id: string;
  label: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  onFormat: () => void;
}
