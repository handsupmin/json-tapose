import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type { JsonDiffItem, SampleType } from "./jsonUtils";
import { compareJson } from "./jsonUtils";

/**
 * Validate if a string is valid YAML
 */
export const isValidYaml = (yamlString: string): boolean => {
  try {
    parseYaml(yamlString);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format YAML string with indentation
 */
export const formatYaml = (yamlString: string): string => {
  try {
    const parsed = parseYaml(yamlString);
    return stringifyYaml(parsed);
  } catch {
    return yamlString;
  }
};

/**
 * Compare two YAML object values by leveraging the existing JSON diff implementation.
 * Note: Both values must be root-level objects (non-null, non-array).
 */
export const compareYamlObjects = (
  yamlObj1: Record<string, unknown> | null,
  yamlObj2: Record<string, unknown> | null
): JsonDiffItem[] => {
  return compareJson(yamlObj1, yamlObj2);
};

/**
 * Sample labels for YAML mode
 */
export const yamlSampleOptions = [
  { value: "identical", label: "1. Identical YAML" },
  {
    value: "sameContentDifferentOrder",
    label: "2. Same Content, Different Field Order",
  },
  { value: "differentValues", label: "3. Different Field Values" },
  { value: "differentStructure", label: "4. Different Structure" },
  { value: "productExample", label: "5. Product Example" },
];

/**
 * Get sample YAML data by sample type
 */
export const getSampleYamlByType = (
  sampleType: SampleType,
  whichSide: "left" | "right"
): string => {
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
      timestamp: "2023-11-20T14:45:30Z",
      status: "completed",
      count: 57,
      tags: ["json", "comparison", "example"],
      meta: {
        version: "1.1.0",
        author: "JSONtapose",
        priority: "high",
      },
    },
  };

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
        address: "123 Main St",
      },
      items: [
        { id: 1, name: "Item 1", price: 9.99 },
        { id: 2, name: "Item 2", price: 19.99 },
        { id: 3, name: "Item 3", price: 29.99 },
      ],
      preferences: {
        darkMode: true,
        fontSize: "medium",
      },
    },
  };

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

  switch (sampleType) {
    case "identical":
      return stringifyYaml(identical);
    case "sameContentDifferentOrder":
      return stringifyYaml(
        whichSide === "left"
          ? sameContentDifferentOrder.left
          : sameContentDifferentOrder.right
      );
    case "differentValues":
      return stringifyYaml(
        whichSide === "left" ? differentValues.left : differentValues.right
      );
    case "differentStructure":
      return stringifyYaml(
        whichSide === "left"
          ? differentStructure.left
          : differentStructure.right
      );
    case "productExample":
    default:
      return stringifyYaml(
        whichSide === "left" ? productExample.left : productExample.right
      );
  }
};
