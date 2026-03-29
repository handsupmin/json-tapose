type DiffType = "added" | "removed" | "unchanged" | "changed";
export type JsonContainerType = "object" | "array";
type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];
export type JsonRootValue = JsonObject | JsonArray;

export interface JsonValidationError {
  message: string;
  index: number;
  line: number;
  column: number;
  endIndex: number;
  endLine: number;
  endColumn: number;
}

export interface JsonInlineErrorPreview {
  mode: "inline";
  line: number;
  column: number;
  prefix: string;
  highlight: string;
  suffix: string;
}

export interface JsonMultilineErrorPreviewLine {
  lineNumber: number;
  text: string;
  isFocus: boolean;
}

export interface JsonMultilineErrorPreview {
  mode: "multiline";
  focusLine: number;
  focusColumn: number;
  lines: JsonMultilineErrorPreviewLine[];
}

export type JsonErrorPreview =
  | JsonInlineErrorPreview
  | JsonMultilineErrorPreview;

export interface JsonParseResult {
  value: unknown | null;
  error: JsonValidationError | null;
}

export interface JsonComparisonResult {
  items: JsonDiffItem[];
  leftRootType: JsonContainerType;
  rightRootType: JsonContainerType;
}

/**
 * Represents a difference between two JSON objects
 * @property key - The property name that differs
 * @property type - The type of difference (added, removed, changed, or unchanged)
 * @property value1 - The value from the first object (if present)
 * @property value2 - The value from the second object (if present)
 * @property children - Nested differences for object/array values
 * @property path - Array of keys representing the full path to this difference (e.g. ['user', 'address', 'city'])
 */
export interface JsonDiffItem {
  key: string;
  type: DiffType;
  value1?: unknown;
  value2?: unknown;
  children?: JsonDiffItem[];
  path: string[];
  isArrayItem?: boolean;
}

// Add sample types export
export type SampleType =
  | "identical"
  | "sameContentDifferentOrder"
  | "differentValues"
  | "differentStructure"
  | "productExample";

// Add sample names and labels for UI
export const sampleOptions = [
  { value: "identical", label: "1. Identical JSON" },
  {
    value: "sameContentDifferentOrder",
    label: "2. Same Content, Different Field Order",
  },
  { value: "differentValues", label: "3. Different Field Values" },
  { value: "differentStructure", label: "4. Different JSON Structure" },
  { value: "productExample", label: "5. Product Example" },
];

/**
 * Validate if a string is valid JSON
 */
export const isValidJson = (jsonString: string): boolean => {
  return parseJsonInput(jsonString).error === null;
};

/**
 * Format JSON string with indentation
 */
export const formatJson = (jsonString: string): string => {
  const parsed = parseJsonInput(jsonString);
  return parsed.error ? jsonString : JSON.stringify(parsed.value, null, 2);
};

/**
 * Parse JSON input and expose structured error details for UI feedback.
 */
export const parseJsonInput = (jsonString: string): JsonParseResult => {
  if (!jsonString.trim()) {
    return {
      value: null,
      error: null,
    };
  }

  try {
    return {
      value: JSON.parse(jsonString) as unknown,
      error: null,
    };
  } catch (error) {
    return {
      value: null,
      error: buildJsonValidationError(jsonString, error),
    };
  }
};

/**
 * Build a human-readable preview around a JSON parse failure.
 */
