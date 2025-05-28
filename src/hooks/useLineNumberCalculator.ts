import type { DiffLine } from "../types/diffTypes";

/**
 * Hook for calculating line numbers in diff view
 *
 * This hook handles line number calculation with special cases:
 * - Placeholder lines (empty lines) get no line number (0)
 * - Expandable lines (collapsed sections) get no line number but increment
 *   the counter by the number of collapsed lines
 * - All other lines get sequential numbers
 *
 * The line numbers are used for:
 * - Visual reference in the diff view
 * - Line synchronization between panels
 * - Expandable section navigation
 */
export const useLineNumberCalculator = () => {
  // Calculate line numbers (skip placeholders and expandable lines)
  const calculateLineNumbers = (lines: DiffLine[]): number[] => {
    const lineNumbers: number[] = [];
    let lineNumber = 1; // Start from the first line

    lines.forEach((line) => {
      if (line.type === "placeholder") {
        // No line number for placeholder lines
        lineNumbers.push(0);
      } else if (line.type === "expandable") {
        // No line number for expandable lines (same lines)
        lineNumbers.push(0);

        // Increment the line counter by the number of collapsed lines
        // This ensures the next visible line has the correct sequential number
        if (line.collapsedLines) {
          lineNumber += line.collapsedLines;
        }
      } else {
        // Assign sequential numbers to all other lines
        lineNumbers.push(lineNumber);
        lineNumber++;
      }
    });

    return lineNumbers;
  };

  return { calculateLineNumbers };
};
