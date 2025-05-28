/**
 * Hook for rendering JSON values in a consistent and readable format
 *
 * This hook provides value rendering with special handling for:
 * - String values: Properly escapes special characters for JSON format
 * - Object/Array values: Formats as single-line for better diff readability
 * - Null/Undefined: Consistent representation
 * - Indentation: Configurable indentation for nested structures
 *
 * The string escaping is crucial for:
 * - Maintaining valid JSON syntax
 * - Preserving special characters in the output
 * - Ensuring proper diff comparison
 */
export const useSimpleValueRenderer = () => {
  // Function to render simple values (string, number, boolean, etc.)
  const renderSimpleValue = (value: unknown): string => {
    if (value === undefined) return "";
    if (value === null) return "null";

    if (typeof value === "string") {
      // Handle all common escape characters
      return `"${value
        .replace(/\\/g, "\\\\") // Escape backslash first
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f")
        .replace(/\v/g, "\\v")}"`;
    }
    if (typeof value === "object") {
      // Display objects/arrays without abbreviation
      return JSON.stringify(value, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : line.trim()))
        .join(" ");
    }

    return String(value);
  };

  // Create indentation (2 spaces per level)
  const getIndent = (level: number): string => "  ".repeat(level);

  return { renderSimpleValue, getIndent };
};
