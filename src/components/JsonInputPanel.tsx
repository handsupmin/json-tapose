import React, { memo } from "react";
import type { JsonInputPanelProps } from "../types/diffTypes";

const JsonInputPanel: React.FC<JsonInputPanelProps> = ({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  onFormat,
}) => {
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
          className={`textarea font-mono bg-base-200 text-base-content w-full h-80 ${
            error ? "textarea-error border-2" : "textarea-bordered"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder='{"example": "Paste your JSON here"}'
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}Error` : undefined}
        ></textarea>
        {error && (
          <div
            id={`${id}Error`}
            className="absolute top-1 right-2 badge badge-error gap-1"
            role="alert"
          >
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
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(JsonInputPanel);
