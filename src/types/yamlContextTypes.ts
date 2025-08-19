// Types for YAML comparison context state and actions
// Mirrors the JSON context types but dedicated for YAML mode to avoid coupling
import type { JsonDiffItem } from "../utils/jsonUtils";

export interface YamlCompareState {
  leftYaml: string;
  rightYaml: string;
  diffResult: JsonDiffItem[] | null;
  error: string | null;
  loading: boolean;
  leftYamlError: string | null;
  rightYamlError: string | null;
}

export interface YamlCompareActions {
  setLeftYaml: (yaml: string) => void;
  setRightYaml: (yaml: string) => void;
  validateYaml: (side: "left" | "right", value: string) => void;
  compareYaml: () => void;
  formatYaml: (side: "left" | "right") => void;
  clearAll: () => void;
  loadSampleData: (leftYaml: string, rightYaml: string) => void;
}

export interface YamlCompareContextType
  extends YamlCompareState,
    YamlCompareActions {}
