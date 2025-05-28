type DiffType = "added" | "removed" | "unchanged" | "changed";

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
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format JSON string with indentation
 */
export const formatJson = (jsonString: string): string => {
  try {
    const parsedJson = JSON.parse(jsonString);
    return JSON.stringify(parsedJson, null, 2);
  } catch {
    return jsonString;
  }
};

/**
 * Compare two JSON objects and generate a difference report
 *
 * Performance optimizations:
 * - Uses a cache to avoid re-comparing the same paths
 * - Efficiently collects keys using Set
 * - Early returns for simple cases
 * - Recursive comparison only for nested objects
 */
export const compareJson = (
  json1: Record<string, unknown> | null,
  json2: Record<string, unknown> | null
): JsonDiffItem[] => {
  // Cache for memoizing comparison results to avoid redundant work
  const cache = new Map<string, JsonDiffItem>();

  // Internal function to perform the actual comparison
  const compareObjects = (
    obj1: Record<string, unknown> | null,
    obj2: Record<string, unknown> | null,
    currentPath: string[] = []
  ): JsonDiffItem[] => {
    const results: JsonDiffItem[] = [];

    if (!obj1 && !obj2) return results;

    // Handle null as empty objects
    const safeObj1 = obj1 || {};
    const safeObj2 = obj2 || {};

    // Efficiently collect all keys (using Set)
    const allKeys = new Set([
      ...Object.keys(safeObj1),
      ...Object.keys(safeObj2),
    ]);

    // Process each key
    for (const key of allKeys) {
      // Check if key exists in each object
      const inObj1 = key in safeObj1;
      const inObj2 = key in safeObj2;

      // Calculate path for current key
      const keyPath = [...currentPath, key];
      const cacheKey = keyPath.join(".");

      // Check cache for result
      if (cache.has(cacheKey)) {
        results.push(cache.get(cacheKey)!);
        continue;
      }

      const value1 = inObj1 ? safeObj1[key] : undefined;
      const value2 = inObj2 ? safeObj2[key] : undefined;

      // Key exists only in the second object (added)
      if (!inObj1 && inObj2) {
        const item: JsonDiffItem = {
          key,
          type: "added",
          value2,
          path: keyPath,
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
        const v1 = value1 as Record<string, unknown>;
        const v2 = value2 as Record<string, unknown>;
        const children = compareObjects(v1, v2, keyPath);

        // Only mark as changed if there are actual differences
        const hasChanges = children.some((child) => child.type !== "unchanged");

        const item: JsonDiffItem = {
          key,
          type: hasChanges ? "changed" : "unchanged",
          value1,
          value2,
          children,
          path: keyPath,
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
        };
        cache.set(cacheKey, item);
        results.push(item);
      }
    }

    return results;
  };

  return compareObjects(json1, json2);
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
