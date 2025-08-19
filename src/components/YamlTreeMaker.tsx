import React from "react";
import { parse as parseYaml } from "yaml";

type YamlValue = any;

const renderInlineValue = (value: YamlValue): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return `[${value.length}]`;
  if (typeof value === "object") return `{${Object.keys(value).length}}`;
  if (typeof value === "string") return `"${value}"`;
  return String(value);
};

const getDataType = (value: YamlValue): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

interface YamlTreeNodeProps {
  data: YamlValue;
  keyName?: string | number;
  level?: number;
  expandAll?: boolean;
}

const YamlTreeNode: React.FC<YamlTreeNodeProps> = ({
  data,
  keyName,
  level = 0,
  expandAll,
}) => {
  const isContainer =
    (Array.isArray(data) && data.length > 0) ||
    (typeof data === "object" && data !== null && Object.keys(data).length > 0);

  const [isExpanded, setIsExpanded] = React.useState<boolean>(
    expandAll ?? level < 2
  );

  React.useEffect(() => {
    if (expandAll !== undefined) setIsExpanded(expandAll);
  }, [expandAll]);

  const toggle = () => setIsExpanded((v) => !v);

  return (
    <div className="json-tree-item">
      <div className="inline-flex items-center min-w-full h-[21px]">
        <div className="flex-none w-6 mr-1 flex items-center">
          {isContainer ? (
            <button
              onClick={toggle}
              className="w-4 h-4 flex items-center justify-center text-xs hover:bg-base-300 rounded text-base-content/60"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          ) : (
            <span className="w-4" />
          )}
        </div>
        {keyName !== undefined && (
          <>
            <div className="flex-none mr-1 flex items-center">
              <span className="text-primary font-medium truncate max-w-[200px]">
                {keyName}
              </span>
            </div>
            <div className="flex-none mr-1 flex items-center">
              <span className="text-base-content/60">:</span>
            </div>
          </>
        )}
        <div className="flex-1 min-w-0 flex items-center">
          <span
            className={`whitespace-nowrap ${(() => {
              const t = getDataType(data);
              if (t === "string") return "text-success";
              if (t === "number") return "text-warning";
              if (t === "boolean") return "text-secondary";
              if (t === "null") return "text-error italic";
              return "text-base-content/60 font-medium";
            })()}`}
          >
            {renderInlineValue(data)}
          </span>
        </div>
      </div>

      {isContainer && isExpanded && (
        <div className="pl-7">
          {Array.isArray(data)
            ? (data as YamlValue[]).map((item, idx) => (
                <YamlTreeNode
                  key={idx}
                  data={item}
                  keyName={idx}
                  level={level + 1}
                  expandAll={expandAll}
                />
              ))
            : Object.entries(data as Record<string, YamlValue>).map(
                ([k, v]) => (
                  <YamlTreeNode
                    key={k}
                    data={v}
                    keyName={k}
                    level={level + 1}
                    expandAll={expandAll}
                  />
                )
              )}
        </div>
      )}
    </div>
  );
};

const YamlTreeMaker: React.FC<{
  yamlData: string;
  error?: string;
  expandAll?: boolean;
}> = ({ yamlData, error, expandAll }) => {
  const [parsed, setParsed] = React.useState<YamlValue | null>(null);
  const [parseError, setParseError] = React.useState<string>("");

  React.useEffect(() => {
    if (!yamlData.trim()) {
      setParsed(null);
      setParseError("");
      return;
    }
    try {
      const v = parseYaml(yamlData);
      setParsed(v);
      setParseError("");
    } catch (e) {
      setParsed(null);
      setParseError(e instanceof Error ? e.message : "Invalid YAML");
    }
  }, [yamlData]);

  if (error || parseError) {
    return (
      <div className="json-tree-viewer bg-base-100 rounded-lg p-4 border border-error">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error || parseError}</span>
        </div>
      </div>
    );
  }

  if (!parsed) {
    return (
      <div className="json-tree-viewer bg-base-100 rounded-lg p-8 border border-base-300">
        <div className="text-center text-base-content/60">
          <div className="text-4xl mb-4">📄</div>
          <p>Paste your YAML data to see the tree structure</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-base-100 rounded-lg p-4 border border-base-300 max-h-96 overflow-auto text-left font-mono text-sm leading-normal"
      translate="no"
    >
      <YamlTreeNode data={parsed} expandAll={expandAll} />
    </div>
  );
};

export default YamlTreeMaker;
