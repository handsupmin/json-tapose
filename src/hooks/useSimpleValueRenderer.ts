/**
 * Hook for simple value rendering
 */
export const useSimpleValueRenderer = () => {
  // Function to render simple values (string, number, boolean, etc.)
  const renderSimpleValue = (value: unknown): string => {
    if (value === undefined) return "";
    if (value === null) return "null";

    if (typeof value === "string") return `"${value}"`;
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
