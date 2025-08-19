import React from "react";
import { useFormatMode } from "../contexts/FormatModeContext";
import { JsonCompareProvider } from "../contexts/JsonCompareContext";
import { YamlCompareProvider } from "../contexts/YamlCompareContext";
import JsonComparer from "./JsonComparer";
import YamlComparer from "./YamlComparer";

const ComparePage: React.FC = () => {
  const { mode } = useFormatMode();

  return (
    <div className="flex flex-col gap-4">
      {mode === "json" ? (
        <JsonCompareProvider>
          <JsonComparer />
        </JsonCompareProvider>
      ) : (
        <YamlCompareProvider>
          <YamlComparer />
        </YamlCompareProvider>
      )}
    </div>
  );
};

export default ComparePage;
