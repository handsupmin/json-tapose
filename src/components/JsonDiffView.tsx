import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDiffProcessor } from "../hooks/useDiffProcessor";
import { useSyncedScroll } from "../hooks/useSyncedScroll";
import type { JsonDiffViewProps } from "../types/diffTypes";
import DiffControls from "./diff/DiffControls";
import DiffLineRenderer from "./diff/DiffLineRenderer";

const JsonDiffView: React.FC<JsonDiffViewProps> = ({ diffItems }) => {
  // Default to diff-only mode for better performance and focused comparison
  const [showOnlyDiff, setShowOnlyDiff] = useState<boolean>(true);
  // Number of context lines
  const [contextLines, setContextLines] = useState<number>(3);

  // Create refs for the diff line renderers
  const leftRendererRef = useRef<{
    scrollTo: (scrollLeft: number, scrollTop: number) => void;
  }>(null);
  const rightRendererRef = useRef<{
    scrollTo: (scrollLeft: number, scrollTop: number) => void;
  }>(null);

  // Use custom hooks for scroll synchronization and diff processing
  const {
    handleLeftScroll,
    handleRightScroll,
    registerLeftComponent,
    registerRightComponent,
  } = useSyncedScroll();

  const { processedLines } = useDiffProcessor(
    diffItems,
    showOnlyDiff,
    contextLines
  );

  // Scroll both panels to top
  const scrollToTop = useCallback(() => {
    // Small delay to ensure DOM has updated with new content
    setTimeout(() => {
      if (leftRendererRef.current) {
        leftRendererRef.current.scrollTo(0, 0);
      }
      if (rightRendererRef.current) {
        rightRendererRef.current.scrollTo(0, 0);
      }
    }, 0);
  }, []);

  // Register component refs after mount
  const leftRefCallback = useCallback(
    (node: any) => {
      if (node) {
        registerLeftComponent(node);
      }
    },
    [registerLeftComponent]
  );

  const rightRefCallback = useCallback(
    (node: any) => {
      if (node) {
        registerRightComponent(node);
      }
    },
    [registerRightComponent]
  );

  // Toggle showing only differences
  const toggleDiffMode = useCallback(() => {
    setShowOnlyDiff(!showOnlyDiff);
    // Scroll to top when changing modes
    scrollToTop();
  }, [showOnlyDiff, scrollToTop]);

  // Handle expandable line click - switches to "show all" mode
  const handleExpandableLineClick = useCallback(() => {
    // If already in show all mode, do nothing
    if (!showOnlyDiff) return;

    // Switch to show all mode
    setShowOnlyDiff(false);
    // Scroll to top when expanding
    scrollToTop();
  }, [showOnlyDiff, scrollToTop]);

  // Handle context lines change
  const handleContextChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setContextLines(Number(e.target.value));
      // Scroll to top when changing context lines
      scrollToTop();
    },
    [scrollToTop]
  );

  // Use effect to scroll to top when processed lines change
  useEffect(() => {
    if (processedLines.left.length > 0 || processedLines.right.length > 0) {
      scrollToTop();
    }
  }, [diffItems, scrollToTop]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <DiffControls
        showOnlyDiff={showOnlyDiff}
        contextLines={contextLines}
        toggleDiffMode={toggleDiffMode}
        handleContextChange={handleContextChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden">
        {/* Left Panel */}
        <div className="border border-base-300 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-base-200 px-2 py-1 font-semibold border-b border-base-300">
            Left JSON
          </div>
          <div className="h-[70vh] w-full font-mono text-sm">
            <DiffLineRenderer
              ref={(node: any) => {
                leftRendererRef.current = node;
                leftRefCallback(node);
              }}
              lines={processedLines.left}
              side="left"
              onScroll={handleLeftScroll}
              lineNumbers={processedLines.leftLineNumbers}
              onExpandableLineClick={handleExpandableLineClick}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="border border-base-300 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-base-200 px-2 py-1 font-semibold border-b border-base-300">
            Right JSON
          </div>
          <div className="h-[70vh] w-full font-mono text-sm">
            <DiffLineRenderer
              ref={(node: any) => {
                rightRendererRef.current = node;
                rightRefCallback(node);
              }}
              lines={processedLines.right}
              side="right"
              onScroll={handleRightScroll}
              lineNumbers={processedLines.rightLineNumbers}
              onExpandableLineClick={handleExpandableLineClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the component for performance optimization
export default memo(JsonDiffView);
