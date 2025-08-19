import { useContext } from "react";
import { YamlCompareContext } from "../contexts/YamlCompareContextInstance";
import type { YamlCompareContextType } from "../types/yamlContextTypes";

export const useYamlCompare = (): YamlCompareContextType => {
  const context = useContext(YamlCompareContext);
  if (context === undefined) {
    throw new Error("useYamlCompare must be used within a YamlCompareProvider");
  }
  return context;
};
