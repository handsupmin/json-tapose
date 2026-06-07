import assert from "node:assert/strict";
import test from "node:test";

import {
  detectClipboardJson,
  getAutoClipboardEnabled,
} from "./clipboard.ts";

test("getAutoClipboardEnabled defaults off when no preference exists", () => {
  assert.equal(getAutoClipboardEnabled(null), false);
});

test("getAutoClipboardEnabled returns true only for explicit true", () => {
  assert.equal(getAutoClipboardEnabled("true"), true);
  assert.equal(getAutoClipboardEnabled("false"), false);
});

test("detectClipboardJson formats valid JSON text", () => {
  const result = detectClipboardJson('{"name":"JSONtapose","mini":true}');

  assert.equal(result.kind, "valid");
  assert.equal(
    result.kind === "valid" ? result.formattedJson : "",
    '{\n  "name": "JSONtapose",\n  "mini": true\n}'
  );
});

test("detectClipboardJson rejects invalid and empty clipboard text", () => {
  assert.equal(detectClipboardJson("{").kind, "invalid");
  assert.equal(detectClipboardJson("   ").kind, "empty");
});
