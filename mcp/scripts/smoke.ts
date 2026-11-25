import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import config from "../../distribution/config.json" with { type: "json" };
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
const endpoint = process.argv[2] || config.mcpEndpoint;
const manifestPath = process.argv[3];
const expected = manifestPath
  ? JSON.parse(
      await readFile(
        resolve(
          fileURLToPath(new URL("../../", import.meta.url).href),
          manifestPath,
        ),
        "utf8",
      ),
    )
  : null;
if (
  !endpoint ||
  !(
    new URL(endpoint).protocol === "https:" ||
    ["localhost", "127.0.0.1"].includes(new URL(endpoint).hostname)
  )
)
  throw Error("Provide an HTTPS MCP endpoint or a local test URL");
const client = new Client({
  name: "panfolio-release-check",
  version: config.version,
});
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
  if (expected) {
    assert.equal(client.getServerVersion()?.version, expected.version);
    const healthResponse = await fetch(new URL("/health", endpoint));
    assert.equal(healthResponse.status, 200);
    const health = (await healthResponse.json()) as Record<string, unknown>;
    for (const key of [
      "version",
      "contentVersion",
      "guidanceVersion",
      "sourceRevision",
      "fingerprint",
    ])
      assert.equal(
        health[key],
        expected[key],
        `Deployed ${key} differs from the release`,
      );
    const iconResponse = await fetch(new URL("/icon.png", endpoint));
    assert.equal(iconResponse.status, 200);
    const icon = new Uint8Array(await iconResponse.arrayBuffer());
    assert.equal(
      createHash("sha256").update(icon).digest("hex"),
      expected.iconSha256,
    );
  }
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((t) => t.name).sort(), [
    "get_guide",
    "read_document",
  ]);
  for (const language of ["zh", "en"]) {
    const guide = await client.callTool({
      name: "get_guide",
      arguments: { language },
    });
    assert.ok(!guide.isError);
  }
  for (const [path, pattern] of [
    ["en/preparations/samukichi-asparagus/pork-rolls.md", /3 asparagus spears/],
    ["zh/preparations/samukichi-salmon/main.md", /关火/],
    ["zh/references/soy-sauce-pan.md", /不采用热锅边增香/],
  ] as const) {
    const result = await client.callTool({
      name: "read_document",
      arguments: { path },
    });
    assert.ok(!result.isError);
    if (expected)
      for (const key of [
        "version",
        "contentVersion",
        "guidanceVersion",
        "sourceRevision",
        "fingerprint",
      ])
        assert.equal(
          (result.structuredContent as Record<string, unknown> | undefined)?.[
            key
          ],
          expected[key],
        );
    const text = result.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n");
    assert.match(text, pattern);
    console.log("Verified through official MCP client:", path);
  }
  const invalid = await client.callTool({
    name: "read_document",
    arguments: { path: "../LICENSE" },
  });
  assert.equal(invalid.isError, true);
  console.log(
    "MCP discovery, guides, actual documents and invalid-path handling passed.",
  );
} finally {
  await client.close();
}
