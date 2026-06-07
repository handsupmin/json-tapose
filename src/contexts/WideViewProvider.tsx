import React, { useEffect, useMemo, useState } from "react";
import {
  WIDE_VIEW_STORAGE_KEY,
  WideViewContext,
} from "./WideViewContext";

const getInitialWideView = (): boolean => {
  return localStorage.getItem(WIDE_VIEW_STORAGE_KEY) === "true";
};

export const WideViewProvider: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const [isWideView, setIsWideView] = useState<boolean>(getInitialWideView);

  useEffect(() => {
    localStorage.setItem(WIDE_VIEW_STORAGE_KEY, String(isWideView));

    if (isWideView) {
      document.documentElement.dataset.wideView = "true";
      return;
    }

    delete document.documentElement.dataset.wideView;
  }, [isWideView]);

  const value = useMemo(
    () => ({ isWideView, setIsWideView }),
    [isWideView]
  );

  return (
    <WideViewContext.Provider value={value}>
      {children}
    </WideViewContext.Provider>
  );
};
