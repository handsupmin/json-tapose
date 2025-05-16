type DiffType = "added" | "removed" | "unchanged" | "changed";

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
 */
export const compareJson = (
  json1: Record<string, unknown> | null,
  json2: Record<string, unknown> | null
): JsonDiffItem[] => {
  const results: JsonDiffItem[] = [];

  // Get all keys from both objects
  const allKeys = new Set([
    ...Object.keys(json1 || {}),
    ...Object.keys(json2 || {}),
  ]);

  // Compare each key
  allKeys.forEach((key) => {
    const value1 = json1?.[key];
    const value2 = json2?.[key];

    // Check if key exists in both objects
    const inObj1 = json1 && key in json1;
    const inObj2 = json2 && key in json2;

    // Key exists only in the second object (added)
    if (!inObj1 && inObj2) {
      results.push({
        key,
        type: "added",
        value2,
        path: [key],
      });
      return;
    }

    // Key exists only in the first object (removed)
    if (inObj1 && !inObj2) {
      results.push({
        key,
        type: "removed",
        value1,
        path: [key],
      });
      return;
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
        // One is array, one is object - treat as changed
        results.push({
          key,
          type: "changed",
          value1,
          value2,
          path: [key],
        });
        return;
      }

      const v1 = value1 as Record<string, unknown>;
      const v2 = value2 as Record<string, unknown>;
      const children = compareJson(v1, v2);

      // Only mark as changed if there are actual differences
      const hasChanges = children.some((child) => child.type !== "unchanged");

      results.push({
        key,
        type: hasChanges ? "changed" : "unchanged",
        value1,
        value2,
        children: children, // Include all children to properly show differences
        path: [key],
      });
      return;
    }

    // Compare primitive values
    const val1Str = JSON.stringify(value1);
    const val2Str = JSON.stringify(value2);

    if (val1Str !== val2Str) {
      // Values are different
      results.push({
        key,
        type: "changed",
        value1,
        value2,
        path: [key],
      });
    } else {
      // Values are the same
      results.push({
        key,
        type: "unchanged",
        value1,
        path: [key],
      });
    }
  });

  return results;
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
