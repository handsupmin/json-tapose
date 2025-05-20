import type { JsonDiffItem } from "../utils/jsonUtils";

// Context state type
export interface JsonCompareState {
  leftJson: string;
  rightJson: string;
  diffResult: JsonDiffItem[] | null;
  error: string | null;
  loading: boolean;
  leftJsonError: string | null;
  rightJsonError: string | null;
}

// Context actions type
export interface JsonCompareActions {
  setLeftJson: (json: string) => void;
  setRightJson: (json: string) => void;
  validateJson: (side: "left" | "right", value: string) => void;
  compareJson: () => void;
  formatJson: (side: "left" | "right") => void;
  clearAll: () => void;
  loadSampleData: (leftJson: string, rightJson: string) => void;
}

// Combined context type
export interface JsonCompareContextType
  extends JsonCompareState,
    JsonCompareActions {}
