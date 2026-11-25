import test from "node:test";
import assert from "node:assert/strict";
import { releaseDecision } from "../scripts/release-policy";
const current = {
  version: "0.3.0",
  fingerprint: "a".repeat(64),
  sourceRevision: "b".repeat(40),
};
test("new versions publish, identical public releases skip, and drafts resume", () => {
  assert.equal(releaseDecision(current, null), "create");
  assert.equal(releaseDecision(current, current), "skip");
  assert.equal(releaseDecision(current, current, true), "resume");
  assert.equal(
    releaseDecision({ ...current, sourceRevision: "c".repeat(40) }, current),
    "skip",
  );
});
test("existing release inputs cannot change silently", () => {
  assert.throws(
    () => releaseDecision({ ...current, fingerprint: "d".repeat(64) }, current),
    /Bump distribution/,
  );
  assert.throws(
    () => releaseDecision({ ...current, version: "0.4.0" }, current),
    /Bump distribution/,
  );
});
