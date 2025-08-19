import React, { createContext, useContext, useMemo, useState } from "react";

export type FormatMode = "json" | "yaml";

interface FormatModeContextType {
  mode: FormatMode;
  setMode: (mode: FormatMode) => void;
}

const FormatModeContext = createContext<FormatModeContextType | undefined>(
  undefined
);

export const FormatModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<FormatMode>("json");

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <FormatModeContext.Provider value={value}>
      {children}
    </FormatModeContext.Provider>
  );
};

export const useFormatMode = (): FormatModeContextType => {
  const ctx = useContext(FormatModeContext);
  if (!ctx)
    throw new Error("useFormatMode must be used within FormatModeProvider");
  return ctx;
};
