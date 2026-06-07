import type { JsonDiffItem } from "../utils/jsonUtils";

interface CompactDiffSummaryProps {
  readonly diffItems: readonly JsonDiffItem[];
}

interface DiffCounts {
  readonly added: number;
  readonly removed: number;
  readonly changed: number;
}

interface DiffHighlight {
  readonly path: string;
  readonly type: JsonDiffItem["type"];
}

interface DiffStat {
  readonly label: string;
  readonly value: number;
  readonly className: string;
}

const emptyCounts: DiffCounts = {
  added: 0,
  removed: 0,
  changed: 0,
};

const getItemPath = (item: JsonDiffItem): string => {
  return item.path.length > 0 ? item.path.join(".") : item.key;
};

const mergeCounts = (left: DiffCounts, right: DiffCounts): DiffCounts => {
  return {
    added: left.added + right.added,
    removed: left.removed + right.removed,
    changed: left.changed + right.changed,
  };
};

const countDiffs = (items: readonly JsonDiffItem[]): DiffCounts => {
  return items.reduce<DiffCounts>((counts, item) => {
    const ownCounts =
      item.type === "added"
        ? { ...emptyCounts, added: 1 }
        : item.type === "removed"
          ? { ...emptyCounts, removed: 1 }
          : item.type === "changed" && !item.children
            ? { ...emptyCounts, changed: 1 }
            : emptyCounts;

    return mergeCounts(counts, mergeCounts(ownCounts, countDiffs(item.children ?? [])));
  }, emptyCounts);
};

const collectHighlights = (
  items: readonly JsonDiffItem[],
  limit: number
): readonly DiffHighlight[] => {
  const highlights: DiffHighlight[] = [];

  for (const item of items) {
    if (highlights.length >= limit) {
      break;
    }

    if (item.children) {
      highlights.push(...collectHighlights(item.children, limit - highlights.length));
      continue;
    }

    if (item.type !== "unchanged") {
      highlights.push({
        path: getItemPath(item),
        type: item.type,
      });
    }
  }

  return highlights;
};

const assertNever = (value: never): never => {
  throw new Error(`Unexpected diff type: ${String(value)}`);
};

const getBadgeClass = (type: JsonDiffItem["type"]): string => {
  switch (type) {
    case "added":
      return "badge-success";
    case "removed":
      return "badge-error";
    case "changed":
      return "badge-warning";
    case "unchanged":
      return "badge-ghost";
    default:
      return assertNever(type);
  }
};

const getVisibleStats = (counts: DiffCounts): readonly DiffStat[] => {
  return [
    {
      label: "Added",
      value: counts.added,
      className: "border-success/30 bg-success/10 text-success",
    },
    {
      label: "Removed",
      value: counts.removed,
      className: "border-error/30 bg-error/10 text-error",
    },
    {
      label: "Changed",
      value: counts.changed,
      className: "border-warning/40 bg-warning/10 text-warning",
    },
  ].filter((stat) => stat.value > 0);
};

const CompactDiffSummary: React.FC<CompactDiffSummaryProps> = ({ diffItems }) => {
  const counts = countDiffs(diffItems);
  const highlights = collectHighlights(diffItems, 6);
  const total = counts.added + counts.removed + counts.changed;
  const visibleStats = getVisibleStats(counts);

  return (
    <section className="extension-panel p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">Result</h2>
          <p className="text-[11px] text-base-content/50">
            {total === 0 ? "No structural differences" : "Top changed paths"}
          </p>
        </div>
        <span
          className={`diff-total-badge ${
            total === 0 ? "diff-total-badge-same" : ""
          }`}
        >
          {total === 0 ? "Same" : `${total} diffs`}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {visibleStats.length > 0 ? (
          visibleStats.map((stat) => (
            <span
              key={stat.label}
              className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${stat.className}`}
            >
              {stat.label} {stat.value}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">
            Values match
          </span>
        )}
      </div>

      {highlights.length > 0 ? (
        <div className="mt-2 max-h-28 space-y-1.5 overflow-auto pr-1">
          {highlights.map((highlight) => (
            <div
              key={`${highlight.type}-${highlight.path}`}
              className="diff-highlight-row"
            >
              <span className={`badge badge-xs ${getBadgeClass(highlight.type)}`}>
                {highlight.type}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs">
                {highlight.path}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-md bg-base-200 px-2 py-1.5 text-xs text-base-content/60">
          The compared values match.
        </p>
      )}
    </section>
  );
};

export default CompactDiffSummary;
