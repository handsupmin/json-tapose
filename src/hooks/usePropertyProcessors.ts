import type { DiffLine } from "../types/diffTypes";
import type { JsonDiffItem } from "../utils/jsonUtils";
import { useSimpleValueRenderer } from "./useSimpleValueRenderer";

/**
 * Hook for processing JSON properties into diff lines
 *
 * This hook provides functions to convert JsonDiffItems into DiffLines for rendering.
 * It handles different types of changes (added, removed, changed, unchanged) and
 * maintains proper indentation and structure for nested objects/arrays.
 *
 * The processing is done recursively, with special handling for:
 * - Nested objects and arrays
 * - Placeholder lines for missing properties
 * - Proper comma placement
 * - Indentation levels
 */
export const usePropertyProcessors = () => {
  const { renderSimpleValue } = useSimpleValueRenderer();

  /**
   * Process children items recursively, handling different types of changes
   * and maintaining proper structure for nested objects/arrays
   */
  const processChildren = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    children: JsonDiffItem[],
    baseIndent: number
  ) => {
    children.forEach((child, childIndex) => {
      const isLastChild = childIndex === children.length - 1;

      switch (child.type) {
        case "unchanged":
          addPropertyLines(
            leftLines,
            rightLines,
            child,
            isLastChild,
            baseIndent + 1
          );
          break;
        case "added":
          leftLines.push({
            content: "",
            type: "placeholder",
            indentLevel: baseIndent + 1,
            isComma: !isLastChild,
          });
          addPropertyToSide(
            rightLines,
            child,
            "added",
            baseIndent + 1,
            isLastChild
          );
          break;
        case "removed":
          addPropertyToSide(
            leftLines,
            child,
            "removed",
            baseIndent + 1,
            isLastChild
          );
          rightLines.push({
            content: "",
            type: "placeholder",
            indentLevel: baseIndent + 1,
            isComma: !isLastChild,
          });
          break;
        case "changed":
          addChangedPropertyLines(
            leftLines,
            rightLines,
            child,
            isLastChild,
            baseIndent + 1
          );
          break;
      }
    });
  };

  const addPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    isLast: boolean,
    indentLevel: number = 1
  ) => {
    if (!item.children || item.children.length === 0) {
      const contentValue = renderSimpleValue(item.value1);
      leftLines.push({
        content: `"${item.key}": ${contentValue}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel,
      });
      rightLines.push({
        content: `"${item.key}": ${contentValue}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel,
      });
    } else {
      const isArray = Array.isArray(item.value1);

      leftLines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel,
        isOpening: true,
      });
      rightLines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel,
        isOpening: true,
      });

      processChildren(leftLines, rightLines, item.children, indentLevel);

      leftLines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel,
        isClosing: true,
      });
      rightLines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel,
        isClosing: true,
      });
    }
  };

  /**
   * Add changed property to both sides, handling both simple value changes
   * and complex nested object/array changes. For nested changes, the parent
   * container is marked as unchanged while its children show the actual changes.
   */
  const addChangedPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    isLast: boolean,
    indentLevel: number = 1
  ) => {
    if (!item.children || item.children.length === 0) {
      leftLines.push({
        content: `"${item.key}": ${renderSimpleValue(item.value1)}${
          !isLast ? "," : ""
        }`,
        type: "removed",
        indentLevel,
      });
      rightLines.push({
        content: `"${item.key}": ${renderSimpleValue(item.value2)}${
          !isLast ? "," : ""
        }`,
        type: "added",
        indentLevel,
      });
    } else {
      const isLeftArray = Array.isArray(item.value1);
      const isRightArray = Array.isArray(item.value2);

      leftLines.push({
        content: `"${item.key}": ${isLeftArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel,
        isOpening: true,
      });
      rightLines.push({
        content: `"${item.key}": ${isRightArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel,
        isOpening: true,
      });

      processChildren(leftLines, rightLines, item.children, indentLevel);

      leftLines.push({
        content: `${isLeftArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel,
        isClosing: true,
      });
      rightLines.push({
        content: `${isRightArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel,
        isClosing: true,
      });
    }
  };

  const addPropertyToSide = (
    lines: DiffLine[],
    item: JsonDiffItem,
    type: "added" | "removed",
    indentLevel: number,
    isLast: boolean
  ) => {
    const value = type === "removed" ? item.value1 : item.value2;

    if (!item.children || item.children.length === 0) {
      lines.push({
        content: `"${item.key}": ${renderSimpleValue(value)}${
          !isLast ? "," : ""
        }`,
        type,
        indentLevel,
      });
    } else {
      const isArray = Array.isArray(value);

      lines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type,
        indentLevel,
        isOpening: true,
      });

      if (item.children && item.children.length > 0) {
        item.children.forEach((child, idx) => {
          const isLastChild = idx === item.children!.length - 1;
          const sideType = type === "added" ? "added" : "removed";
          addPropertyToSide(
            lines,
            child,
            sideType,
            indentLevel + 1,
            isLastChild
          );
        });
      }

      lines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type,
        indentLevel,
        isClosing: true,
      });
    }
  };

  return {
    addPropertyLines,
    addChangedPropertyLines,
    addPropertyToSide,
  };
};
