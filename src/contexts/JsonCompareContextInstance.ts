import { createContext } from "react";
import type { JsonCompareContextType } from "../types/contextTypes";

/**
 * Context instance for JSON comparison functionality
 *
 * Created in a separate file to:
 * - Avoid Fast Refresh warnings in React
 * - Maintain clean separation of concerns
 * - Allow for easier testing and mocking
 */
export const JsonCompareContext = createContext<
  JsonCompareContextType | undefined
>(undefined);
