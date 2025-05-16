import React from "react";
import type { JsonDiffItem } from "../utils/jsonUtils";

interface JsonDiffViewProps {
  diffItems: JsonDiffItem[];
}

// Line type definition
interface DiffLine {
  content: string;
  type:
    | "unchanged"
    | "added"
    | "removed"
    | "changed"
    | "header"
    | "placeholder";
  indentLevel: number; // Indentation level
  isOpening?: boolean; // Whether it's an opening bracket
  isClosing?: boolean; // Whether it's a closing bracket
  isComma?: boolean; // Whether the line has a comma
}

// Create diagonal pattern using CSS linear gradient - automatic adaptation to daisyUI theme
const diagonalPattern = {
  // Create contrast using the theme's base-content color
  // First color: base-content with low opacity
  // Second color: base-100 with a slight mix of base-content
  background: `repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--color-base-content) 20%, var(--color-base-100) 80%),
    color-mix(in srgb, var(--color-base-content) 20%, var(--color-base-100) 80%) 10px,
    color-mix(in srgb, var(--color-base-content) 5%, var(--color-base-100) 95%) 10px,
    color-mix(in srgb, var(--color-base-content) 5%, var(--color-base-100) 95%) 20px
  )`,
};

const JsonDiffView: React.FC<JsonDiffViewProps> = ({ diffItems }) => {
  // Expand the entire JSON tree and convert it to line-by-line format
  const processJsonToLines = (): { left: DiffLine[]; right: DiffLine[] } => {
    const leftLines: DiffLine[] = [
      { content: "{", type: "header", indentLevel: 0, isOpening: true },
    ];
    const rightLines: DiffLine[] = [
      { content: "{", type: "header", indentLevel: 0, isOpening: true },
    ];

    // Iterate through all diffItems and convert each item to lines
    diffItems.forEach((item, index) => {
      const isLast = index === diffItems.length - 1;

      // Process based on item type
      switch (item.type) {
        case "unchanged":
          // Add identical lines to both sides
          addPropertyLines(leftLines, rightLines, item, isLast);
          break;
        case "added":
          // Placeholder on the left, added item on the right
          leftLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 1,
            isComma: !isLast,
          });
          addPropertyToSide(rightLines, item, "added", isLast);
          break;
        case "removed":
          // Removed item on the left, placeholder on the right
          addPropertyToSide(leftLines, item, "removed", isLast);
          rightLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 1,
            isComma: !isLast,
          });
          break;
        case "changed":
          // Changed items on both sides (different content)
          addChangedPropertyLines(leftLines, rightLines, item, isLast);
          break;
      }
    });

    // Add closing bracket
    leftLines.push({
      content: "}",
      type: "header",
      indentLevel: 0,
      isClosing: true,
    });
    rightLines.push({
      content: "}",
      type: "header",
      indentLevel: 0,
      isClosing: true,
    });

    return { left: leftLines, right: rightLines };
  };

  // Add basic properties to both sides
  const addPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    isLast: boolean
  ) => {
    if (!item.children) {
      // Basic property without children
      const contentValue = renderSimpleValue(item.value1);
      leftLines.push({
        content: `"${item.key}": ${contentValue}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel: 1,
      });
      rightLines.push({
        content: `"${item.key}": ${contentValue}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel: 1,
      });
    } else {
      // Object/array property with children
      const isArray = Array.isArray(item.value1);

      // Key and opening bracket line
      leftLines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel: 1,
        isOpening: true,
      });
      rightLines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel: 1,
        isOpening: true,
      });

      // Process child items
      processChildItems(leftLines, rightLines, item.children);

      // Closing bracket line (with comma if needed)
      leftLines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel: 1,
        isClosing: true,
      });
      rightLines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel: 1,
        isClosing: true,
      });
    }
  };

  // Add changed properties to both sides
  const addChangedPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    isLast: boolean
  ) => {
    if (!item.children) {
      // Simple value change without children
      leftLines.push({
        content: `"${item.key}": ${renderSimpleValue(item.value1)}${
          !isLast ? "," : ""
        }`,
        type: "removed",
        indentLevel: 1,
      });
      rightLines.push({
        content: `"${item.key}": ${renderSimpleValue(item.value2)}${
          !isLast ? "," : ""
        }`,
        type: "added",
        indentLevel: 1,
      });
    } else {
      // Complex object/array change
      const isLeftArray = Array.isArray(item.value1);
      const isRightArray = Array.isArray(item.value2);

      // Left side (old version)
      leftLines.push({
        content: `"${item.key}": ${isLeftArray ? "[" : "{"}`,
        type: "removed",
        indentLevel: 1,
        isOpening: true,
      });
      // Right side (new version)
      rightLines.push({
        content: `"${item.key}": ${isRightArray ? "[" : "{"}`,
        type: "added",
        indentLevel: 1,
        isOpening: true,
      });

      // Process child items on both sides (showing changes)
      processChangedChildItems(leftLines, rightLines, item.children);

      // Closing brackets
      leftLines.push({
        content: `${isLeftArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "removed",
        indentLevel: 1,
        isClosing: true,
      });
      rightLines.push({
        content: `${isRightArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "added",
        indentLevel: 1,
        isClosing: true,
      });
    }
  };

  // Add property to only one side (added or removed items)
  const addPropertyToSide = (
    lines: DiffLine[],
    item: JsonDiffItem,
    type: "added" | "removed",
    isLast: boolean
  ) => {
    const value = type === "removed" ? item.value1 : item.value2;

    if (!item.children) {
      // Basic property
      lines.push({
        content: `"${item.key}": ${renderSimpleValue(value)}${
          !isLast ? "," : ""
        }`,
        type,
        indentLevel: 1,
      });
    } else {
      // Object/array property
      const isArray = Array.isArray(value);

      // Key and opening bracket
      lines.push({
        content: `"${item.key}": ${isArray ? "[" : "{"}`,
        type,
        indentLevel: 1,
        isOpening: true,
      });

      // Process child items with the same type
      processSingleSideChildItems(lines, item.children, type);

      // Closing bracket
      lines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type,
        indentLevel: 1,
        isClosing: true,
      });
    }
  };

  // Process child items (identical items)
  const processChildItems = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    children: JsonDiffItem[]
  ) => {
    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;

      switch (child.type) {
        case "unchanged":
          // Same content on both sides
          addNestedPropertyLines(leftLines, rightLines, child, 2, isLast);
          break;
        case "added":
          // Added on the right side only
          leftLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          addNestedPropertyToSide(rightLines, child, "added", 2, isLast);
          break;
        case "removed":
          // Display on the left side only
          addNestedPropertyToSide(leftLines, child, "removed", 2, isLast);
          rightLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          break;
        case "changed":
          // Different content on both sides
          addNestedChangedPropertyLines(
            leftLines,
            rightLines,
            child,
            2,
            isLast
          );
          break;
      }
    });
  };

  // Process changed child items
  const processChangedChildItems = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    children: JsonDiffItem[]
  ) => {
    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;

      switch (child.type) {
        case "unchanged":
          // Show as changed even if unchanged, as it belongs to a different parent
          addNestedPropertyToSide(leftLines, child, "removed", 2, isLast);
          addNestedPropertyToSide(rightLines, child, "added", 2, isLast);
          break;
        case "added":
          // Placeholder + added line
          leftLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          addNestedPropertyToSide(rightLines, child, "added", 2, isLast);
          break;
        case "removed":
          // Removed line + placeholder
          addNestedPropertyToSide(leftLines, child, "removed", 2, isLast);
          rightLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          break;
        case "changed":
          // Different content on both sides
          addNestedPropertyToSide(leftLines, child, "removed", 2, isLast);
          addNestedPropertyToSide(rightLines, child, "added", 2, isLast);
          break;
      }
    });
  };

  // Add child items to only one side
  const processSingleSideChildItems = (
    lines: DiffLine[],
    children: JsonDiffItem[],
    type: "added" | "removed"
  ) => {
    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;
      addNestedPropertyToSide(lines, child, type, 2, isLast);
    });
  };

  // Add nested property lines (common)
  const addNestedPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    indentLevel: number,
    isLast: boolean
  ) => {
    if (!item.children) {
      // Case without children
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
      // Case with object/array
      const isArray = Array.isArray(item.value1);

      // Key and opening bracket
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

      // Recursively process children
      item.children.forEach((child, idx) => {
        const childIsLast = idx === item.children!.length - 1;
        addNestedPropertyLines(
          leftLines,
          rightLines,
          child,
          indentLevel + 1,
          childIsLast
        );
      });

      // Closing bracket
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

  // Add nested changed property lines
  const addNestedChangedPropertyLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    indentLevel: number,
    isLast: boolean
  ) => {
    if (!item.children) {
      // Case without children (value change only)
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
      // Case with changed object/array
      const isLeftArray = Array.isArray(item.value1);
      const isRightArray = Array.isArray(item.value2);

      // Opening brackets
      leftLines.push({
        content: `"${item.key}": ${isLeftArray ? "[" : "{"}`,
        type: "removed",
        indentLevel,
        isOpening: true,
      });
      rightLines.push({
        content: `"${item.key}": ${isRightArray ? "[" : "{"}`,
        type: "added",
        indentLevel,
        isOpening: true,
      });

      // Process child items separately for each side
      if (item.children) {
        item.children.forEach((child, idx) => {
          const childIsLast = idx === item.children!.length - 1;

          // Process based on type
          switch (child.type) {
            case "unchanged":
              addNestedPropertyToSide(
                leftLines,
                child,
                "removed",
                indentLevel + 1,
                childIsLast
              );
              addNestedPropertyToSide(
                rightLines,
                child,
                "added",
                indentLevel + 1,
                childIsLast
              );
              break;
            case "added":
              leftLines.push({
                content: "", // Empty content
                type: "placeholder", // Mark as placeholder since there's no matching field
                indentLevel: indentLevel + 1,
              });
              addNestedPropertyToSide(
                rightLines,
                child,
                "added",
                indentLevel + 1,
                childIsLast
              );
              break;
            case "removed":
              addNestedPropertyToSide(
                leftLines,
                child,
                "removed",
                indentLevel + 1,
                childIsLast
              );
              rightLines.push({
                content: "", // Empty content
                type: "placeholder", // Mark as placeholder since there's no matching field
                indentLevel: indentLevel + 1,
              });
              break;
            case "changed":
              addNestedPropertyToSide(
                leftLines,
                child,
                "removed",
                indentLevel + 1,
                childIsLast
              );
              addNestedPropertyToSide(
                rightLines,
                child,
                "added",
                indentLevel + 1,
                childIsLast
              );
              break;
          }
        });
      }

      // Closing brackets
      leftLines.push({
        content: `${isLeftArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "removed",
        indentLevel,
        isClosing: true,
      });
      rightLines.push({
        content: `${isRightArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "added",
        indentLevel,
        isClosing: true,
      });
    }
  };

  // Add nested property to one side only
  const addNestedPropertyToSide = (
    lines: DiffLine[],
    item: JsonDiffItem,
    type: "added" | "removed",
    indentLevel: number,
    isLast: boolean
  ) => {
    const value = type === "removed" ? item.value1 : item.value2;

    if (!item.children) {
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

      // Recursively process child items
      if (item.children) {
        item.children.forEach((child, idx) => {
          const childIsLast = idx === item.children!.length - 1;
          addNestedPropertyToSide(
            lines,
            child,
            type,
            indentLevel + 1,
            childIsLast
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

  // Render simple values (string, number, boolean, etc.)
  const renderSimpleValue = (value: unknown): string => {
    if (value === undefined) return "undefined";
    if (value === null) return "null";

    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "object") {
      // Display objects/arrays completely (no abbreviation)
      return JSON.stringify(value, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : line.trim()))
        .join(" ");
    }

    return String(value);
  };

  // Create indentation spaces (2 spaces per level)
  const getIndent = (level: number): string => {
    return "  ".repeat(level);
  };

  // Run processing
  const { left: leftLines, right: rightLines } = processJsonToLines();

  // Calculate line numbers properly (skip placeholder lines)
  const calculateLineNumbers = (lines: DiffLine[]): number[] => {
    const lineNumbers: number[] = [];
    let currentLineNumber = 1;

    lines.forEach((line) => {
      if (line.type === "placeholder") {
        // No line number for placeholder lines
        lineNumbers.push(0);
      } else {
        lineNumbers.push(currentLineNumber++);
      }
    });

    return lineNumbers;
  };

  // Calculate line numbers for left and right panels
  const leftLineNumbers = calculateLineNumbers(leftLines);
  const rightLineNumbers = calculateLineNumbers(rightLines);

  return (
    <div className="font-mono text-sm border border-base-300 rounded-md overflow-hidden github-diff">
      <div className="grid grid-cols-2 divide-x divide-base-300 border-b border-base-300 bg-base-200">
        <div className="px-4 py-2 font-semibold text-left">Old Version</div>
        <div className="px-4 py-2 font-semibold text-left">New Version</div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-base-300 h-full">
        {/* Left side (old version) - single scrollable area */}
        <div className="max-h-[600px] overflow-y-auto">
          {leftLines.map((line, index) => {
            // Placeholder type gets a gray background
            const isPlaceholder = line.type === "placeholder";
            const lineNumber = leftLineNumbers[index];

            return (
              <div
                key={`left-${index}`}
                className={`flex ${
                  line.type === "removed" ? "bg-error/10" : ""
                }`}
              >
                <div
                  className="w-12 min-w-[48px] text-right pr-2 select-none border-r border-base-300 py-1 line-number"
                  style={{
                    color:
                      line.type === "removed"
                        ? "var(--color-error)"
                        : isPlaceholder
                        ? "var(--color-base-content)"
                        : "var(--color-base-content)",
                    opacity: isPlaceholder
                      ? 0.3
                      : line.type === "header"
                      ? 0.5
                      : 0.7,
                    backgroundColor:
                      line.type === "removed"
                        ? "rgba(var(--color-error-rgb), 0.1)"
                        : "var(--color-base-200)",
                  }}
                >
                  {lineNumber > 0 ? lineNumber : ""}
                </div>
                <div
                  className="flex-1 pl-3 py-1 text-left min-h-[28px] flex items-center"
                  style={isPlaceholder ? diagonalPattern : {}}
                >
                  {!isPlaceholder && (
                    <span
                      className={`${
                        line.type === "removed"
                          ? "text-error"
                          : "text-base-content"
                      } whitespace-pre`}
                    >
                      {getIndent(line.indentLevel)}
                      {line.content}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side (new version) - single scrollable area */}
        <div className="max-h-[600px] overflow-y-auto">
          {rightLines.map((line, index) => {
            // Placeholder type gets a gray background
            const isPlaceholder = line.type === "placeholder";
            const lineNumber = rightLineNumbers[index];

            return (
              <div
                key={`right-${index}`}
                className={`flex ${
                  line.type === "added" ? "bg-success/10" : ""
                }`}
              >
                <div
                  className="w-12 min-w-[48px] text-right pr-2 select-none border-r border-base-300 py-1 line-number"
                  style={{
                    color:
                      line.type === "added"
                        ? "var(--color-success)"
                        : isPlaceholder
                        ? "var(--color-base-content)"
                        : "var(--color-base-content)",
                    opacity: isPlaceholder
                      ? 0.3
                      : line.type === "header"
                      ? 0.5
                      : 0.7,
                    backgroundColor:
                      line.type === "added"
                        ? "rgba(var(--color-success-rgb), 0.1)"
                        : "var(--color-base-200)",
                  }}
                >
                  {lineNumber > 0 ? lineNumber : ""}
                </div>
                <div
                  className="flex-1 pl-3 py-1 text-left min-h-[28px] flex items-center"
                  style={isPlaceholder ? diagonalPattern : {}}
                >
                  {!isPlaceholder && (
                    <span
                      className={`${
                        line.type === "added"
                          ? "text-success"
                          : "text-base-content"
                      } whitespace-pre`}
                    >
                      {getIndent(line.indentLevel)}
                      {line.content}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JsonDiffView;
