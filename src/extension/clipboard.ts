import { formatJson, parseJsonInput } from "../utils/jsonUtils.ts";
import { parse as parseYaml } from "yaml";

export const AUTO_CLIPBOARD_STORAGE_KEY = "extensionAutoClipboard";

type ClipboardDataFormat = "json" | "yaml";

export type ClipboardDataDetection =
  | {
      readonly kind: "empty";
    }
  | {
      readonly kind: "invalid";
    }
  | {
      readonly kind: "valid";
      readonly formattedText: string;
      readonly sourceFormat: ClipboardDataFormat;
    };

export const getAutoClipboardEnabled = (
  storedValue: string | null
): boolean => {
  return storedValue === "true";
};

export const detectClipboardData = (text: string): ClipboardDataDetection => {
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
): ClipboardDataDetection | null => {
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
  } catch {
    return null;
  }
};

const isStructuredValue = (value: unknown): value is readonly unknown[] | object => {
  return typeof value === "object" && value !== null;
};
