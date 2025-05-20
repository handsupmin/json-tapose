import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DiffLine } from "../../types/diffTypes";

interface DiffLineRendererProps {
  lines: DiffLine[];
  side: "left" | "right";
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  lineNumbers?: number[];
  onExpandableLineClick?: (line: DiffLine, index: number) => void;
}

// Define component with ref forwarding
const DiffLineRenderer = forwardRef<
  { scrollTo: (scrollLeft: number, scrollTop: number) => void },
  DiffLineRendererProps
>(({ lines, side, onScroll, lineNumbers, onExpandableLineClick }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const isInternalScrollRef = useRef(false);

  // Line height for consistency
  const LINE_HEIGHT = 22;

  // Expose scrollTo method to parent components
  useImperativeHandle(ref, () => ({
    scrollTo: (scrollLeft: number, scrollTop: number) => {
      if (!containerRef.current) return;

      isInternalScrollRef.current = true;
      containerRef.current.scrollLeft = scrollLeft;
      containerRef.current.scrollTop = scrollTop;

      // Reset scrolling flag
      requestAnimationFrame(() => {
        isInternalScrollRef.current = false;
      });
    },
  }));

  // Update container width when size changes
  useEffect(() => {
    const updateContainer = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainer();
    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(updateContainer);
    const currentRef = containerRef.current; // Store ref in variable for cleanup

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  // Register scroll event listener
  useEffect(() => {
    // Simple scroll event handler moved inside useEffect
    const handleScroll = () => {
      if (!containerRef.current || isInternalScrollRef.current) return;

      const { scrollTop, scrollLeft } = containerRef.current;

      // Notify parent about scroll position if onScroll callback is provided
      if (onScroll) {
        onScroll(scrollTop, scrollLeft);
      }
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [onScroll]);

  // Calculate CSS class for each line
  const getLineClass = (line: DiffLine) => {
    // Base class including the diff-line class for full width and text-left for alignment
    const baseClass = "px-2 py-0.5 whitespace-pre diff-line text-left";

    // Apply different styles based on line type and side
    switch (line.type) {
      case "added":
        return `${baseClass} ${
          side === "right"
            ? "bg-success/20 text-success"
            : "bg-neutral-focus/10 bg-diagonal"
        }`;
      case "removed":
        return `${baseClass} ${
          side === "left"
            ? "bg-error/20 text-error"
            : "bg-neutral-focus/10 bg-diagonal"
        }`;
      case "changed":
        return `${baseClass} bg-warning/20 text-warning`;
      case "expandable":
        return `${baseClass} bg-base-300 italic cursor-pointer hover:bg-base-200 flex justify-center items-center`;
      case "placeholder":
        return `${baseClass} bg-neutral-focus/10 bg-diagonal`;
      default:
        return baseClass;
    }
  };

  // Ensure the width is at least 100% or wider based on content
  const minWidth = Math.max(containerWidth, 100);

  // Get line numbers column width in characters
  const getFormattedLineNumber = (num: number) => {
    return num > 0 ? num.toString().padStart(3, " ") : "";
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto relative"
      style={{ willChange: "transform" }} // Optimize for animations/scrolling
    >
      <div className="w-full">
        {lines.map((line, index) => {
          // Calculate indentation
          const indent = line.indentLevel * 1.5;
          // Get line number (if available)
          const lineNumber = lineNumbers?.[index] || 0;

          // Special handling for expandable lines (same lines)
          if (line.type === "expandable") {
            return (
              <div key={`${index}-${line.content}`} className="flex flex-row">
                {/* Empty line number for expandable lines */}
                <div className="line-number bg-base-200"></div>
                {/* Line content with full width and center alignment */}
                <div
                  className={getLineClass(line)}
                  style={{
                    height: `${LINE_HEIGHT}px`,
                    lineHeight: `${LINE_HEIGHT - 2}px`,
                    width: minWidth > 0 ? `${minWidth}px` : "100%",
                    backgroundPosition: "0 0",
                  }}
                  onClick={() =>
                    onExpandableLineClick && onExpandableLineClick(line, index)
                  }
                  title="Click to expand all lines"
                >
                  {line.content}
                </div>
              </div>
            );
          }

          // Special handling for placeholder lines
          if (line.type === "placeholder") {
            return (
              <div key={`${index}-placeholder`} className="flex flex-row">
                {/* Empty line number for placeholder lines */}
                <div className="line-number bg-base-200"></div>
                {/* Line content with full width */}
                <div
                  className={getLineClass(line)}
                  style={{
                    paddingLeft: `${indent + 0.5}rem`,
                    height: `${LINE_HEIGHT}px`,
                    lineHeight: `${LINE_HEIGHT - 2}px`,
                    width: minWidth > 0 ? `${minWidth}px` : "100%",
                    backgroundPosition: "0 0",
                  }}
                ></div>
              </div>
            );
          }

          // Regular line handling
          return (
            <div key={`${index}-${line.content}`} className="flex flex-row">
              {/* Line number column with fixed width */}
              <div className="line-number bg-base-200">
                {getFormattedLineNumber(lineNumber)}
              </div>
              {/* Line content */}
              <div
                className={getLineClass(line)}
                style={{
                  paddingLeft: `${indent + 0.5}rem`,
                  height: `${LINE_HEIGHT}px`,
                  lineHeight: `${LINE_HEIGHT - 2}px`,
                  width: minWidth > 0 ? `${minWidth}px` : "100%",
                  backgroundPosition: "0 0",
                }}
              >
                {line.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default memo(DiffLineRenderer);
