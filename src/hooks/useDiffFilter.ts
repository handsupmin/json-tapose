import type { DiffLine } from "../types/diffTypes";

/**
 * Hook for filtering diff lines to show only relevant changes
 *
 * This hook provides functionality to:
 * - Show only changed lines and their surrounding context
 * - Collapse unchanged sections with expandable placeholders
 * - Always show header and footer lines
 * - Maintain proper line numbering and indentation
 *
 * The filtering process:
 * 1. Identifies changed lines and their context
 * 2. Collapses consecutive unchanged lines into expandable sections
 * 3. Preserves line numbers and indentation for proper rendering
 * 4. Handles edge cases like header/footer visibility
 */
export const useDiffFilter = () => {
  // Filter lines to show diff only
  const filterDiffLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    context: number
  ): { left: DiffLine[]; right: DiffLine[] } => {
    const newLeftLines: DiffLine[] = [];
    const newRightLines: DiffLine[] = [];

    // Find indices of changed lines
    const changedIndices = new Set<number>();
    for (let i = 0; i < leftLines.length; i++) {
      if (
        leftLines[i].type === "added" ||
        leftLines[i].type === "removed" ||
        rightLines[i].type === "added" ||
        rightLines[i].type === "removed"
      ) {
        // Add current line and surrounding context lines
        for (
          let j = Math.max(0, i - context);
          j <= Math.min(leftLines.length - 1, i + context);
          j++
        ) {
          changedIndices.add(j);
        }
      }
    }

    // Always show header and footer
    changedIndices.add(0);
    changedIndices.add(leftLines.length - 1);

    // Filter lines to include only changed parts and context
    let collapsedCount = 0;
    let collapsedStart = -1;

    for (let i = 0; i < leftLines.length; i++) {
      if (changedIndices.has(i)) {
        // Add collapsed line count if there were previous collapsed lines
        if (collapsedCount > 0) {
          const collapsedEnd = i - 1; // Last collapsed line index

          newLeftLines.push({
            content: `... ${collapsedCount} same lines ...`,
            type: "expandable",
            indentLevel: 0,
            collapsedLines: collapsedCount,
            collapsedRange: { start: collapsedStart, end: collapsedEnd },
          });
          newRightLines.push({
            content: `... ${collapsedCount} same lines ...`,
            type: "expandable",
            indentLevel: 0,
            collapsedLines: collapsedCount,
            collapsedRange: { start: collapsedStart, end: collapsedEnd },
          });
          collapsedCount = 0;
          collapsedStart = -1;
        }

        // Add changed line or context line
        const leftLine = { ...leftLines[i], originalIndex: i };
        const rightLine = { ...rightLines[i], originalIndex: i };
        newLeftLines.push(leftLine);
        newRightLines.push(rightLine);
      } else {
        // For unchanged lines, just increment counter
        if (collapsedCount === 0) {
          collapsedStart = i; // Set starting index of collapsed lines
        }
        collapsedCount++;
      }
    }

    return { left: newLeftLines, right: newRightLines };
  };

  return { filterDiffLines };
};
