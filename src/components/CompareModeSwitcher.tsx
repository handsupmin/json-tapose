import React from "react";

interface CompareModeSwitcherProps {
  mode: "json" | "yaml";
  onChange: (mode: "json" | "yaml") => void;
}

const CompareModeSwitcher: React.FC<CompareModeSwitcherProps> = ({
  mode,
  onChange,
}) => {
  return (
    <div className="join">
      <button
        className={`btn btn-sm join-item ${
          mode === "json" ? "btn-primary" : ""
        }`}
        onClick={() => onChange("json")}
      >
        JSON
      </button>
      <button
        className={`btn btn-sm join-item ${
          mode === "yaml" ? "btn-primary" : ""
        }`}
        onClick={() => onChange("yaml")}
      >
        YAML
      </button>
    </div>
  );
};

export default CompareModeSwitcher;
