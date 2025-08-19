import React, { useCallback, useState } from "react";
import { useFormatMode } from "../contexts/FormatModeContext";
import { useJsonTree } from "../hooks/useJsonTree";
import { useYamlTree } from "../hooks/useYamlTree";
import JsonInputPanel from "./JsonInputPanel";
import JsonTreeMaker from "./JsonTreeMaker";
import SampleSelector from "./SampleSelector";
import YamlTreeMaker from "./YamlTreeMaker";

/**
 * Component for visualizing JSON data as an interactive tree
 *
 * Features:
 * - JSON input with validation
 * - Tree structure visualization
 * - Sample data selection
 * - JSON formatting
 * - Error handling
 *
 * The component:
 * - Manages JSON input state
 * - Handles user interactions
 * - Provides visual feedback
 * - Maintains consistent layout
 */
const JsonTreeViewer: React.FC = () => {
  const [expandAll, setExpandAll] = useState<boolean | undefined>(undefined);
  const { mode } = useFormatMode();
  // Hook for managing JSON tree state and operations
  const jsonTree = useJsonTree();
  const yamlTree = useYamlTree();
  const {
    jsonInput,
    error,
    selectedSample,
    shouldShowTree,
    handleInputChange,
    handleInputBlur,
    handleFormat,
    handleClear,
    handleSampleSelect,
    handleErrorDismiss,
  } = mode === "json" ? jsonTree : yamlTree;

  const handleExpandAll = useCallback(() => {
    setExpandAll(true);
  }, []);

  const handleCollapseAll = useCallback(() => {
    setExpandAll(false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar with sample selector and buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <SampleSelector
          selectedSample={selectedSample}
          onSelect={handleSampleSelect}
          mode="single"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={handleClear} className="btn btn-accent btn-sm">
            Clear
          </button>
        </div>
      </div>

      {/* Two-column layout for input and tree view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON input panel with validation */}
        <div className="flex flex-col">
          <JsonInputPanel
            id="json-tree-input"
            label={mode === "json" ? "JSON Input" : "YAML Input"}
            value={jsonInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFormat={handleFormat}
            error={error}
            onErrorDismiss={handleErrorDismiss}
            placeholder={
              mode === "json"
                ? '{"example": "Paste your JSON here"}'
                : "example: |\n  Paste your YAML here\n"
            }
          />
        </div>

        {/* Tree visualization with empty state */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">
              {mode === "json" ? "Tree Structure" : "YAML Tree"}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handleExpandAll} className="btn btn-sm">
                Expand All
              </button>
              <button onClick={handleCollapseAll} className="btn btn-sm">
                Collapse All
              </button>
            </div>
          </div>
          <div className="flex-1">
            {shouldShowTree ? (
              mode === "json" ? (
                <JsonTreeMaker
                  jsonData={jsonInput}
                  error={error || undefined}
                  expandAll={expandAll}
                />
              ) : (
                <YamlTreeMaker
                  yamlData={jsonInput}
                  error={error || undefined}
                  expandAll={expandAll}
                />
              )
            ) : (
              <div className="bg-base-100 rounded-lg p-8 border border-base-300">
                <div className="text-center text-base-content/60">
                  <div className="text-4xl mb-4">🌳</div>
                  <p>
                    {error ||
                      (mode === "json"
                        ? "Enter valid JSON to treefy"
                        : "Enter valid YAML to treefy")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonTreeViewer;
