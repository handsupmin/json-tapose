import { useWideView } from "../hooks/useWideView";

interface WideViewToggleProps {
  readonly className?: string;
}

const WideViewToggle: React.FC<WideViewToggleProps> = ({ className = "" }) => {
  const { isWideView, setIsWideView } = useWideView();

  return (
    <label
      className={`flex items-center gap-2 text-sm font-medium text-base-content/80 ${className}`}
      title="Use the wide layout"
    >
      <span>Wide</span>
      <input
        type="checkbox"
        className="toggle toggle-primary toggle-sm"
        checked={isWideView}
        onChange={(event) => setIsWideView(event.target.checked)}
        aria-label="Toggle wide view mode"
      />
    </label>
  );
};

export default WideViewToggle;
