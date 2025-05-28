import React, { useCallback, useState } from "react";
import { useJsonTree } from "../hooks/useJsonTree";
import JsonInputPanel from "./JsonInputPanel";
import JsonTreeMaker from "./JsonTreeMaker";
import SampleSelector from "./SampleSelector";

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
  // Hook for managing JSON tree state and operations
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
  } = useJsonTree();

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
            label="JSON Input"
            value={jsonInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFormat={handleFormat}
            error={error}
            onErrorDismiss={handleErrorDismiss}
          />
        </div>

        {/* Tree visualization with empty state */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Tree Structure</h2>
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
              <JsonTreeMaker
                jsonData={jsonInput}
                error={error || undefined}
                expandAll={expandAll}
              />
            ) : (
              <div className="bg-base-100 rounded-lg p-8 border border-base-300">
                <div className="text-center text-base-content/60">
                  <div className="text-4xl mb-4">🌳</div>
                  <p>{error || "Enter valid JSON to treefy"}</p>
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
