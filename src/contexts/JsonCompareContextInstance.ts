import { createContext } from "react";
import type { JsonCompareContextType } from "../types/contextTypes";

// Create context in a separate file to avoid Fast Refresh warnings
export const JsonCompareContext = createContext<
  JsonCompareContextType | undefined
>(undefined);
