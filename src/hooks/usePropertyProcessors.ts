import type { DiffLine } from "../types/diffTypes";
import type { JsonDiffItem } from "../utils/jsonUtils";
import { useSimpleValueRenderer } from "./useSimpleValueRenderer";

/**
 * Utility functions for processing individual properties
 */
export const usePropertyProcessors = () => {
  const { renderSimpleValue } = useSimpleValueRenderer();

  /**
   * Process children items recursively
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
          // Process unchanged children
          addPropertyLines(
            leftLines,
            rightLines,
            child,
            isLastChild,
            baseIndent + 1
          );
          break;
        case "added":
          // Add empty placeholder on left, actual item on right
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
          // Add actual item on left, empty placeholder on right
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
          // Process changed children
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

  /**
   * Add identical property lines (same on both sides)
   */
  const addPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    isLast: boolean,
    indentLevel: number = 1
  ) => {
    if (!item.children || item.children.length === 0) {
      // Basic property without children
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
      // Object/array property with children
      const isArray = Array.isArray(item.value1);

      // Key and opening bracket line
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

      // Process children recursively
      processChildren(leftLines, rightLines, item.children, indentLevel);

      // Closing bracket line (with comma if needed)
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
   * Add changed property to both sides
   */
  const addChangedPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    isLast: boolean,
    indentLevel: number = 1
  ) => {
    if (!item.children || item.children.length === 0) {
      // Simple value change without children
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
      // Complex object/array change - parent container marked as unchanged
      const isLeftArray = Array.isArray(item.value1);
      const isRightArray = Array.isArray(item.value2);

      // Left (previous version) - parent container marked as unchanged
      leftLines.push({
        content: `"${item.key}": ${isLeftArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel,
        isOpening: true,
      });
      // Right (new version) - parent container marked as unchanged
      rightLines.push({
        content: `"${item.key}": ${isRightArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel,
        isOpening: true,
      });

      // Process children recursively
      processChildren(leftLines, rightLines, item.children, indentLevel);

      // Closing bracket - parent container marked as unchanged
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

  /**
   * Add property to one side only (added or removed items)
   */
  const addPropertyToSide = (
    lines: DiffLine[],
    item: JsonDiffItem,
    type: "added" | "removed",
    indentLevel: number,
    isLast: boolean
  ) => {
    const value = type === "removed" ? item.value1 : item.value2;

    if (!item.children || item.children.length === 0) {
      // Basic property
      lines.push({
        content: `"${item.key}": ${renderSimpleValue(value)}${
          !isLast ? "," : ""
        }`,
        type,
        indentLevel,
      });
    } else {
      // Object/array property
      const isArray = Array.isArray(value);

      // Key and opening bracket
      lines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type,
        indentLevel,
        isOpening: true,
      });

      // Process children items
      if (item.children && item.children.length > 0) {
        item.children.forEach((child, idx) => {
          const isLastChild = idx === item.children!.length - 1;

          // For single-side rendering, we process all children with the same type
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

      // Closing bracket
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
