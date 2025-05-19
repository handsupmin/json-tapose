import type { DiffLine } from "../types/diffTypes";

/**
 * Hook for line number calculation
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
