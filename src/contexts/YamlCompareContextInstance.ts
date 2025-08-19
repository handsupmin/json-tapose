import { createContext } from "react";
import type { YamlCompareContextType } from "../types/yamlContextTypes";

export const YamlCompareContext = createContext<
  YamlCompareContextType | undefined
>(undefined);