export const buildJsonErrorPreview = (
  jsonString: string,
  error: JsonValidationError
): JsonErrorPreview => {
  const lines = jsonString.split("\n");
  const safeLineIndex = Math.max(0, Math.min(error.line - 1, lines.length - 1));
  const lineText = lines[safeLineIndex] ?? "";
  const focusColumn = Math.max(1, error.column);
  const lineBoundaryFailure =
    error.index >= jsonString.length ||
    jsonString[error.index] === "\n" ||
    jsonString[error.index] === "\r";
  const isMultiline =
    error.line !== error.endLine || lineBoundaryFailure || lineText.length === 0;

  if (isMultiline) {
    const startLine = Math.max(1, error.line - 3);
    const endLine = Math.min(lines.length, error.endLine + 3);

    return {
      mode: "multiline",
      focusLine: error.line,
      focusColumn,
      lines: lines
        .slice(startLine - 1, endLine)
        .map((text, index) => {
          const lineNumber = startLine + index;
          return {
            lineNumber,
            text,
            isFocus: lineNumber >= error.line && lineNumber <= error.endLine,
          };
        }),
    };
  }

  const focusIndex = Math.max(
    0,
    Math.min(lineText.length - 1, focusColumn - 1, error.endColumn - 1)
  );
  const start = Math.max(0, focusIndex - 7);
  const end = Math.min(lineText.length, focusIndex + 8);
  const highlight = lineText.slice(focusIndex, focusIndex + 1) || " ";

  return {
    mode: "inline",
    line: error.line,
    column: focusColumn,
    prefix: lineText.slice(start, focusIndex),
    highlight,
    suffix: lineText.slice(focusIndex + highlight.length, end),
  };
};

/**
 * Compare two JSON container values and generate a diff report with root metadata.
 *
 * Performance optimizations:
 * - Uses a cache to avoid re-comparing the same paths
 * - Efficiently collects keys using Set
 * - Early returns for simple cases
 * - Recursive comparison only for nested objects
 */
export const compareJsonDocuments = (
  json1: JsonRootValue,
  json2: JsonRootValue
): JsonComparisonResult => {
  const leftRootType = getJsonContainerType(json1);
  const rightRootType = getJsonContainerType(json2);

  if (leftRootType !== rightRootType) {
    throw new Error(
      "Both JSON roots must use the same container type (object or array)"
    );
  }

  // Cache for memoizing comparison results to avoid redundant work
  const cache = new Map<string, JsonDiffItem>();

  // Internal function to perform the actual comparison
  const compareContainers = (
    obj1: JsonRootValue | null,
    obj2: JsonRootValue | null,
    currentPath: string[] = [],
    containerType: JsonContainerType
  ): JsonDiffItem[] => {
    const results: JsonDiffItem[] = [];

    if (!obj1 && !obj2) return results;

    const safeObj1 = obj1 || getEmptyContainer(containerType);
    const safeObj2 = obj2 || getEmptyContainer(containerType);
    const safeObj1Record = safeObj1 as Record<string, unknown>;
    const safeObj2Record = safeObj2 as Record<string, unknown>;

    const allKeys =
      containerType === "array"
        ? getArrayKeys(safeObj1 as JsonArray, safeObj2 as JsonArray)
        : Array.from(
            new Set([
              ...Object.keys(safeObj1 as JsonObject),
              ...Object.keys(safeObj2 as JsonObject),
            ])
          );

    // Process each key
    for (const key of allKeys) {
      // Check if key exists in each object
      const inObj1 = key in safeObj1Record;
      const inObj2 = key in safeObj2Record;

      // Calculate path for current key
      const keyPath = [...currentPath, key];
      const cacheKey = keyPath.join(".");

      // Check cache for result
      if (cache.has(cacheKey)) {
        results.push(cache.get(cacheKey)!);
        continue;
      }

      const value1 = inObj1 ? safeObj1Record[key] : undefined;
      const value2 = inObj2 ? safeObj2Record[key] : undefined;

      // Key exists only in the second object (added)
      if (!inObj1 && inObj2) {
        const item: JsonDiffItem = {
          key,
          type: "added",
          value2,
          path: keyPath,
          isArrayItem: containerType === "array",
        };
        cache.set(cacheKey, item);
        results.push(item);
        continue;
      }

      // Key exists only in the first object (removed)
      if (inObj1 && !inObj2) {
        const item: JsonDiffItem = {
          key,
          type: "removed",
          value1,
          path: keyPath,
          isArrayItem: containerType === "array",
        };
        cache.set(cacheKey, item);
        results.push(item);
        continue;
      }

      // Both are objects or arrays, so compare recursively
      if (
        typeof value1 === "object" &&
        value1 !== null &&
        typeof value2 === "object" &&
        value2 !== null
      ) {
        // Special case for arrays
        if (Array.isArray(value1) !== Array.isArray(value2)) {
          const item: JsonDiffItem = {
            key,
            type: "changed",
            value1,
            value2,
            path: keyPath,
          };
          cache.set(cacheKey, item);
          results.push(item);
          continue;
        }

        // Recursively compare objects
        const nextContainerType = getJsonContainerType(
          (value1 ?? value2) as JsonRootValue
        );
        const v1 = value1 as JsonRootValue;
        const v2 = value2 as JsonRootValue;
        const children = compareContainers(v1, v2, keyPath, nextContainerType);

        // Only mark as changed if there are actual differences
        const hasChanges = children.some((child) => child.type !== "unchanged");

        const item: JsonDiffItem = {
          key,
          type: hasChanges ? "changed" : "unchanged",
          value1,
          value2,
          children,
          path: keyPath,
          isArrayItem: containerType === "array",
        };
        cache.set(cacheKey, item);
        results.push(item);
        continue;
      }

      // Compare primitive values
      const val1Str = JSON.stringify(value1);
      const val2Str = JSON.stringify(value2);

      if (val1Str !== val2Str) {
        // Values are different
        const item: JsonDiffItem = {
          key,
          type: "changed",
          value1,
          value2,
          path: keyPath,
          isArrayItem: containerType === "array",
        };
        cache.set(cacheKey, item);
        results.push(item);
      } else {
        // Values are the same
        const item: JsonDiffItem = {
          key,
          type: "unchanged",
          value1,
          path: keyPath,
          isArrayItem: containerType === "array",
        };
        cache.set(cacheKey, item);
        results.push(item);
      }
    }

    return results;
  };

  return {
    items: compareContainers(json1, json2, [], leftRootType),
    leftRootType,
    rightRootType,
  };
};

