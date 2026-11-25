import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index";
async function call(request: Request) {
  return worker.fetch(request);
}
test("worker exposes health and only the configured MCP route", async () => {
  const health = await call(new Request("http://localhost/health"));
  assert.equal(health.status, 200);
  const body = (await health.json()) as {
    documentCount: number;
    contentVersion: string;
  };
  assert.ok(Number.isInteger(body.documentCount) && body.documentCount > 0);
  assert.match(body.contentVersion, /^[a-f0-9]{64}$/);
  assert.equal(
    (await call(new Request("http://localhost/missing"))).status,
    404,
  );
});
test("worker bounds actual request bytes even without Content-Length", async () => {
  const response = await call(
    new Request("http://localhost/mcp", {
      method: "POST",
      body: "x".repeat(17000),
    }),
  );
  assert.equal(response.status, 413);
});
test("MCP endpoint rejects browser requests from unrelated Origins", async () => {
  const response = await call(
    new Request("http://localhost/mcp", {
      method: "POST",
      headers: {
        Host: "localhost",
        Origin: "https://unrelated.example",
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    }),
  );
  assert.equal(response.status, 403);
});

test("worker serves the exact shared PNG under its versioned icon path", async () => {
  const { readFile } = await import("node:fs/promises");
  const { createHash } = await import("node:crypto");
  const icon = await readFile("../public/branding/panfolio-mcp-icon.png");
  const sha = createHash("sha256").update(icon).digest("hex");
  const response = await call(new Request(`http://localhost/icons/${sha}.png`));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), icon);
  assert.match(response.headers.get("cache-control")!, /immutable/);
});

test("MCP accepts Claude's browser Origin without weakening unrelated-Origin rejection", async () => {
  const response = await call(
    new Request("http://localhost/mcp", {
      method: "POST",
      headers: {
        Host: "localhost",
        Origin: "https://claude.ai",
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 42,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "claude-origin-test", version: "1" },
        },
      }),
    }),
  );
  assert.equal(response.status, 200, await response.clone().text());
});
