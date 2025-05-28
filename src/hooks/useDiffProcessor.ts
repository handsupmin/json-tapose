import { useCallback, useMemo } from "react";
import type { DiffLine, ProcessedDiffLines } from "../types/diffTypes";
import type { JsonDiffItem } from "../utils/jsonUtils";
import {
  useDiffFilter,
  useLineNumberCalculator,
  usePropertyProcessors,
} from "./useLineProcessors";

/**
 * Hook for processing JSON diff items into renderable lines
 *
 * This hook orchestrates the conversion of JsonDiffItems into DiffLines with:
 * - Proper indentation and structure
 * - Line numbers for both sides
 * - Filtering based on diff-only mode and context lines
 * - Memoization for performance optimization
 *
 * The processing is done in stages:
 * 1. Convert diff items to full JSON lines
 * 2. Apply filtering if diff-only mode is enabled
 * 3. Calculate line numbers for both sides
 *
 * Each stage is memoized to prevent unnecessary recalculations.
 */
export const useDiffProcessor = (
  diffItems: JsonDiffItem[],
  showOnlyDiff: boolean,
  contextLines: number
): { processedLines: ProcessedDiffLines } => {
  const { calculateLineNumbers } = useLineNumberCalculator();
  const { addPropertyLines, addChangedPropertyLines, addPropertyToSide } =
    usePropertyProcessors();
  const { filterDiffLines } = useDiffFilter();

  // Convert diff items to lines with proper structure and indentation
  const processJsonToLinesImpl = useCallback(
    (items: JsonDiffItem[]) => {
      const fullLeftLines: DiffLine[] = [
        { content: "{", type: "header", indentLevel: 0, isOpening: true },
      ];
      const fullRightLines: DiffLine[] = [
        { content: "{", type: "header", indentLevel: 0, isOpening: true },
      ];

      items.forEach((item, index) => {
        const isLast = index === items.length - 1;

        switch (item.type) {
          case "unchanged":
            addPropertyLines(fullLeftLines, fullRightLines, item, isLast, 1);
            break;
          case "added":
            fullLeftLines.push({
              content: "",
              type: "placeholder",
              indentLevel: 1,
              isComma: !isLast,
            });
            addPropertyToSide(fullRightLines, item, "added", 1, isLast);
            break;
          case "removed":
            addPropertyToSide(fullLeftLines, item, "removed", 1, isLast);
            fullRightLines.push({
              content: "",
              type: "placeholder",
              indentLevel: 1,
              isComma: !isLast,
            });
            break;
          case "changed":
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

  // Memoize full JSON lines to prevent recalculation unless diffItems change
  const fullJsonLines = useMemo(
    () => processJsonToLinesImpl(diffItems),
    [diffItems, processJsonToLinesImpl]
  );

  // Apply filtering based on showOnlyDiff and contextLines settings
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

  // Calculate line numbers for both sides after filtering
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
