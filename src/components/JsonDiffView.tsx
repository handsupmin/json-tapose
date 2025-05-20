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
  contentHeight: string;
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
  contentHeight,
}) => (
  <div className="border border-base-300 rounded-lg overflow-hidden flex flex-col">
    <div className="bg-base-200 px-2 py-1 font-semibold border-b border-base-300">
      {title}
    </div>
    <div className="w-full font-mono text-sm" style={{ height: contentHeight }}>
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

// Special component for when JSONs are identical - displayed as overlay
const JsonSameMessage = ({ onShowResult }: { onShowResult: () => void }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-base-100/60 backdrop-blur-sm z-10">
    <div className="bg-success/20 text-success p-5 rounded-lg text-center shadow-lg border border-success/30 transform scale-110 transition-all duration-300">
      <div className="text-4xl mb-2">✨ JSONsame ✨</div>
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

const JsonDiffView: React.FC<JsonDiffViewProps> = ({ diffItems }) => {
  const [showOnlyDiff, setShowOnlyDiff] = useState<boolean>(true);
  const [contextLines, setContextLines] = useState<number>(
    DEFAULT_CONTEXT_LINES
  );
  // State to track if we should show results even when identical
  const [showResultsWhenIdentical, setShowResultsWhenIdentical] =
    useState<boolean>(false);

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

  // Check if two JSONs are exactly the same
  const isExactlySame = useMemo(() => {
    // Check if all diffItems are of type 'unchanged'
    return (
      diffItems.length > 0 &&
      diffItems.every((item) => item.type === "unchanged")
    );
  }, [diffItems]);

  // Calculate panel height based on content
  const panelHeight = useMemo(() => {
    // Always use the maximum height (DIFF_PANEL_HEIGHT)
    // We're not calculating a dynamic height based on content
    return DIFF_PANEL_HEIGHT;
  }, []);

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

  // Handler for "Show Result" button
  const handleShowResult = useCallback(() => {
    setShowResultsWhenIdentical(true);
  }, []);

  // Reset view when diffItems change
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
    <div className="flex flex-col gap-4 w-full">
      <DiffControls
        showOnlyDiff={showOnlyDiff}
        contextLines={contextLines}
        toggleDiffMode={toggleDiffMode}
        handleContextChange={handleContextChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden relative">
        {isExactlySame && !showResultsWhenIdentical && (
          <JsonSameMessage onShowResult={handleShowResult} />
        )}
        <DiffPanel
          title="Left JSON"
          lines={processedLines.left}
          side="left"
          lineNumbers={processedLines.leftLineNumbers}
          onScroll={handleLeftScroll}
          onExpandableLineClick={handleExpandableLineClick}
          registerRef={leftRefCallback}
          rendererRef={leftRendererRef}
          contentHeight={panelHeight}
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
          contentHeight={panelHeight}
        />
      </div>
    </div>
  );
};

export default memo(JsonDiffView);
