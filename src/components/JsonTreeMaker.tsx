import React, { useCallback, useEffect, useState } from "react";

/**
 * Type definitions for JSON tree structure
 * Represents all possible JSON value types and their nested structures
 */
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonTreeNodeProps {
  data: JsonValue;
  keyName?: string;
  level?: number;
  isRoot?: boolean;
  expandAll?: boolean;
}

/**
 * Recursive component for rendering JSON tree nodes
 *
 * Features:
 * - Expandable/collapsible nodes
 * - Auto-expansion of first 2 levels
 * - Type-based value formatting
 * - Syntax highlighting
 * - Nested structure visualization
 *
 * The component:
 * - Handles all JSON value types
 * - Provides visual hierarchy
 * - Maintains consistent styling
 * - Supports keyboard navigation
 */
const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  data,
  keyName,
  level = 0,
  isRoot = false,
  expandAll,
}) => {
  // Auto-expand first 2 levels for better initial visibility, or use expandAll prop
  const [isExpanded, setIsExpanded] = useState(expandAll ?? level < 2);

  // Update expanded state when expandAll changes
  useEffect(() => {
    if (expandAll !== undefined) {
      setIsExpanded(expandAll);
    }
  }, [expandAll]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Determine the type of a JSON value for styling and display
  const getDataType = (value: JsonValue): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  // Format value display based on type
  // Arrays and objects show their size/length
  const getValueDisplay = (value: JsonValue): string => {
    const type = getDataType(value);
    switch (type) {
      case "string":
        return `"${value}"`;
      case "number":
      case "boolean":
      case "null":
        return String(value);
      case "array":
        return `[${(value as JsonArray).length}]`;
      case "object":
        return `{${Object.keys(value as JsonObject).length}}`;
      default:
        return String(value);
    }
  };

  // Check if a value can be expanded (has children)
  const isExpandable = (value: JsonValue): boolean => {
    return (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "object" &&
        value !== null &&
        Object.keys(value as JsonObject).length > 0)
    );
  };

  // Render expand/collapse button for expandable nodes
  const renderExpandButton = () => {
    if (!isExpandable(data)) return <span className="w-4"></span>;

    return (
      <button
        onClick={toggleExpanded}
        className="w-4 h-4 flex items-center justify-center text-xs hover:bg-base-300 rounded text-base-content/60"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        {isExpanded ? "▼" : "▶"}
      </button>
    );
  };

  // Render the key-value pair with appropriate styling
  const renderKeyValue = () => {
    const type = getDataType(data);

    return (
      <div className="inline-flex items-center min-w-full h-[21px]">
        <div className="flex-none w-6 mr-1 flex items-center">
          {renderExpandButton()}
        </div>
        {keyName && (
          <>
            <div className="flex-none mr-1 flex items-center">
              <span className="text-primary font-medium truncate max-w-[200px]">
                {keyName}
              </span>
            </div>
            <div className="flex-none mr-1 flex items-center">
              <span className="text-base-content/60">:</span>
            </div>
          </>
        )}
        <div className="flex-1 min-w-0 flex items-center">
          {isRoot && (
            <div className="text-base-content/60 italic mr-2">object</div>
          )}
          <span
            className={`whitespace-nowrap ${
              type === "string"
                ? "text-success"
                : type === "number"
                ? "text-warning"
                : type === "boolean"
                ? "text-secondary"
                : type === "null"
                ? "text-error italic"
                : "text-base-content/60 font-medium"
            }`}
          >
            {getValueDisplay(data)}
          </span>
        </div>
      </div>
    );
  };

  // Recursively render child nodes for arrays and objects
  const renderChildren = () => {
    if (!isExpandable(data) || !isExpanded) return null;

    if (Array.isArray(data)) {
      return (
        <div className="pl-7">
          {data.map((item, index) => (
            <JsonTreeNode
              key={index}
              data={item}
              keyName={String(index)}
              level={level + 1}
              expandAll={expandAll}
            />
          ))}
        </div>
      );
    }

    // Render object entries
    const entries = Object.entries(data as JsonObject);
    return (
      <div className="pl-7">
        {entries.map(([key, value]) => (
          <JsonTreeNode
            key={key}
            data={value}
            keyName={key}
            level={level + 1}
            expandAll={expandAll}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="json-tree-item">
      {renderKeyValue()}
      {renderChildren()}
    </div>
  );
};

interface JsonTreeMakerProps {
  jsonData: string;
  error?: string;
  expandAll?: boolean;
}

/**
 * Main component for rendering JSON data as an interactive tree
 *
 * Features:
 * - JSON parsing and validation
 * - Error handling and display
 * - Empty state visualization
 * - Syntax highlighting
 * - Responsive layout
 *
 * The component:
 * - Parses and validates JSON input
 * - Manages parsing state and errors
 * - Provides visual feedback
 * - Maintains consistent styling
 */
const JsonTreeMaker: React.FC<JsonTreeMakerProps> = ({
  jsonData,
  error,
  expandAll,
}) => {
  const [parsedData, setParsedData] = useState<JsonValue | null>(null);
  const [parseError, setParseError] = useState<string>("");

  // Parse JSON data and handle errors
  React.useEffect(() => {
    if (!jsonData.trim()) {
      setParsedData(null);
      setParseError("");
      return;
    }

    try {
      const parsed = JSON.parse(jsonData) as JsonValue;
      setParsedData(parsed);
      setParseError("");
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON");
      setParsedData(null);
    }
  }, [jsonData]);

  // Display error state
  if (error || parseError) {
    return (
      <div className="json-tree-viewer bg-base-100 rounded-lg p-4 border border-error">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error || parseError}</span>
        </div>
      </div>
    );
  }

  // Display empty state
  if (!parsedData) {
    return (
      <div className="json-tree-viewer bg-base-100 rounded-lg p-8 border border-base-300">
        <div className="text-center text-base-content/60">
          <div className="text-4xl mb-4">📄</div>
          <p>Paste your JSON data to see the tree structure</p>
        </div>
      </div>
    );
  }

  // Render JSON tree with syntax highlighting
  return (
    <div
      className="bg-base-100 rounded-lg p-4 border border-base-300 max-h-96 overflow-auto text-left font-mono text-sm leading-normal"
      translate="no"
    >
      <div className="pl-0">
        {" "}
        {/* Root level has no padding */}
        <JsonTreeNode data={parsedData} isRoot={true} expandAll={expandAll} />
      </div>
    </div>
  );
};

export default JsonTreeMaker;