/**
 * Backward-compatible object-only compare helper.
 */
export const compareJson = (
  json1: Record<string, unknown> | null,
  json2: Record<string, unknown> | null
): JsonDiffItem[] => {
  return compareJsonDocuments(
    (json1 ?? {}) as JsonRootValue,
    (json2 ?? {}) as JsonRootValue
  ).items;
};

const getEmptyContainer = (type: JsonContainerType): JsonRootValue => {
  return type === "array" ? [] : {};
};

const getJsonContainerType = (value: JsonRootValue): JsonContainerType => {
  return Array.isArray(value) ? "array" : "object";
};

const getArrayKeys = (left: JsonArray, right: JsonArray): string[] => {
  const maxLength = Math.max(left.length, right.length);
  return Array.from({ length: maxLength }, (_, index) => String(index));
};

const buildJsonValidationError = (
  jsonString: string,
  error: unknown
): JsonValidationError => {
  const message =
    error instanceof Error ? error.message : "Invalid JSON format";
  const parsedPosition = /position (\d+)(?: \(line (\d+) column (\d+)\))?/i.exec(
    message
  );
  const positionFromMessage = parsedPosition
    ? Number(parsedPosition[1])
    : message.toLowerCase().includes("end of json input")
    ? jsonString.length
    : null;
  const safeIndex = clampIndex(positionFromMessage ?? 0, jsonString.length);
  const { line, column } = getLineColumnFromIndex(jsonString, safeIndex);

  return {
    message,
    index: safeIndex,
    line: parsedPosition?.[2] ? Number(parsedPosition[2]) : line,
    column: parsedPosition?.[3] ? Number(parsedPosition[3]) : column,
    endIndex: Math.min(jsonString.length, safeIndex + 1),
    endLine: parsedPosition?.[2] ? Number(parsedPosition[2]) : line,
    endColumn: parsedPosition?.[3]
      ? Number(parsedPosition[3]) + 1
      : column + 1,
  };
};

const clampIndex = (value: number, max: number) => {
  return Math.max(0, Math.min(value, max));
};

const getLineColumnFromIndex = (source: string, index: number) => {
  let line = 1;
  let column = 1;

  for (let currentIndex = 0; currentIndex < index; currentIndex += 1) {
    if (source[currentIndex] === "\n") {
      line += 1;
      column = 1;
      continue;
    }

    column += 1;
  }

  return { line, column };
};

/**
 * Get sample JSON data for demonstration
 * @deprecated Use getSampleJsonByType instead
 */
