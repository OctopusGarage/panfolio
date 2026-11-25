import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  distributionFiles,
  distributionIdentity,
  cookingGuidance,
  config,
} from "../scripts/distribution";
test("shared distribution outputs and identity are deterministic and current", async () => {
  const files = await distributionFiles();
  assert.deepEqual(files, await distributionFiles());
  for (const [path, body] of Object.entries(files))
    assert.deepEqual(await readFile(path), Buffer.from(body), path);
  const identity = await distributionIdentity();
  assert.equal(identity.version, config.version);
  for (const key of [
    "contentVersion",
    "guidanceVersion",
    "iconSha256",
    "fingerprint",
  ] as const)
    assert.match(identity[key], /^[a-f0-9]{64}$/);
});
test("both languages retain shared method and attribution rules", () => {
  for (const lang of ["zh", "en"] as const) {
    const guide = cookingGuidance(lang);
    assert.match(guide, lang === "zh" ? /关火/ : /off-heat/);
    assert.match(guide, lang === "zh" ? /来源/ : /source/);
    assert.match(guide, lang === "zh" ? /做法/ : /preparation/);
  }
});
