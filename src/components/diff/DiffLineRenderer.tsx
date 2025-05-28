import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DiffLine } from "../../types/diffTypes";

/**
 * Component for rendering diff lines with scroll synchronization
 *
 * Features:
 * - Synchronized scrolling between left and right panels
 * - Line number display
 * - Expandable sections for unchanged lines
 * - Visual indicators for added/removed/changed lines
 * - Responsive width handling
 * - Performance optimizations for smooth scrolling
 *
 * The component uses:
 * - ResizeObserver for container width updates
 * - requestAnimationFrame for scroll synchronization
 * - CSS classes for different line types
 * - Memoization for performance
 */
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

  // Fixed line height for consistent rendering
  const LINE_HEIGHT = 22;

  // Expose scrollTo method for parent components
  useImperativeHandle(ref, () => ({
    scrollTo: (scrollLeft: number, scrollTop: number) => {
      if (!containerRef.current) return;

      isInternalScrollRef.current = true;
      containerRef.current.scrollLeft = scrollLeft;
      containerRef.current.scrollTop = scrollTop;

      // Reset scrolling flag after animation frame
      requestAnimationFrame(() => {
        isInternalScrollRef.current = false;
      });
    },
  }));

  // Monitor container width changes
  useEffect(() => {
    const updateContainer = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainer();
    const resizeObserver = new ResizeObserver(updateContainer);
    const currentRef = containerRef.current;

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  // Handle scroll events with synchronization
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isInternalScrollRef.current) return;

      const { scrollTop, scrollLeft } = containerRef.current;
      onScroll?.(scrollTop, scrollLeft);
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll, { passive: true });
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [onScroll]);

  // Generate CSS classes based on line type and side
  const getLineClass = (line: DiffLine) => {
    const baseClass = "px-2 py-0.5 whitespace-pre diff-line text-left";

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

  // Ensure minimum width for content
  const minWidth = Math.max(containerWidth, 100);

  // Format line numbers with padding
  const getFormattedLineNumber = (num: number) => {
    return num > 0 ? num.toString().padStart(3, " ") : "";
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto relative"
      style={{ willChange: "transform" }}
    >
      <div className="w-full">
        {lines.map((line, index) => {
          const indent = line.indentLevel * 1.5;
          const lineNumber = lineNumbers?.[index] || 0;

          // Render expandable section
          if (line.type === "expandable") {
            return (
              <div key={`${index}-${line.content}`} className="flex flex-row">
                <div className="line-number bg-base-200"></div>
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

          // Render placeholder line
          if (line.type === "placeholder") {
            return (
              <div key={`${index}-placeholder`} className="flex flex-row">
                <div className="line-number bg-base-200"></div>
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

          // Render regular line
          return (
            <div key={`${index}-${line.content}`} className="flex flex-row">
              <div className="line-number bg-base-200">
                {getFormattedLineNumber(lineNumber)}
              </div>
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
