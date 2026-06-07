import { useCallback, useState } from "react";
import CompareTool from "./CompareTool";
import TreeTool from "./TreeTool";
import type { PopupTool } from "./types";
import { useClipboardJsonDetection } from "./useClipboardJsonDetection";
import logoUrl from "/logo.svg";

const Popup: React.FC = () => {
  const [activeTool, setActiveTool] = useState<PopupTool>("compare");
  const [leftJson, setLeftJson] = useState<string>("");
  const [rightJson, setRightJson] = useState<string>("");
  const [treeJson, setTreeJson] = useState<string>("");

  const updateLeftJson = useCallback((json: string) => {
    setLeftJson(json);
  }, []);

  const updateRightJson = useCallback((json: string) => {
    setRightJson(json);
  }, []);

  const updateTreeJson = useCallback((json: string) => {
    setTreeJson(json);
  }, []);

  const {
    autoClipboardEnabled,
    setAutoClipboardEnabled,
    clipboardStatus,
    clipboardMessage,
  } = useClipboardJsonDetection({
    activeTool,
    leftJson,
    onDetectLeftJson: updateLeftJson,
    onDetectRightJson: updateRightJson,
    onDetectTreeJson: updateTreeJson,
  });

  return (
    <div className="extension-shell text-left">
      <header className="extension-panel p-3">
        <div className="flex items-center gap-2 min-w-0">
          <img src={logoUrl} alt="JSONtapose" className="h-8 w-8" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">JSONtapose Mini</div>
            <div className="text-xs font-medium text-base-content/50">
              Local JSON/YAML tools
            </div>
          </div>
          {clipboardStatus !== "idle" && (
            <div
              className={`badge badge-sm ${
                clipboardStatus === "detected"
                  ? "badge-success"
                  : clipboardStatus === "invalid"
                    ? "badge-warning"
                    : "badge-error"
              }`}
              title={clipboardMessage}
            >
              {clipboardStatus === "detected" ? "Detected" : "Clipboard"}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="tool-switch flex-1" role="tablist" aria-label="Popup tools">
            <button
              type="button"
              className={`tool-tab ${
                activeTool === "compare" ? "tool-tab-active" : ""
              }`}
              onClick={() => setActiveTool("compare")}
              aria-pressed={activeTool === "compare"}
            >
              <span aria-hidden="true">⇄</span>
              Compare
            </button>
            <button
              type="button"
              className={`tool-tab ${
                activeTool === "tree" ? "tool-tab-active" : ""
              }`}
              onClick={() => setActiveTool("tree")}
              aria-pressed={activeTool === "tree"}
            >
              <span aria-hidden="true">▦</span>
              Tree
            </button>
          </div>
          <label
            className={`auto-clipboard-control ${
              autoClipboardEnabled
                ? "auto-clipboard-control-active"
                : ""
            }`}
          >
            <span>Auto clip</span>
            <input
              type="checkbox"
              className="toggle toggle-xs extension-toggle"
              checked={autoClipboardEnabled}
              onChange={(event) => setAutoClipboardEnabled(event.target.checked)}
              aria-label="Detect JSON or YAML from clipboard"
            />
          </label>
        </div>
      </header>

      <main className="extension-content mt-3 overflow-auto pr-1">
        {activeTool === "compare" ? (
          <CompareTool
            leftJson={leftJson}
            rightJson={rightJson}
            onLeftJsonChange={updateLeftJson}
            onRightJsonChange={updateRightJson}
          />
        ) : (
          <TreeTool treeJson={treeJson} onTreeJsonChange={updateTreeJson} />
        )}
      </main>
    </div>
  );
};

export default Popup;
