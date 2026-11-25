import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";

test("public AI resources are complete, integrity checked and outside PWA precache", async ({
  request,
}) => {
  const response = await request.get("/ai/manifest.json");
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.schemaVersion).toBe(1);
  const catalogResponse = await request.get("/ai/" + manifest.catalog.path);
  const bytes = await catalogResponse.body();
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(
    manifest.catalog.sha256,
  );
  const catalog = JSON.parse(bytes.toString());
  expect(catalog.entries).toHaveLength(
    manifest.counts.recipes + manifest.counts.references,
  );
  for (const entry of catalog.entries) {
    const recordResponse = await request.get("/ai/" + entry.resource.path);
    expect(recordResponse.ok(), entry.id).toBe(true);
    const body = await recordResponse.body();
    expect(createHash("sha256").update(body).digest("hex")).toBe(
      entry.resource.sha256,
    );
    expect(JSON.parse(body.toString()).contentVersion).toBe(
      manifest.contentVersion,
    );
  }
  const worker = await (await request.get("/sw.js")).text();
  const precache = JSON.parse(worker.match(/const URLS=(\[[^;]+\]);/)![1]);
  expect(
    precache.some(
      (url: string) => url.includes("/ai/") || url.includes("/downloads/"),
    ),
  ).toBe(false);
  for (const name of ["panfolio-skill.zip", "panfolio-chatgpt-plugin.zip"]) {
    const archive = await request.get("/downloads/" + name);
    expect(archive.ok()).toBe(true);
    expect((await archive.body()).subarray(0, 2).toString()).toBe("PK");
  }
});
