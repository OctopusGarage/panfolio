import test from "node:test";
import assert from "node:assert/strict";
import cases from "./fixtures/ai-scenarios.json";
import { createMarkdownCookbook } from "../scripts/markdown-content";

// These validate scenario fixtures/source availability, not model answers.
const documents = createMarkdownCookbook();
for (const scenario of cases)
  test(`AI scenario evidence: ${scenario.id}`, () => {
    assert.ok(scenario.prompt && scenario.rubric);
    const evidence = scenario.documents
      .map((path) => {
        assert.ok(Object.hasOwn(documents, path), path);
        return documents[path];
      })
      .join("\n");
    for (const fact of scenario.sourceFacts)
      assert.ok(evidence.includes(fact), `${scenario.id}: ${fact}`);
  });
