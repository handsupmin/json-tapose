import assert from "node:assert/strict";
import test from "node:test";

import {
  detectClipboardData,
  getAutoClipboardEnabled,
} from "./clipboard.ts";

test("getAutoClipboardEnabled defaults off when no preference exists", () => {
  assert.equal(getAutoClipboardEnabled(null), false);
});

test("getAutoClipboardEnabled returns true only for explicit true", () => {
  assert.equal(getAutoClipboardEnabled("true"), true);
  assert.equal(getAutoClipboardEnabled("false"), false);
});

test("detectClipboardData formats valid JSON text", () => {
  const result = detectClipboardData('{"name":"JSONtapose","mini":true}');

  assert.equal(result.kind, "valid");
  assert.equal(result.kind === "valid" ? result.sourceFormat : "", "json");
  assert.equal(
    result.kind === "valid" ? result.formattedText : "",
    '{\n  "name": "JSONtapose",\n  "mini": true\n}'
  );
});

test("detectClipboardData converts structured YAML into JSON text", () => {
  const result = detectClipboardData("name: JSONtapose\nmini: true\n");

  assert.equal(result.kind, "valid");
  assert.equal(result.kind === "valid" ? result.sourceFormat : "", "yaml");
  assert.equal(
    result.kind === "valid" ? result.formattedText : "",
    '{\n  "name": "JSONtapose",\n  "mini": true\n}'
  );
});

test("detectClipboardData rejects invalid, empty, and scalar YAML text", () => {
  assert.equal(detectClipboardData("{").kind, "invalid");
  assert.equal(detectClipboardData("   ").kind, "empty");
  assert.equal(detectClipboardData("plain text").kind, "invalid");
});
