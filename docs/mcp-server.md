# Panfolio remote MCP server

The read-only Cloudflare Worker exposes `/mcp` through Streamable HTTP. Its current deployed endpoint is:

```text
https://panfolio-mcp.octopusgarage.workers.dev/mcp
```

The service is deployed in the dedicated **OctopusGarage** Cloudflare resource account selected in `distribution/config.json`. A login can administer multiple resource accounts; the account ID, rather than the login email, selects this deployment. Account boundaries and credentials are documented in [distribution maintenance](distribution-maintenance.md).

## Connect

In an AI client that supports custom remote MCP, add the complete endpoint URL, select Streamable HTTP if asked, and select no authentication. This public cookbook requires no API key, login or local software installation. Availability depends on the specific client, plan, region and workspace. ChatGPT, Claude, Gemini Apps/CLI and Doubao Work have different connection interfaces; successful SDK tests do not certify an individual account's installation.

For clients that document a Streamable HTTP `mcpServers.<name>.url` field, the configuration is below. This is not a universal schema; use the target client’s documented field names:

```json
{
  "mcpServers": {
    "panfolio": {
      "url": "https://panfolio-mcp.octopusgarage.workers.dev/mcp"
    }
  }
}
```

Gemini CLI uses `httpUrl` for Streamable HTTP instead of this generic `url` field. A browser GET of `/mcp` is not a protocol test; `/health` exposes service and content metadata.

Try “Use Panfolio to guide me through asparagus pork rolls” or “看看三文鱼怎么煎”. Both tasks can be completed through MCP alone, without the assistant opening GitHub or executing a shell command.

## Configuration icon

Upload [the 512×512 Panfolio MCP PNG](../public/branding/panfolio-mcp-icon.png) when a client asks for an icon or logo. A [128×128 variant](../public/branding/panfolio-mcp-icon-128.png) and the [tracked source and export instructions](../distribution/branding/panfolio-mcp/README.md) are also available. The published icon is also available at <https://panfolio-mcp.octopusgarage.workers.dev/icon.png>. The Worker advertises an immutable hash URL for the same bytes. A candidate artwork change is available publicly only after its deployment; see the release manifest for the matching version.

## Tools and content

- `get_guide(language)`: short Chinese/English usage instructions and starting index paths.
- `read_document(path)`: the complete text of one allowlisted cookbook document, with content version and source revision metadata.

The guide names `zh/recipes.md`, `en/recipes.md` and the corresponding `references.md` indexes. Read a matching preparation or reference using its path. In a linked Raw URL, the portion after `/content/` is the document path. The MCP client should use `read_document` for that path, not a separate browser tool.

All 285 current Markdown files are bundled at build time. Requests make no external content fetches, no model calls and no storage writes. There is no database, account system, Durable Object or private browser-data access. The assistant does the selection and explanation; the adapter only serves the existing reviewed text. Invalid paths, arbitrary URLs and traversal return a tool error. The endpoint limits actual request bytes to 16 KiB. Browser Origin validation allows the named client origins, while non-browser requests without Origin remain supported.

The software MIT license does not relicense recipe text or external media. Source links and preparation boundaries remain in the generated documents. A cooking response must preserve those boundaries, including salmon's off-heat finish versus hot-pan soy-sauce aroma.

## Maintain and deploy

The MCP package is isolated under `mcp/`, with its own lockfile so the React app does not bundle MCP libraries. Use Node.js 24, pnpm 10 and the existing repository preparation workflow. Versions, the endpoint and the dedicated account ID come from `distribution/config.json`.

```sh
pnpm --dir mcp install --frozen-lockfile
pnpm sync
pnpm mcp:test
pnpm mcp:build
```

The main-branch workflow deploys the exact tested Cloudflare Build Output with `cf deploy --prebuilt --mode production`, using the scoped `CLOUDFLARE_API_TOKEN` GitHub secret. It then verifies the official MCP client against the release manifest before allowing GitHub publication. PR jobs do not receive that credential. See [distribution maintenance](distribution-maintenance.md) for complete commands, account boundaries, rotation and reruns.

MCP health and tool results report the shared version, source revision, cookbook hash, guidance hash and release fingerprint. The common icon is served at `/icon.png` and its immutable hash URL and is advertised in server metadata. Initial deployments used the user-authorized Chrome session because the connected Cloudflare app was scoped to a different account; ongoing deployment is handled by GitHub Actions without stored browser cookies.

## Verification evidence

Dedicated tests cover: 2025 initialization/discovery/read behavior, 2026 stateless requests with concurrent IDs, bilingual guides, actual scoped dishes, allowlisted paths, health/routing, real-byte payload limits and Origin rejection. Strict MCP TypeScript and `cf build` passed. The official MCP TypeScript client then connected to the local Cloudflare Workers runtime and to the public deployed endpoint, discovered exactly two tools, read both reported dishes and the soy-sauce comparison, and verified invalid-path errors. Shared guidance and icon parity tests now supplement these cases.

The local network resolves the Workers hostname incorrectly on a direct Node connection. Using the existing environment proxy (`NODE_USE_ENV_PROXY=1` on this Node version) allowed the same official client's public test to pass. This is an operator-side network detail, not an end-user requirement or a change to the service.

An operator can repeat the public test with:

```sh
pnpm mcp:smoke https://panfolio-mcp.octopusgarage.workers.dev/mcp
```

This is a maintenance verification command, not required for people adding the MCP URL to their AI client. See the [AI quality evaluation](ai-quality-evaluation.md) for dated model-consumer results and regression evidence. The suite now exercises every bundled document through the MCP protocol boundary, in addition to targeted scenarios. Actual installed-account ChatGPT/Gemini/Doubao conversations remain separate tests; no such account-side success is claimed.

The app’s AI guide also includes Claude plugin upload and custom remote-connector instructions. Browser Origin validation includes `claude.ai`; requests without Origin continue to work, and unrelated Origins remain rejected. This transport support is not a claim that a particular Claude account has passed installation.
