import React, { useState } from "react";
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
    | "placeholder"
    | "expandable"; // New type added: represents a collapsed section
  indentLevel: number; // Indentation level
  isOpening?: boolean; // Whether it's an opening bracket
  isClosing?: boolean; // Whether it's a closing bracket
  isComma?: boolean; // Whether the line has a comma
  collapsedLines?: number; // Number of collapsed lines
  originalIndex?: number; // Original line index
  nextLineNumber?: number; // Line number to be displayed after the expandable line
  collapsedRange?: { start: number; end: number }; // Collapsed line range (start and end)
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
  // State to determine whether to show only differences
  const [showOnlyDiff, setShowOnlyDiff] = useState<boolean>(false);
  // Number of context lines
  const [contextLines, setContextLines] = useState<number>(3);
  // References for left and right scroll containers
  const leftScrollRef = React.useRef<HTMLDivElement>(null);
  const rightScrollRef = React.useRef<HTMLDivElement>(null);
  // Track whether scroll is being synced to prevent infinite loop
  const isScrollingSynced = React.useRef<boolean>(false);

  // Synchronize scroll between left and right panels
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSynced.current) return;

    isScrollingSynced.current = true;

    const sourceElement = event.currentTarget;
    const targetElement =
      sourceElement === leftScrollRef.current
        ? rightScrollRef.current
        : leftScrollRef.current;

    if (targetElement) {
      targetElement.scrollTop = sourceElement.scrollTop;
      targetElement.scrollLeft = sourceElement.scrollLeft;
    }

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      isScrollingSynced.current = false;
    });
  };

  // Expand the entire JSON tree and convert it to line-by-line format
  const processJsonToLines = (): { left: DiffLine[]; right: DiffLine[] } => {
    // Generate all lines first
    const fullLeftLines: DiffLine[] = [
      { content: "{", type: "header", indentLevel: 0, isOpening: true },
    ];
    const fullRightLines: DiffLine[] = [
      { content: "{", type: "header", indentLevel: 0, isOpening: true },
    ];

    // Process all diff items - Show all top-level elements for context
    diffItems.forEach((item, index) => {
      const isLast = index === diffItems.length - 1;

      // Process based on item type
      switch (item.type) {
        case "unchanged":
          // Add identical lines to both sides
          addPropertyLines(fullLeftLines, fullRightLines, item, isLast);
          break;
        case "added":
          // Placeholder on the left, added item on the right
          fullLeftLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 1,
            isComma: !isLast,
          });
          addPropertyToSide(fullRightLines, item, "added", 1, isLast);
          break;
        case "removed":
          // Removed item on the left, placeholder on the right
          addPropertyToSide(fullLeftLines, item, "removed", 1, isLast);
          fullRightLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 1,
            isComma: !isLast,
          });
          break;
        case "changed":
          // Changed items on both sides (different content)
          addChangedPropertyLines(fullLeftLines, fullRightLines, item, isLast);
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

    // Filter lines if in "show only diff" mode
    if (showOnlyDiff) {
      const { left: filteredLeft, right: filteredRight } = filterDiffLines(
        fullLeftLines,
        fullRightLines,
        contextLines
      );
      return { left: filteredLeft, right: filteredRight };
    } else {
      return { left: fullLeftLines, right: fullRightLines };
    }
  };

  // Filter lines to show only diff and context
  const filterDiffLines = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    context: number
  ): { left: DiffLine[]; right: DiffLine[] } => {
    const newLeftLines: DiffLine[] = [];
    const newRightLines: DiffLine[] = [];

    // Find indices of lines with changes
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
        // If there are previously collapsed lines, add a collapsed line count
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
        // For unchanged lines, just increment the counter
        if (collapsedCount === 0) {
          collapsedStart = i; // Set the start index of collapsed lines
        }
        collapsedCount++;
      }
    }

    return { left: newLeftLines, right: newRightLines };
  };

  // Add property lines (common)
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
      // Complex object/array change - but don't mark parent objects as changed
      const isLeftArray = Array.isArray(item.value1);
      const isRightArray = Array.isArray(item.value2);

      // Left side (old version) - use "unchanged" for parent containers
      leftLines.push({
        content: `"${item.key}": ${isLeftArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel: 1,
        isOpening: true,
      });
      // Right side (new version) - use "unchanged" for parent containers
      rightLines.push({
        content: `"${item.key}": ${isRightArray ? "[" : "{"}`,
        type: "unchanged",
        indentLevel: 1,
        isOpening: true,
      });

      // Process child items on both sides (showing changes)
      processChangedChildItems(leftLines, rightLines, item.children);

      // Closing brackets - use "unchanged" for parent containers
      leftLines.push({
        content: `${isLeftArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel: 1,
        isClosing: true,
      });
      rightLines.push({
        content: `${isRightArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type: "unchanged",
        indentLevel: 1,
        isClosing: true,
      });
    }
  };

  // Add property to one side only (added or removed items)
  const addPropertyToSide = (
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

      // Process child items with the same type
      processSingleSideChildItems(lines, item.children, type);

      // Closing bracket
      lines.push({
        content: `${isArray ? "]" : "}"}${!isLast ? "," : ""}`,
        type,
        indentLevel,
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
    // Display all child items - highlight only the ones with changes
    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;

      switch (child.type) {
        case "unchanged":
          // Display regular items without changes
          addNestedPropertyLines(leftLines, rightLines, child, 2, isLast);
          break;

        case "added":
          // Added items
          leftLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          addNestedPropertyToSide(rightLines, child, "added", 2, isLast);
          break;

        case "removed":
          // Removed items
          addNestedPropertyToSide(leftLines, child, "removed", 2, isLast);
          rightLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          break;

        case "changed":
          // Changed items - parent containers shown as unchanged
          addNestedPropertyAsUnchangedContainer(
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
    // Display all child items - highlight only the ones with changes
    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;

      switch (child.type) {
        case "unchanged":
          // Display regular items without changes
          addNestedPropertyLines(leftLines, rightLines, child, 2, isLast);
          break;

        case "added":
          // Added items
          leftLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          addNestedPropertyToSide(rightLines, child, "added", 2, isLast);
          break;

        case "removed":
          // Removed items
          addNestedPropertyToSide(leftLines, child, "removed", 2, isLast);
          rightLines.push({
            content: "", // Empty content
            type: "placeholder", // Mark as placeholder since there's no matching field
            indentLevel: 2,
            isComma: !isLast,
          });
          break;

        case "changed":
          // Changed items - parent containers shown as unchanged
          addNestedPropertyAsUnchangedContainer(
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

  // Add nested property to one side only
  const addNestedPropertyToSide = (
    lines: DiffLine[],
    item: JsonDiffItem,
    type: "added" | "removed",
    indentLevel: number,
    isLast: boolean
  ) => {
    const value = type === "removed" ? item.value1 : item.value2;

    // Skip if value is undefined (property doesn't exist on this side)
    if (value === undefined) {
      return;
    }

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
        // Show all children
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

  // Add nested property as an unchanged container with changed children
  const addNestedPropertyAsUnchangedContainer = (
    leftLines: DiffLine[],
    rightLines: DiffLine[],
    item: JsonDiffItem,
    indentLevel: number,
    isLast: boolean
  ) => {
    if (!item.children) return;

    // Object/array property
    const isLeftArray = Array.isArray(item.value1);
    const isRightArray = Array.isArray(item.value2);

    // Key and opening bracket line - mark as unchanged
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

    // Display all child items - highlight only the ones with changes
    item.children.forEach((child, idx) => {
      const childIsLast = idx === item.children!.length - 1;

      switch (child.type) {
        case "unchanged":
          // Display unchanged items identically on both sides
          if (!child.children) {
            // Simple value
            const contentValue = renderSimpleValue(child.value1);
            leftLines.push({
              content: `"${child.key}": ${contentValue}${
                !childIsLast ? "," : ""
              }`,
              type: "unchanged",
              indentLevel: indentLevel + 1,
            });
            rightLines.push({
              content: `"${child.key}": ${contentValue}${
                !childIsLast ? "," : ""
              }`,
              type: "unchanged",
              indentLevel: indentLevel + 1,
            });
          } else {
            // Object/array - process recursively
            addNestedPropertyLines(
              leftLines,
              rightLines,
              child,
              indentLevel + 1,
              childIsLast
            );
          }
          break;

        case "added":
          // Added items - blank on left, added item on right
          leftLines.push({
            content: "",
            type: "placeholder",
            indentLevel: indentLevel + 1,
            isComma: !childIsLast,
          });
          // Add the item on right side
          addNestedPropertyToSide(
            rightLines,
            child,
            "added",
            indentLevel + 1,
            childIsLast
          );
          break;

        case "removed":
          // Removed items - removed item on left, blank on right
          addNestedPropertyToSide(
            leftLines,
            child,
            "removed",
            indentLevel + 1,
            childIsLast
          );
          // Show placeholder on right
          rightLines.push({
            content: "",
            type: "placeholder",
            indentLevel: indentLevel + 1,
            isComma: !childIsLast,
          });
          break;

        case "changed":
          // Changed items - simple value or nested object
          if (!child.children) {
            // Simple value change
            const leftValue = renderSimpleValue(child.value1);
            const rightValue = renderSimpleValue(child.value2);

            leftLines.push({
              content: `"${child.key}": ${leftValue}${!childIsLast ? "," : ""}`,
              type: "removed",
              indentLevel: indentLevel + 1,
            });
            rightLines.push({
              content: `"${child.key}": ${rightValue}${
                !childIsLast ? "," : ""
              }`,
              type: "added",
              indentLevel: indentLevel + 1,
            });
          } else {
            // Nested object change - process recursively
            addNestedPropertyAsUnchangedContainer(
              leftLines,
              rightLines,
              child,
              indentLevel + 1,
              childIsLast
            );
          }
          break;
      }
    });

    // Closing bracket line - mark as unchanged
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
  };

  // Render simple values (string, number, boolean, etc.)
  const renderSimpleValue = (value: unknown): string => {
    if (value === undefined) return "";
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

    lines.forEach((line, index) => {
      if (line.type === "placeholder") {
        // No line number for placeholder lines
        lineNumbers.push(0);
      } else if (line.type === "expandable") {
        // Display collapsed line range (line start and end)
        if (line.collapsedRange) {
          const start = line.collapsedRange.start + 1; // 1-indexed
          lineNumbers.push(start);
        } else {
          lineNumbers.push(0);
        }
      } else {
        // Calculate line number based on original index if available, otherwise use index + 1
        lineNumbers.push(
          line.originalIndex !== undefined ? line.originalIndex + 1 : index + 1
        );
      }
    });

    return lineNumbers;
  };

  // Calculate line numbers for left and right panels
  const leftLineNumbers = calculateLineNumbers(leftLines);
  const rightLineNumbers = calculateLineNumbers(rightLines);

  // Ensure scroll is synchronized even after component updates
  React.useEffect(() => {
    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;

    // Keep scrolling positions in sync if one container's height changes
    if (leftEl && rightEl) {
      if (leftEl.scrollHeight !== rightEl.scrollHeight) {
        // Calculate scroll ratio
        const scrollRatio =
          leftEl.scrollTop / (leftEl.scrollHeight - leftEl.clientHeight || 1);
        // Apply ratio to the other container
        rightEl.scrollTop =
          scrollRatio * (rightEl.scrollHeight - rightEl.clientHeight || 1);
      } else {
        // Heights are the same, just sync positions
        rightEl.scrollTop = leftEl.scrollTop;
      }
      rightEl.scrollLeft = leftEl.scrollLeft;
    }
  }, [leftLines, rightLines, showOnlyDiff, contextLines]);

  // Toggle between diff only and show all mode
  const toggleDiffMode = () => {
    setShowOnlyDiff(!showOnlyDiff);
  };

  // Change context lines
  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContextLines(parseInt(e.target.value, 10));
  };

  return (
    <div className="font-mono text-sm border border-base-300 rounded-md overflow-hidden github-diff">
      <div className="grid grid-cols-2 divide-x divide-base-300 border-b border-base-300 bg-base-200">
        <div className="px-4 py-2 font-semibold text-left">Old Version</div>
        <div className="px-4 py-2 font-semibold text-left">New Version</div>
      </div>

      {/* GitHub-like controls */}
      <div className="bg-base-300 px-4 py-2 border-b border-base-300 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleDiffMode}
            className={`btn btn-xs ${
              showOnlyDiff ? "btn-primary" : "btn-outline"
            }`}
          >
            {showOnlyDiff ? "Show All" : "Diff Only"}
          </button>

          {showOnlyDiff && (
            <div className="flex items-center gap-2">
              <span className="text-xs">Context:</span>
              <select
                value={contextLines}
                onChange={handleContextChange}
                className="select select-xs select-bordered"
              >
                <option value="0">0 lines</option>
                <option value="1">1 line</option>
                <option value="2">2 lines</option>
                <option value="3">3 lines</option>
                <option value="5">5 lines</option>
                <option value="10">10 lines</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 text-xs">
          <span className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-error/60 mr-1"></span>{" "}
            Removed
          </span>
          <span className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-success/60 mr-1"></span>{" "}
            Added
          </span>
          <span className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-base-content/20 mr-1"></span>{" "}
            Unchanged
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-base-300 h-full">
        {/* Left side (old version) - single scrollable area */}
        <div
          className="max-h-[600px] overflow-auto"
          ref={leftScrollRef}
          onScroll={handleScroll}
        >
          {leftLines.map((line, index) => {
            // Placeholder type gets a gray background
            const isPlaceholder = line.type === "placeholder";
            const isExpandable = line.type === "expandable";
            const lineNumber = leftLineNumbers[index];

            // Information for displaying collapsed line range
            let expandableText = line.content;
            if (isExpandable && line.collapsedRange) {
              expandableText = `... ${line.collapsedLines} same lines`;
            }

            return (
              <div
                key={`left-${index}`}
                className={`flex ${
                  line.type === "removed" ? "bg-error/10" : ""
                } ${isExpandable ? "bg-base-300/50 text-xs text-center" : ""}`}
              >
                <div
                  className="w-12 min-w-[48px] text-right pr-2 select-none border-r border-base-300 py-1 line-number"
                  style={{
                    color:
                      line.type === "removed"
                        ? "var(--color-error)"
                        : isPlaceholder || isExpandable
                        ? "var(--color-base-content)"
                        : "var(--color-base-content)",
                    opacity:
                      isPlaceholder || isExpandable
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
                  {isExpandable ? "" : lineNumber > 0 ? lineNumber : ""}
                </div>
                <div
                  className={`flex-1 pl-3 py-1 text-left min-h-[28px] flex items-center ${
                    isExpandable
                      ? "justify-center cursor-pointer hover:bg-base-300"
                      : ""
                  }`}
                  style={isPlaceholder ? diagonalPattern : {}}
                  onClick={isExpandable ? toggleDiffMode : undefined}
                >
                  {isExpandable ? (
                    <span className="text-base-content opacity-60 w-full text-center hover:underline hover:opacity-80">
                      {expandableText}
                    </span>
                  ) : !isPlaceholder ? (
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
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right side (new version) - single scrollable area */}
        <div
          className="max-h-[600px] overflow-auto"
          ref={rightScrollRef}
          onScroll={handleScroll}
        >
          {rightLines.map((line, index) => {
            // Placeholder type gets a gray background
            const isPlaceholder = line.type === "placeholder";
            const isExpandable = line.type === "expandable";
            const lineNumber = rightLineNumbers[index];

            // Information for displaying collapsed line range
            let expandableText = line.content;
            if (isExpandable && line.collapsedRange) {
              expandableText = `... ${line.collapsedLines} same lines`;
            }

            return (
              <div
                key={`right-${index}`}
                className={`flex ${
                  line.type === "added" ? "bg-success/10" : ""
                } ${isExpandable ? "bg-base-300/50 text-xs text-center" : ""}`}
              >
                <div
                  className="w-12 min-w-[48px] text-right pr-2 select-none border-r border-base-300 py-1 line-number"
                  style={{
                    color:
                      line.type === "added"
                        ? "var(--color-success)"
                        : isPlaceholder || isExpandable
                        ? "var(--color-base-content)"
                        : "var(--color-base-content)",
                    opacity:
                      isPlaceholder || isExpandable
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
                  {isExpandable ? "" : lineNumber > 0 ? lineNumber : ""}
                </div>
                <div
                  className={`flex-1 pl-3 py-1 text-left min-h-[28px] flex items-center ${
                    isExpandable
                      ? "justify-center cursor-pointer hover:bg-base-300"
                      : ""
                  }`}
                  style={isPlaceholder ? diagonalPattern : {}}
                  onClick={isExpandable ? toggleDiffMode : undefined}
                >
                  {isExpandable ? (
                    <span className="text-base-content opacity-60 w-full text-center hover:underline hover:opacity-80">
                      {expandableText}
                    </span>
                  ) : !isPlaceholder ? (
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
                  ) : null}
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
