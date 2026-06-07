import { detectStructuredTextData } from "./structuredText.ts";
import type { StructuredTextDetection } from "./structuredText.ts";

export const AUTO_CLIPBOARD_STORAGE_KEY = "extensionAutoClipboard";

export type ClipboardDataDetection = StructuredTextDetection;

export const getAutoClipboardEnabled = (
  storedValue: string | null
): boolean => {
  return storedValue === "true";
};

export const detectClipboardData = detectStructuredTextData;
