import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDiffProcessor } from "../hooks/useDiffProcessor";
import { useSyncedScroll } from "../hooks/useSyncedScroll";
import type { DiffLine, JsonDiffViewProps } from "../types/diffTypes";
import DiffControls from "./diff/DiffControls";
import DiffLineRenderer from "./diff/DiffLineRenderer";

// Named constants
const DEFAULT_CONTEXT_LINES = 3;
const SCROLL_TIMEOUT_MS = 0;
const DIFF_PANEL_HEIGHT = "70vh";

// Define types for the DiffLineRenderer component
interface DiffLineRendererInstance {
  scrollTo: (scrollLeft: number, scrollTop: number) => void;
}

// DiffPanel component for reusability
type DiffPanelProps = {
  title: string;
  lines: DiffLine[];
  side: "left" | "right";
  lineNumbers: Array<number>;
  onScroll: (scrollTop: number, scrollLeft: number) => void;
  onExpandableLineClick: () => void;
  registerRef: (node: HTMLDivElement | null) => void;
  rendererRef: React.MutableRefObject<DiffLineRendererInstance | null>;
};

const DiffPanel: React.FC<DiffPanelProps> = ({
  title,
  lines,
  side,
  lineNumbers,
  onScroll,
  onExpandableLineClick,
  registerRef,
  rendererRef,
}) => (
  <div className="border border-base-300 rounded-lg overflow-hidden flex flex-col">
    <div className="bg-base-200 px-2 py-1 font-semibold border-b border-base-300">
      {title}
    </div>
    <div
      className="w-full font-mono text-sm"
      style={{ height: DIFF_PANEL_HEIGHT }}
    >
      <DiffLineRenderer
        ref={(node: DiffLineRendererInstance | null) => {
          rendererRef.current = node;
          registerRef(node as unknown as HTMLDivElement);
        }}
        lines={lines}
        side={side}
        onScroll={onScroll}
        lineNumbers={lineNumbers}
        onExpandableLineClick={() => onExpandableLineClick()}
      />
    </div>
  </div>
);

const JsonDiffView: React.FC<JsonDiffViewProps> = ({ diffItems }) => {
  const [showOnlyDiff, setShowOnlyDiff] = useState<boolean>(true);
  const [contextLines, setContextLines] = useState<number>(
    DEFAULT_CONTEXT_LINES
  );

  const leftRendererRef = useRef<DiffLineRendererInstance | null>(null);
  const rightRendererRef = useRef<DiffLineRendererInstance | null>(null);

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

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      const shouldScrollLeft = leftRendererRef.current !== null;
      const shouldScrollRight = rightRendererRef.current !== null;

      if (shouldScrollLeft && leftRendererRef.current) {
        leftRendererRef.current.scrollTo(0, 0);
      }

      if (shouldScrollRight && rightRendererRef.current) {
        rightRendererRef.current.scrollTo(0, 0);
      }
    }, SCROLL_TIMEOUT_MS);
  }, []);

  const leftRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        registerLeftComponent(node);
      }
    },
    [registerLeftComponent]
  );

  const rightRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        registerRightComponent(node);
      }
    },
    [registerRightComponent]
  );

  const toggleDiffMode = useCallback(() => {
    setShowOnlyDiff((prev) => !prev);
    scrollToTop();
  }, [scrollToTop]);

  const handleExpandableLineClick = useCallback(() => {
    const isAlreadyShowingAll = !showOnlyDiff;
    if (isAlreadyShowingAll) return;

    setShowOnlyDiff(false);
    scrollToTop();
  }, [showOnlyDiff, scrollToTop]);

  const handleContextChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newContextLines = Number(e.target.value);
      setContextLines(newContextLines);
      scrollToTop();
    },
    [scrollToTop]
  );

  useEffect(() => {
    const hasProcessedLines =
      processedLines.left.length > 0 || processedLines.right.length > 0;
    if (hasProcessedLines) {
      scrollToTop();
    }
  }, [
    diffItems,
    scrollToTop,
    processedLines.left.length,
    processedLines.right.length,
  ]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <DiffControls
        showOnlyDiff={showOnlyDiff}
        contextLines={contextLines}
        toggleDiffMode={toggleDiffMode}
        handleContextChange={handleContextChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden">
        <DiffPanel
          title="Left JSON"
          lines={processedLines.left}
          side="left"
          lineNumbers={processedLines.leftLineNumbers}
          onScroll={handleLeftScroll}
          onExpandableLineClick={handleExpandableLineClick}
          registerRef={leftRefCallback}
          rendererRef={leftRendererRef}
        />

        <DiffPanel
          title="Right JSON"
          lines={processedLines.right}
          side="right"
          lineNumbers={processedLines.rightLineNumbers}
          onScroll={handleRightScroll}
          onExpandableLineClick={handleExpandableLineClick}
          registerRef={rightRefCallback}
          rendererRef={rightRendererRef}
        />
      </div>
    </div>
  );
};

export default memo(JsonDiffView);
