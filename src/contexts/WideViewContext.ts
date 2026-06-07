import { createContext } from "react";

export const WIDE_VIEW_STORAGE_KEY = "wideViewMode";

export interface WideViewContextType {
  readonly isWideView: boolean;
  readonly setIsWideView: (isWideView: boolean) => void;
}

export const WideViewContext = createContext<WideViewContextType | undefined>(
  undefined
);
