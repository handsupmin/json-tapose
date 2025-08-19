import type { ReactNode } from "react";
import React, { useCallback, useState } from "react";
import { parse as parseYaml } from "yaml";
import type { YamlCompareContextType } from "../types/yamlContextTypes";
import {
  compareYamlObjects,
  formatYaml,
  isValidYaml,
} from "../utils/yamlUtils";
import { YamlCompareContext } from "./YamlCompareContextInstance";

interface YamlCompareProviderProps {
  children: ReactNode;
}

export const YamlCompareProvider: React.FC<YamlCompareProviderProps> = ({
  children,
}) => {
  const [leftYaml, setLeftYamlState] = useState<string>("");
  const [rightYaml, setRightYamlState] = useState<string>("");
  const [diffResult, setDiffResult] = useState<ReturnType<
    typeof compareYamlObjects
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [leftYamlError, setLeftYamlError] = useState<string | null>(null);
  const [rightYamlError, setRightYamlError] = useState<string | null>(null);

  const setLeftYaml = useCallback(
    (yaml: string) => {
      setLeftYamlState(yaml);
      if (leftYamlError) setLeftYamlError(null);
    },
    [leftYamlError]
  );

  const setRightYaml = useCallback(
    (yaml: string) => {
      setRightYamlState(yaml);
      if (rightYamlError) setRightYamlError(null);
    },
    [rightYamlError]
  );

  const validateYaml = useCallback((side: "left" | "right", value: string) => {
    if (!value.trim()) return;
    if (!isValidYaml(value)) {
      if (side === "left") setLeftYamlError("Invalid YAML format");
      else setRightYamlError("Invalid YAML format");
    } else {
      if (side === "left") setLeftYamlError(null);
      else setRightYamlError(null);
    }
  }, []);

  const handleCompare = useCallback(() => {
    setError(null);
    setLoading(true);

    try {
      if (!leftYaml.trim() || !rightYaml.trim()) {
        throw new Error("Both input fields are required");
      }

      if (!isValidYaml(leftYaml) || !isValidYaml(rightYaml)) {
        throw new Error("Invalid YAML in one or both inputs");
      }

      const leftParsed = parseYaml(leftYaml);
      const rightParsed = parseYaml(rightYaml);

      if (
        typeof leftParsed !== "object" ||
        typeof rightParsed !== "object" ||
        leftParsed === null ||
        rightParsed === null ||
        Array.isArray(leftParsed) ||
        Array.isArray(rightParsed)
      ) {
        throw new Error(
          "YAML must be an object at the root level, not an array or primitive"
        );
      }

      const result = compareYamlObjects(leftParsed, rightParsed);
      setDiffResult(result);
    } catch (e) {
      setError((e as Error).message);
      setDiffResult(null);
    } finally {
      setLoading(false);
    }
  }, [leftYaml, rightYaml]);

  const handleFormat = useCallback(
    (side: "left" | "right") => {
      try {
        if (side === "left" && leftYaml.trim()) {
          if (isValidYaml(leftYaml)) {
            setLeftYamlState(formatYaml(leftYaml));
            setLeftYamlError(null);
            setError(null);
          } else {
            setLeftYamlError("Invalid YAML format");
            setError("Invalid YAML in left editor");
          }
        } else if (side === "right" && rightYaml.trim()) {
          if (isValidYaml(rightYaml)) {
            setRightYamlState(formatYaml(rightYaml));
            setRightYamlError(null);
            setError(null);
          } else {
            setRightYamlError("Invalid YAML format");
            setError("Invalid YAML in right editor");
          }
        }
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [leftYaml, rightYaml]
  );

  const loadSampleData = useCallback(
    (leftSample: string, rightSample: string) => {
      setLeftYamlState(leftSample);
      setRightYamlState(rightSample);
      setLeftYamlError(null);
      setRightYamlError(null);
      setError(null);
      setDiffResult(null);
    },
    []
  );

  const clearAll = useCallback(() => {
    setLeftYamlState("");
    setRightYamlState("");
    setLeftYamlError(null);
    setRightYamlError(null);
    setError(null);
    setDiffResult(null);
  }, []);

  const contextValue: YamlCompareContextType = {
    leftYaml,
    rightYaml,
    diffResult,
    error,
    loading,
    leftYamlError,
    rightYamlError,
    setLeftYaml,
    setRightYaml,
    validateYaml,
    compareYaml: handleCompare,
    formatYaml: handleFormat,
    clearAll,
    loadSampleData,
  };

  return (
    <YamlCompareContext.Provider value={contextValue}>
      {children}
    </YamlCompareContext.Provider>
  );
};
