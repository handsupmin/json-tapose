import { formatJson, parseJsonInput } from "../utils/jsonUtils.ts";
import { parse as parseYaml } from "yaml";

export type StructuredTextFormat = "json" | "yaml";

export type StructuredTextDetection =
  | {
      readonly kind: "empty";
    }
  | {
      readonly kind: "invalid";
    }
  | {
      readonly kind: "valid";
      readonly formattedText: string;
      readonly sourceFormat: StructuredTextFormat;
    };

export const detectStructuredTextData = (
  text: string
): StructuredTextDetection => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return { kind: "empty" };
  }

  const parsed = parseJsonInput(trimmedText);
  if (!parsed.error) {
    return {
      kind: "valid",
      formattedText: formatJson(trimmedText),
      sourceFormat: "json",
    };
  }

  const yamlResult = parseStructuredYaml(trimmedText);
  return yamlResult ?? { kind: "invalid" };
};

const parseStructuredYaml = (
  text: string
): StructuredTextDetection | null => {
  try {
    const parsed: unknown = parseYaml(text);

    if (!isStructuredValue(parsed)) {
      return null;
    }

    const formattedText = JSON.stringify(parsed, null, 2);
    if (!formattedText) {
      return null;
    }

    return {
      kind: "valid",
      formattedText,
      sourceFormat: "yaml",
    };
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }

    throw error;
  }
};

const isStructuredValue = (
  value: unknown
): value is readonly unknown[] | object => {
  return typeof value === "object" && value !== null;
};
