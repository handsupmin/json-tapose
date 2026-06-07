import { useCallback } from "react";
import JsonTreeMaker from "../components/JsonTreeMaker";
import { formatJson } from "../utils/jsonUtils";

interface TreeToolProps {
  readonly treeJson: string;
  readonly onTreeJsonChange: (json: string) => void;
}

const TreeTool: React.FC<TreeToolProps> = ({
  treeJson,
  onTreeJsonChange,
}) => {
  const formatTreeJson = useCallback(() => {
    onTreeJsonChange(formatJson(treeJson));
  }, [onTreeJsonChange, treeJson]);

  return (
    <section className="mt-3 flex flex-col gap-2">
      <label className="form-control">
        <span className="label-text text-xs font-semibold">JSON</span>
        <textarea
          className="textarea textarea-bordered h-36 font-mono text-xs"
          value={treeJson}
          onChange={(event) => onTreeJsonChange(event.target.value)}
          placeholder='{"tree": true}'
        />
      </label>
      <div className="flex items-center gap-2">
        <button className="btn btn-primary btn-sm" onClick={formatTreeJson}>
          Beautify
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => onTreeJsonChange("")}>
          Clear
        </button>
      </div>
      <div className="max-h-72 overflow-auto">
        <JsonTreeMaker jsonData={treeJson} />
      </div>
    </section>
  );
};

export default TreeTool;
