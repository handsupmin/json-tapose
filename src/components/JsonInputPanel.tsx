import React, { memo, useState } from "react";
import type { JsonInputPanelProps } from "../types/diffTypes";

/**
 * Error icon component for consistent error visualization
 * Uses a simple X icon with stroke styling
 */
const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="w-4 h-4 stroke-current"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * Error badge component for displaying validation errors
 * Features:
 * - Dismissible error message
 * - Visual error indicator
 * - Accessible alert role
 * - Hover effect for better UX
 */
const ErrorBadge = ({
  id,
  onDismiss,
}: {
  id: string;
  onDismiss: () => void;
}) => (
  <div
    id={`${id}Error`}
    className="absolute top-1 right-2 badge badge-error gap-1 cursor-pointer hover:badge-error/80 transition-colors max-w-xs"
    role="alert"
    onClick={onDismiss}
    title="Click to dismiss"
  >
    <ErrorIcon />
    <span className="truncate">Invalid JSON format</span>
  </div>
);

/**
 * Input panel component for JSON editing
 *
 * Features:
 * - JSON textarea with monospace font
 * - Real-time validation
 * - Error display with dismiss option
 * - JSON beautification
 * - Accessibility support
 *
 * The component:
 * - Manages error state locally or via props
 * - Provides visual feedback for invalid input
 * - Supports custom error handling
 * - Maintains consistent styling
 */
const JsonInputPanel: React.FC<JsonInputPanelProps> = ({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  onFormat,
  onErrorDismiss,
}) => {
  // Local error state for fallback dismissal
  const [errorDismissed, setErrorDismissed] = useState(false);

  // Reset local error state when error prop changes
  React.useEffect(() => {
    setErrorDismissed(false);
  }, [error]);

  // Determine error state and textarea styling
  const hasError = Boolean(error) && !errorDismissed;
  const textareaClasses = `textarea font-mono bg-base-200 text-base-content w-full h-80 ${
    error ? "textarea-error border-2" : "textarea-bordered"
  }`;

  // Handle error dismissal with fallback to local state
  const handleErrorDismiss = () => {
    if (onErrorDismiss) {
      onErrorDismiss();
    } else {
      setErrorDismissed(true);
    }
  };

  return (
    <div className="form-control w-full">
      {/* Panel header with label and beautify button */}
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="label-text text-lg font-semibold">
          {label}
        </label>
        <button
          onClick={onFormat}
          className="btn btn-sm"
          aria-label={`Beautify ${label}`}
        >
          Beautify
        </button>
      </div>

      {/* Textarea container with error badge */}
      <div className="relative">
        <textarea
          id={id}
          className={textareaClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={'{"example": "Paste your JSON here"}'}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={hasError ? `${id}Error` : undefined}
          translate="no"
        ></textarea>
        {hasError && <ErrorBadge id={id} onDismiss={handleErrorDismiss} />}
      </div>
    </div>
  );
};

export default memo(JsonInputPanel);
