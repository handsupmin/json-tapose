import React, { memo, useMemo, useRef, useState } from "react";
import type { JsonInputPanelProps } from "../types/diffTypes";
import {
  buildJsonErrorPreview,
  type JsonValidationError,
} from "../utils/jsonUtils";

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
  label,
  title,
  onDismiss,
}: {
  id: string;
  label: string;
  title: string;
  onDismiss: () => void;
}) => (
  <div
    id={`${id}Error`}
    className="absolute top-1 right-2 badge badge-error gap-1 cursor-pointer hover:badge-error/80 transition-colors max-w-xs"
    role="alert"
    onClick={onDismiss}
    title={title}
  >
    <ErrorIcon />
    <span className="truncate">{label}</span>
  </div>
);

const isStructuredJsonError = (
  error: JsonInputPanelProps["error"]
): error is JsonValidationError => {
  return typeof error === "object" && error !== null && "line" in error;
};

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
  placeholder,
}) => {
  // Local error state for fallback dismissal
  const [errorDismissed, setErrorDismissed] = useState(false);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Reset local error state when error prop changes
  React.useEffect(() => {
    setErrorDismissed(false);
  }, [error]);

  // Determine error state and textarea styling
  const structuredError = isStructuredJsonError(error) ? error : null;
  const errorMessage =
    typeof error === "string" ? error : structuredError?.message ?? null;
  const hasError = Boolean(errorMessage) && !errorDismissed;
  const errorPreview = useMemo(() => {
    if (!structuredError) {
      return null;
    }

    return buildJsonErrorPreview(value, structuredError);
  }, [structuredError, value]);
  const textareaClasses = `textarea font-mono text-sm leading-6 bg-transparent text-base-content w-full h-80 ${
    hasError ? "textarea-error border-2" : "textarea-bordered"
  }`;
  const badgeLabel = structuredError
    ? `Line ${structuredError.line}:${structuredError.column}`
    : "Invalid input";

  const syncHighlightScroll = (
    event: React.UIEvent<HTMLTextAreaElement, UIEvent>
  ) => {
    if (!highlightRef.current) {
      return;
    }

    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

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
      <div className="relative rounded-box bg-base-200">
        {hasError && structuredError && (
          <div
            ref={highlightRef}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-box p-3 font-mono text-sm leading-6 whitespace-pre-wrap break-words text-transparent"
            aria-hidden="true"
          >
            {value.split("\n").map((line, index) => (
              <div
                key={`${index}-${line.length}`}
                className={`min-h-6 ${
                  index + 1 === structuredError.line
                    ? "bg-error/15 rounded-sm"
                    : ""
                }`}
              >
                {line || " "}
              </div>
            ))}
          </div>
        )}
        <textarea
          id={id}
          className={textareaClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          onScroll={syncHighlightScroll}
          placeholder={placeholder ?? '{"example": "Paste your JSON here"}'}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}Error` : undefined}
          translate="no"
        ></textarea>
        {hasError && (
          <ErrorBadge
            id={id}
            label={badgeLabel}
            title={errorMessage ?? "Invalid input"}
            onDismiss={handleErrorDismiss}
          />
        )}
      </div>

      {hasError && errorMessage && (
        <div className="mt-2 rounded-lg border border-error/30 bg-error/10 p-3">
          <div className="text-sm font-medium text-error">{errorMessage}</div>
          {structuredError && (
            <div className="mt-1 text-xs text-base-content/70">
              Line {structuredError.line}, column {structuredError.column}
            </div>
          )}
          {errorPreview?.mode === "inline" && (
            <div className="mt-3 rounded-md bg-base-200 px-3 py-2 font-mono text-sm break-all">
              <span className="text-base-content/70">{errorPreview.prefix}</span>
              <span className="bg-error/20 text-error px-1 rounded">
                {errorPreview.highlight}
              </span>
              <span className="text-base-content/70">{errorPreview.suffix}</span>
            </div>
          )}
          {errorPreview?.mode === "multiline" && (
            <div className="mt-3 rounded-md bg-base-200 p-2 font-mono text-sm">
              <div className="space-y-1">
                {errorPreview.lines.map((line) => (
                  <div
                    key={line.lineNumber}
                    className={`grid grid-cols-[auto_1fr] gap-3 rounded px-2 py-1 ${
                      line.isFocus ? "bg-error/15 text-error" : ""
                    }`}
                  >
                    <span className="text-xs text-base-content/50">
                      {line.lineNumber}
                    </span>
                    <span className="whitespace-pre-wrap break-all">
                      {line.text || " "}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(JsonInputPanel);
