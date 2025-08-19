import { useCallback, useState } from "react";
import type { SampleType } from "../utils/jsonUtils";
import { formatYaml, isValidYaml } from "../utils/yamlUtils";

export const useYamlTree = () => {
  const [jsonInput, setYamlInput] = useState<string>("");
  const [selectedSample, setSelectedSample] =
    useState<SampleType>("productExample");
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError(null);
      return true;
    }
    try {
      if (!isValidYaml(value)) throw new Error("Invalid YAML format");
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid YAML format");
      return false;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleInputChange = useCallback(
    (value: string) => {
      setYamlInput(value);
      validate(value);
    },
    [validate]
  );

  const handleInputBlur = useCallback(
    (value: string) => {
      handleInputChange(value);
    },
    [handleInputChange]
  );

  const handleFormat = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const formatted = formatYaml(jsonInput);
      setYamlInput(formatted);
      clearError();
    } catch {
      validate(jsonInput);
    }
  }, [jsonInput, clearError, validate]);

  const handleClear = useCallback(() => {
    setYamlInput("");
    clearError();
  }, [clearError]);

  const handleSampleSelect = useCallback(
    (sampleType: SampleType, leftSample: string) => {
      setSelectedSample(sampleType);
      setYamlInput(leftSample);
      clearError();
    },
    [clearError]
  );

  const handleErrorDismiss = useCallback(() => {
    clearError();
  }, [clearError]);

  const shouldShowTree = jsonInput.trim() && !error;

  return {
    jsonInput,
    error,
    selectedSample,
    shouldShowTree,
    handleInputChange,
    handleInputBlur,
    handleFormat,
    handleClear,
    handleSampleSelect,
    handleErrorDismiss,
  };
};
