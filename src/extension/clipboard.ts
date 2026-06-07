import { formatJson, parseJsonInput } from "../utils/jsonUtils.ts";

export const AUTO_CLIPBOARD_STORAGE_KEY = "extensionAutoClipboard";

export type ClipboardJsonDetection =
  | {
      readonly kind: "empty";
    }
  | {
      readonly kind: "invalid";
    }
  | {
      readonly kind: "valid";
      readonly formattedJson: string;
    };

export const getAutoClipboardEnabled = (
  storedValue: string | null
): boolean => {
  return storedValue === "true";
};

export const detectClipboardJson = (text: string): ClipboardJsonDetection => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return { kind: "empty" };
  }

  const parsed = parseJsonInput(trimmedText);
  if (parsed.error) {
    return { kind: "invalid" };
  }

  return {
    kind: "valid",
    formattedJson: formatJson(trimmedText),
  };
};
