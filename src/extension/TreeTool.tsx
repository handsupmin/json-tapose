import { useCallback, useMemo } from "react";
import JsonTreeMaker from "../components/JsonTreeMaker";
import { formatJson } from "../utils/jsonUtils";
import { detectStructuredTextData } from "./structuredText.ts";

interface TreeToolProps {
  readonly treeJson: string;
  readonly onTreeJsonChange: (json: string) => void;
}

const TreeTool: React.FC<TreeToolProps> = ({
  treeJson,
  onTreeJsonChange,
}) => {
  const detectedTreeData = useMemo(
    () => detectStructuredTextData(treeJson),
    [treeJson]
  );
  const displayTreeJson =
    detectedTreeData.kind === "valid"
      ? detectedTreeData.formattedText
      : treeJson;

  const formatTreeJson = useCallback(() => {
    if (detectedTreeData.kind === "valid") {
      onTreeJsonChange(detectedTreeData.formattedText);
      return;
    }

    onTreeJsonChange(formatJson(treeJson));
  }, [detectedTreeData, onTreeJsonChange, treeJson]);

  return (
    <section className="flex flex-col gap-3">
      <div className="tool-heading">
        <span className="tool-heading-icon tool-heading-icon-tree" aria-hidden="true">
          ▦
        </span>
        <h2>Tree</h2>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-base-content/70">
          JSON or YAML
        </span>
        <textarea
          className="textarea textarea-bordered h-32 w-full resize-none font-mono text-xs leading-5"
          value={treeJson}
          onChange={(event) => onTreeJsonChange(event.target.value)}
          placeholder='{"tree": true}'
        />
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <button
          className="mini-action-button mini-action-primary"
          onClick={formatTreeJson}
          aria-label="Beautify tree input"
        >
          <span aria-hidden="true">{"{}"}</span>
          <span>Beautify</span>
        </button>
        <button
          className="mini-icon-button"
          onClick={() => onTreeJsonChange("")}
          aria-label="Clear tree input"
          title="Clear tree input"
        >
          ×
        </button>
      </div>
      <div className="mini-tree-panel max-h-72 overflow-auto rounded-lg">
        <JsonTreeMaker jsonData={displayTreeJson} />
      </div>
    </section>
  );
};

export default TreeTool;
