import test from "node:test";
import assert from "node:assert/strict";
import { createMcpHandler } from "agents/mcp/server";
import { createServer } from "../src/server";
import cookbook from "../generated/cookbook.json" with { type: "json" };
const handler = createMcpHandler(createServer, {
  responseMode: "json",
  legacy: "stateless",
  allowedOriginHostnames: [
    "chatgpt.com",
    "gemini.google.com",
    "www.doubao.com",
    "doubao.com",
  ],
});
async function rpc(
  id: number,
  method: string,
  params: Record<string, unknown>,
  version = "2025-03-26",
) {
  const modern = version === "2026-07-28";
  const body = {
    jsonrpc: "2.0",
    id,
    method,
    params: modern
      ? {
          ...params,
          _meta: {
            "io.modelcontextprotocol/protocolVersion": version,
            "io.modelcontextprotocol/clientInfo": {
              name: "panfolio-test",
              version: "1.0.0",
            },
            "io.modelcontextprotocol/clientCapabilities": {},
          },
        }
      : params,
  };
  const headers: Record<string, string> = {
    Host: "localhost",
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    "MCP-Protocol-Version": version,
  };
  if (modern) {
    headers["Mcp-Method"] = method;
    if (method === "tools/call") headers["Mcp-Name"] = String(params.name);
  }
  const response = await handler.fetch(
    new Request("http://localhost/mcp", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
  );
  assert.equal(response.status, 200, await response.clone().text());
  const text = await response.text();
  const payload = response.headers
    .get("content-type")
    ?.includes("text/event-stream")
    ? text
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => JSON.parse(line.slice(5)))
        .find((message) => message.id === id)
    : JSON.parse(text);
  const result = payload as {
    id: number;
    result: {
      tools?: { name: string }[];
      content?: { text: string }[];
      isError?: boolean;
      structuredContent?: Record<string, unknown>;
    };
    error?: unknown;
  };
  assert.equal(result.id, id);
  assert.ok(!result.error, JSON.stringify(result.error));
  return result.result;
}
test("2025 client initializes, discovers exactly two read-only tools and retrieves both reported dishes", async () => {
  await rpc(1, "initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "test", version: "1" },
  });
  const list = await rpc(2, "tools/list", {});
  assert.deepEqual(list.tools?.map((t) => t.name).sort(), [
    "get_guide",
    "read_document",
  ]);
  const guide = await rpc(3, "tools/call", {
    name: "get_guide",
    arguments: { language: "zh" },
  });
  assert.match(guide.content![0].text, /zh\/recipes.md/);
  for (const [path, pattern] of [
    ["en/preparations/samukichi-asparagus/pork-rolls.md", /3 asparagus spears/],
    ["zh/preparations/samukichi-salmon/main.md", /关火/],
  ] as const) {
    const detail = await rpc(4, "tools/call", {
      name: "read_document",
      arguments: { path },
    });
    assert.match(detail.content![0].text, pattern);
  }
  const bad = await rpc(5, "tools/call", {
    name: "read_document",
    arguments: { path: "../LICENSE" },
  });
  assert.equal(bad.isError, true);
});
test("2026 stateless client works without initialization and preserves concurrent request IDs", async () => {
  const results = await Promise.all(
    [21, 22].map((id) =>
      rpc(
        id,
        "tools/call",
        {
          name: "read_document",
          arguments: { path: "en/references/soy-sauce-pan.md" },
        },
        "2026-07-28",
      ),
    ),
  );
  for (const result of results)
    assert.match(result.content![0].text, /salmon/i);
});

// Complete transport coverage; this is not a score for model answers.
test("every bundled document survives the actual MCP tool boundary with its identity", async () => {
  let id = 100;
  for (const [path, expected] of Object.entries(cookbook.files)) {
    const result = await rpc(
      id++,
      "tools/call",
      {
        name: "read_document",
        arguments: { path },
      },
      "2026-07-28",
    );
    assert.ok(!result.isError, path);
    assert.equal(result.content?.[0].text, expected, path);
    assert.equal(result.structuredContent?.path, path);
    for (const key of [
      "version",
      "contentVersion",
      "guidanceVersion",
      "sourceRevision",
      "fingerprint",
    ] as const)
      assert.equal(
        result.structuredContent?.[key],
        cookbook[key],
        `${path}: ${key}`,
      );
  }
});
