import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDiffProcessor } from "../hooks/useDiffProcessor";
import { useSyncedScroll } from "../hooks/useSyncedScroll";
import type { DiffLine, JsonDiffViewProps } from "../types/diffTypes";
import DiffControls from "./diff/DiffControls";
import DiffLineRenderer from "./diff/DiffLineRenderer";

/**
 * Constants for diff view configuration
 * These values control the behavior and appearance of the diff view
 */
const DEFAULT_CONTEXT_LINES = 3;
const SCROLL_TIMEOUT_MS = 0;
const DIFF_PANEL_MAX_HEIGHT = "70vh";

/**
 * Type definition for the DiffLineRenderer component instance
 * Used to control scrolling behavior of the diff panels
 */
interface DiffLineRendererInstance {
  scrollTo: (scrollLeft: number, scrollTop: number) => void;
}

/**
 * Props for the DiffPanel component
 * Defines the structure and behavior of each diff panel
 */
type DiffPanelProps = {
  title: string;
  lines: DiffLine[];
  side: "left" | "right";
  lineNumbers: Array<number>;
  onScroll: (scrollTop: number, scrollLeft: number) => void;
  onExpandableLineClick: () => void;
  registerRef: (node: HTMLDivElement | null) => void;
  rendererRef: React.MutableRefObject<DiffLineRendererInstance | null>;
  contentMaxHeight: string;
};

/**
 * Reusable component for rendering a single diff panel
 *
 * Features:
 * - Panel title and border
 * - Scrollable content area
 * - Line number display
 * - Synchronized scrolling
 * - Expandable sections
 */
const DiffPanel: React.FC<DiffPanelProps> = ({
  title,
  lines,
  side,
  lineNumbers,
  onScroll,
  onExpandableLineClick,
  registerRef,
  rendererRef,
  contentMaxHeight,
}) => (
  <div className="border border-base-300 rounded-lg overflow-hidden flex flex-col">
    <div className="bg-base-200 px-2 py-1 font-semibold border-b border-base-300">
      {title}
    </div>
    <div
      className="w-full font-mono text-sm max-h-full"
      style={{
        maxHeight: contentMaxHeight,
        height: "auto",
        minHeight: "200px",
      }}
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

/**
 * Overlay component shown when JSONs are identical
 *
 * Features:
 * - Blurred backdrop
 * - Success message
 * - Option to show full comparison
 * - Smooth animation
 */
const JsonSameMessage = ({
  onShowResult,
  mode,
}: {
  onShowResult: () => void;
  mode: "json" | "yaml";
}) => (
  <div className="absolute inset-0 flex items-center justify-center bg-base-100/60 backdrop-blur-sm z-10">
    <div className="bg-success/20 text-success p-5 rounded-lg text-center shadow-lg border border-success/30 transform scale-110 transition-all duration-300">
      <div className="text-4xl mb-2">
        ✨ {mode === "json" ? "JSONsame" : "YAMLsame"} ✨
      </div>
      <div className="text-xl">There's No Diff 🔍</div>
      <button
        onClick={onShowResult}
        className="mt-4 btn btn-sm btn-outline btn-success"
      >
        Show Result
      </button>
    </div>
  </div>
);

/**
 * Main component for rendering JSON diff view
 *
 * Features:
 * - Side-by-side JSON comparison
 * - Synchronized scrolling
 * - Diff-only mode
 * - Context lines control
 * - Expandable sections
 * - Line numbers
 * - Identical JSON detection
 *
 * The component:
 * - Manages diff view state
 * - Handles user interactions
 * - Coordinates panel synchronization
 * - Provides visual feedback
 */
const JsonDiffView: React.FC<JsonDiffViewProps> = ({
  diffItems,
  mode = "json",
}) => {
  // State for diff view configuration
  const [showOnlyDiff, setShowOnlyDiff] = useState<boolean>(true);
  const [contextLines, setContextLines] = useState<number>(
    DEFAULT_CONTEXT_LINES
  );
  const [showResultsWhenIdentical, setShowResultsWhenIdentical] =
    useState<boolean>(false);

  // Refs for controlling panel scrolling
  const leftRendererRef = useRef<DiffLineRendererInstance | null>(null);
  const rightRendererRef = useRef<DiffLineRendererInstance | null>(null);

  // Hook for synchronized scrolling between panels
  const {
    handleLeftScroll,
    handleRightScroll,
    registerLeftComponent,
    registerRightComponent,
  } = useSyncedScroll();

  // Process diff items with current settings
  const { processedLines } = useDiffProcessor(
    diffItems,
    showOnlyDiff,
    contextLines
  );

  // Check if JSONs are identical (all lines unchanged)
  const isExactlySame = useMemo(() => {
    return (
      diffItems.length > 0 &&
      diffItems.every((item) => item.type === "unchanged")
    );
  }, [diffItems]);

  // Use fixed panel height for consistent layout
  const panelMaxHeight = useMemo(() => DIFF_PANEL_MAX_HEIGHT, []);

  // Scroll both panels to top
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

  // Register panel components for scroll synchronization
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

  // Toggle between full view and diff-only mode
  const toggleDiffMode = useCallback(() => {
    setShowOnlyDiff((prev) => !prev);
    scrollToTop();
  }, [scrollToTop]);

  // Handle click on expandable line
  const handleExpandableLineClick = useCallback(() => {
    const isAlreadyShowingAll = !showOnlyDiff;
    if (isAlreadyShowingAll) return;

    setShowOnlyDiff(false);
    scrollToTop();
  }, [showOnlyDiff, scrollToTop]);

  // Update context lines and reset scroll
  const handleContextChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newContextLines = Number(e.target.value);
      setContextLines(newContextLines);
      scrollToTop();
    },
    [scrollToTop]
  );

  // Show full comparison when JSONs are identical
  const handleShowResult = useCallback(() => {
    setShowResultsWhenIdentical(true);
  }, []);

  // Reset view when diff items change
  useEffect(() => {
    setShowResultsWhenIdentical(false);

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
    <div className="flex flex-col gap-4 w-full" translate="no">
      {/* Diff controls for mode and context */}
      <DiffControls
        showOnlyDiff={showOnlyDiff}
        contextLines={contextLines}
        toggleDiffMode={toggleDiffMode}
        handleContextChange={handleContextChange}
      />

      {/* Diff panels with synchronized scrolling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden relative">
        {isExactlySame && !showResultsWhenIdentical && (
          <JsonSameMessage onShowResult={handleShowResult} mode={mode} />
        )}
        <DiffPanel
          title={mode === "json" ? "Left JSON" : "Left YAML"}
          lines={processedLines.left}
          side="left"
          lineNumbers={processedLines.leftLineNumbers}
          onScroll={handleLeftScroll}
          onExpandableLineClick={handleExpandableLineClick}
          registerRef={leftRefCallback}
          rendererRef={leftRendererRef}
          contentMaxHeight={panelMaxHeight}
        />

        <DiffPanel
          title={mode === "json" ? "Right JSON" : "Right YAML"}
          lines={processedLines.right}
          side="right"
          lineNumbers={processedLines.rightLineNumbers}
          onScroll={handleRightScroll}
          onExpandableLineClick={handleExpandableLineClick}
          registerRef={rightRefCallback}
          rendererRef={rightRendererRef}
          contentMaxHeight={panelMaxHeight}
        />
      </div>
    </div>
  );
};

export default memo(JsonDiffView);
