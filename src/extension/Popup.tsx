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
    <div className="min-h-[560px] bg-base-100 text-base-content p-3 text-left">
      <header className="flex items-center justify-between gap-2 pb-2 border-b border-base-300">
        <div className="flex items-center gap-2 min-w-0">
          <img src={logoUrl} alt="JSONtapose" className="h-7 w-7" />
          <div className="font-bold truncate">JSONtapose Mini</div>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium">
          <span>Clipboard</span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-xs"
            checked={autoClipboardEnabled}
            onChange={(event) => setAutoClipboardEnabled(event.target.checked)}
            aria-label="Detect JSON from clipboard"
          />
        </label>
      </header>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="join">
          <button
            className={`btn btn-xs join-item ${
              activeTool === "compare" ? "btn-primary" : ""
            }`}
            onClick={() => setActiveTool("compare")}
          >
            Compare
          </button>
          <button
            className={`btn btn-xs join-item ${
              activeTool === "tree" ? "btn-primary" : ""
            }`}
            onClick={() => setActiveTool("tree")}
          >
            Tree
          </button>
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
    </div>
  );
};

export default Popup;
