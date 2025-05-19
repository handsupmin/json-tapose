import { useCallback, useMemo } from "react";
import type { DiffLine, ProcessedDiffLines } from "../types/diffTypes";
import type { JsonDiffItem } from "../utils/jsonUtils";
import {
  useDiffFilter,
  useLineNumberCalculator,
  usePropertyProcessors,
} from "./useLineProcessors";

export const useDiffProcessor = (
  diffItems: JsonDiffItem[],
  showOnlyDiff: boolean,
  contextLines: number
): { processedLines: ProcessedDiffLines } => {
  // Necessary utility hooks
  const { calculateLineNumbers } = useLineNumberCalculator();
  const { addPropertyLines, addChangedPropertyLines, addPropertyToSide } =
    usePropertyProcessors();
  const { filterDiffLines } = useDiffFilter();

  // Use a stable reference for processJsonToLines function
  const processJsonToLinesImpl = useCallback(
    (items: JsonDiffItem[]) => {
      // Create initial lines
      const fullLeftLines: DiffLine[] = [
        { content: "{", type: "header", indentLevel: 0, isOpening: true },
      ];
      const fullRightLines: DiffLine[] = [
        { content: "{", type: "header", indentLevel: 0, isOpening: true },
      ];

      // Process all diff items - display all top-level elements for context
      items.forEach((item, index) => {
        const isLast = index === items.length - 1;

        // Process based on item type
        switch (item.type) {
          case "unchanged":
            // Add identical lines on both sides
            addPropertyLines(fullLeftLines, fullRightLines, item, isLast, 1);
            break;
          case "added":
            // Placeholder on left, added item on right
            fullLeftLines.push({
              content: "", // Empty content
              type: "placeholder", // Mark as placeholder since there's no matching field
              indentLevel: 1,
              isComma: !isLast,
            });
            addPropertyToSide(fullRightLines, item, "added", 1, isLast);
            break;
          case "removed":
            // Removed item on left, placeholder on right
            addPropertyToSide(fullLeftLines, item, "removed", 1, isLast);
            fullRightLines.push({
              content: "", // Empty content
              type: "placeholder", // Mark as placeholder since there's no matching field
              indentLevel: 1,
              isComma: !isLast,
            });
            break;
          case "changed":
            // Changed items on both sides with different content
            addChangedPropertyLines(
              fullLeftLines,
              fullRightLines,
              item,
              isLast,
              1
            );
            break;
        }
      });

      // Add closing bracket
      fullLeftLines.push({
        content: "}",
        type: "header",
        indentLevel: 0,
        isClosing: true,
      });
      fullRightLines.push({
        content: "}",
        type: "header",
        indentLevel: 0,
        isClosing: true,
      });

      return { left: fullLeftLines, right: fullRightLines };
    },
    [addPropertyLines, addChangedPropertyLines, addPropertyToSide]
  );

  // Memoize the full JSON lines processing - only recalculate when diffItems change
  const fullJsonLines = useMemo(
    () => processJsonToLinesImpl(diffItems),
    [diffItems, processJsonToLinesImpl]
  );

  // Memoize the filtered JSON lines based on showOnlyDiff and contextLines settings
  const filteredJsonLines = useMemo(() => {
    if (showOnlyDiff) {
      return filterDiffLines(
        fullJsonLines.left,
        fullJsonLines.right,
        contextLines
      );
    }
    return fullJsonLines;
  }, [fullJsonLines, showOnlyDiff, contextLines, filterDiffLines]);

  // Memoize the final processed lines with line numbers
  const processedLines = useMemo(() => {
    const { left, right } = filteredJsonLines;
    const leftLineNumbers = calculateLineNumbers(left);
    const rightLineNumbers = calculateLineNumbers(right);

    return {
      left,
      right,
      leftLineNumbers,
      rightLineNumbers,
    };
  }, [filteredJsonLines, calculateLineNumbers]);

  return {
    processedLines,
  };
};
