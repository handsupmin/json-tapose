import React, { memo } from "react";
import type { JsonInputPanelProps } from "../types/diffTypes";

// Constants for reusability
const TEXTAREA_HEIGHT = "h-80";
const JSON_PLACEHOLDER = '{"example": "Paste your JSON here"}';

// Error icon component for reusability
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

// Error badge component for cleaner separation
const ErrorBadge = ({
  id,
  errorMessage,
}: {
  id: string;
  errorMessage: string;
}) => (
  <div
    id={`${id}Error`}
    className="absolute top-1 right-2 badge badge-error gap-1"
    role="alert"
  >
    <ErrorIcon />
    {errorMessage}
  </div>
);

const JsonInputPanel: React.FC<JsonInputPanelProps> = ({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  onFormat,
}) => {
  // Compute derived values
  const hasError = Boolean(error);
  const textareaClasses = `textarea font-mono bg-base-200 text-base-content w-full ${TEXTAREA_HEIGHT} ${
    hasError ? "textarea-error border-2" : "textarea-bordered"
  }`;

  return (
    <div className="form-control w-full">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="label-text text-lg font-semibold">
          {label}
        </label>
        <button
          onClick={onFormat}
          className="btn btn-xs btn-outline"
          aria-label={`Beautify ${label}`}
        >
          Beautify
        </button>
      </div>
      <div className="relative">
        <textarea
          id={id}
          className={textareaClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={JSON_PLACEHOLDER}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}Error` : undefined}
        ></textarea>
        {hasError && error && <ErrorBadge id={id} errorMessage={error} />}
      </div>
    </div>
  );
};

export default memo(JsonInputPanel);