export const getSampleJson = (whichSide: "left" | "right"): string => {
  return getSampleJsonByType("productExample", whichSide);
};

/**
 * Get sample JSON data by sample type
 */
export const getSampleJsonByType = (
  sampleType: SampleType,
  whichSide: "left" | "right"
): string => {
  // 1. Identical JSON objects
  const identical = {
    id: "1001",
    name: "Identical Object",
    timestamp: "2023-10-15T10:30:00Z",
    status: "active",
    meta: {
      version: "1.0.0",
      author: "JSONtapose",
    },
  };

  // 2. Same content but different field order
  const sameContentDifferentOrder = {
    left: {
      status: "completed",
      id: "1002",
      meta: {
        author: "JSONtapose",
        version: "1.0.0",
      },
      timestamp: "2023-10-15T10:30:00Z",
      name: "Different Order",
    },
    right: {
      id: "1002",
      name: "Different Order",
      timestamp: "2023-10-15T10:30:00Z",
      status: "completed",
      meta: {
        version: "1.0.0",
        author: "JSONtapose",
      },
    },
  };

  // 3. Some field values are different
  const differentValues = {
    left: {
      id: "1003",
      name: "Changed Values",
      timestamp: "2023-10-15T10:30:00Z",
      status: "pending",
      count: 42,
      tags: ["json", "comparison", "demo"],
      meta: {
        version: "1.0.0",
        author: "JSONtapose",
        priority: "medium",
      },
    },
    right: {
      id: "1003",
      name: "Changed Values",
      timestamp: "2023-11-20T14:45:30Z", // Changed
      status: "completed", // Changed
      count: 57, // Changed
      tags: ["json", "comparison", "example"], // Changed one item
      meta: {
        version: "1.1.0", // Changed
        author: "JSONtapose",
        priority: "high", // Changed
      },
    },
  };

  // 4. Different structure
  const differentStructure = {
    left: {
      id: "1004",
      name: "Different Structure",
      contact: {
        email: "info@example.com",
        phone: "123-456-7890",
      },
      items: [
        { id: 1, name: "Item 1", price: 9.99 },
        { id: 2, name: "Item 2", price: 19.99 },
      ],
      settings: {
        notifications: true,
        theme: "dark",
      },
    },
    right: {
      id: "1004",
      name: "Different Structure",
      contact: {
        email: "info@example.com",
        address: "123 Main St", // Added field
        // phone removed
      },
      items: [
        { id: 1, name: "Item 1", price: 9.99 },
        { id: 2, name: "Item 2", price: 19.99 },
        { id: 3, name: "Item 3", price: 29.99 }, // Added item
      ],
      // settings object removed
      preferences: {
        // New object with different structure
        darkMode: true,
        fontSize: "medium",
      },
    },
  };

  // Product example (existing sample)
  const productExample = {
    left: {
      name: "Product A",
      price: 19.99,
      inStock: true,
      categories: ["electronics", "gadgets"],
      details: {
        weight: "12oz",
        dimensions: {
          width: 10,
          height: 5,
        },
      },
      tags: ["new", "featured"],
    },
    right: {
      name: "Product A",
      price: 24.99,
      inStock: true,
      categories: ["electronics", "accessories"],
      details: {
        weight: "12oz",
        dimensions: {
          width: 10,
          height: 5,
          depth: 2,
        },
      },
      rating: 4.5,
    },
  };

  // Return the requested sample
  switch (sampleType) {
    case "identical":
      return JSON.stringify(identical, null, 2);
    case "sameContentDifferentOrder":
      return JSON.stringify(
        whichSide === "left"
          ? sameContentDifferentOrder.left
          : sameContentDifferentOrder.right,
        null,
        2
      );
    case "differentValues":
      return JSON.stringify(
        whichSide === "left" ? differentValues.left : differentValues.right,
        null,
        2
      );
    case "differentStructure":
      return JSON.stringify(
        whichSide === "left"
          ? differentStructure.left
          : differentStructure.right,
        null,
        2
      );
    case "productExample":
    default:
      return JSON.stringify(
        whichSide === "left" ? productExample.left : productExample.right,
        null,
        2
      );
  }
};
