import { useContext } from "react";
import { JsonCompareContext } from "../contexts/JsonCompareContextInstance";
import type { JsonCompareContextType } from "../types/contextTypes";

/**
 * Custom hook for using the JSON compare context
 * Extracted to a separate file to fix the Fast Refresh warning
 */
export const useJsonCompare = (): JsonCompareContextType => {
  const context = useContext(JsonCompareContext);
  if (context === undefined) {
    throw new Error("useJsonCompare must be used within a JsonCompareProvider");
  }
  return context;
};
