import assert from "node:assert/strict";
import test from "node:test";

import * as jsonUtils from "./jsonUtils.ts";

test("parseJsonInput returns structured error details for invalid JSON", () => {
  assert.equal(typeof jsonUtils.parseJsonInput, "function");

  const source = '{"name":"jsontapose","items":[1,2,}';
  const result = jsonUtils.parseJsonInput(source);

  assert.equal(result.value, null);
  assert.ok(result.error);
  assert.equal(result.error?.line, 1);
  assert.ok((result.error?.column ?? 0) > 0);
});

test("buildJsonErrorPreview returns inline context around a single-line error", () => {
  assert.equal(typeof jsonUtils.buildJsonErrorPreview, "function");

  const source = '{"name":"jsontapose","items":[1,2,}';
  const parsed = jsonUtils.parseJsonInput(source);

  assert.ok(parsed.error);

  const preview = jsonUtils.buildJsonErrorPreview(source, parsed.error);

  assert.equal(preview.mode, "inline");
  assert.ok(preview.prefix.length <= 7);
  assert.ok(preview.suffix.length <= 7);
  assert.ok(preview.highlight.length >= 1);
});

test("buildJsonErrorPreview returns surrounding lines for multiline context", () => {
  assert.equal(typeof jsonUtils.buildJsonErrorPreview, "function");

  const source = `{
  "meta": {
    "name": "jsontapose",
    "items": [
      1,
      2
    ]
`;
  const parsed = jsonUtils.parseJsonInput(source);

  assert.ok(parsed.error);

  const preview = jsonUtils.buildJsonErrorPreview(source, parsed.error);

  assert.equal(preview.mode, "multiline");
  assert.ok(preview.lines.length <= 7);
  assert.ok(preview.lines.some((line) => line.isFocus));
});

test("compareJsonDocuments accepts root-level arrays and preserves array metadata", () => {
  assert.equal(typeof jsonUtils.compareJsonDocuments, "function");

  const result = jsonUtils.compareJsonDocuments(
    [
      { id: 1, name: "left" },
      { id: 2, name: "shared" },
    ],
    [
      { id: 1, name: "right" },
      { id: 2, name: "shared" },
      { id: 3, name: "added" },
    ]
  );

  assert.equal(result.leftRootType, "array");
  assert.equal(result.rightRootType, "array");
  assert.equal(result.items[0]?.isArrayItem, true);
  assert.equal(result.items[0]?.type, "changed");
  assert.equal(result.items[2]?.type, "added");
});
