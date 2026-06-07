import { useContext } from "react";
import { WideViewContext, type WideViewContextType } from "../contexts/WideViewContext";

export const useWideView = (): WideViewContextType => {
  const context = useContext(WideViewContext);
  if (!context) {
    throw new Error("useWideView must be used within WideViewProvider");
  }

  return context;
};
