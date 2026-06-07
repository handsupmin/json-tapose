import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUTO_CLIPBOARD_STORAGE_KEY,
  detectClipboardJson,
  getAutoClipboardEnabled,
} from "./clipboard.ts";
import type { ClipboardStatus, PopupTool } from "./types";

const CLIPBOARD_SCAN_INTERVAL_MS = 1500;

interface UseClipboardJsonDetectionOptions {
  readonly activeTool: PopupTool;
  readonly leftJson: string;
  readonly onDetectLeftJson: (json: string) => void;
  readonly onDetectRightJson: (json: string) => void;
  readonly onDetectTreeJson: (json: string) => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof DOMException || error instanceof Error) {
    return error.message;
  }

  throw error;
};

export const useClipboardJsonDetection = ({
  activeTool,
  leftJson,
  onDetectLeftJson,
  onDetectRightJson,
  onDetectTreeJson,
}: UseClipboardJsonDetectionOptions) => {
  const [autoClipboardEnabled, setAutoClipboardEnabled] = useState<boolean>(() =>
    getAutoClipboardEnabled(localStorage.getItem(AUTO_CLIPBOARD_STORAGE_KEY))
  );
  const [clipboardStatus, setClipboardStatus] =
    useState<ClipboardStatus>("idle");
  const [clipboardMessage, setClipboardMessage] = useState<string>("");
  const lastClipboardJsonRef = useRef<string>("");

  useEffect(() => {
    localStorage.setItem(
      AUTO_CLIPBOARD_STORAGE_KEY,
      String(autoClipboardEnabled)
    );
  }, [autoClipboardEnabled]);

  const applyDetectedJson = useCallback(
    (formattedJson: string) => {
      if (lastClipboardJsonRef.current === formattedJson) {
        return;
      }

      lastClipboardJsonRef.current = formattedJson;
      setClipboardStatus("detected");
      setClipboardMessage("Clipboard JSON detected");

      if (activeTool === "tree") {
        onDetectTreeJson(formattedJson);
        return;
      }

      if (!leftJson.trim()) {
        onDetectLeftJson(formattedJson);
        return;
      }

      onDetectRightJson(formattedJson);
    },
    [activeTool, leftJson, onDetectLeftJson, onDetectRightJson, onDetectTreeJson]
  );

  const scanClipboard = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const detection = detectClipboardJson(clipboardText);

      switch (detection.kind) {
        case "valid":
          applyDetectedJson(detection.formattedJson);
          return;
        case "invalid":
          setClipboardStatus("invalid");
          setClipboardMessage("Clipboard is not JSON");
          return;
        case "empty":
          setClipboardStatus("idle");
          setClipboardMessage("");
          return;
      }
    } catch (error) {
      setClipboardStatus("blocked");
      setClipboardMessage(getErrorMessage(error));
    }
  }, [applyDetectedJson]);

  useEffect(() => {
    if (!autoClipboardEnabled) {
      setClipboardStatus("idle");
      setClipboardMessage("");
      return undefined;
    }

    void scanClipboard();
    const intervalId = window.setInterval(() => {
      void scanClipboard();
    }, CLIPBOARD_SCAN_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [autoClipboardEnabled, scanClipboard]);

  return {
    autoClipboardEnabled,
    setAutoClipboardEnabled,
    clipboardStatus,
    clipboardMessage,
  };
};
