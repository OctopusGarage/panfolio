# Static hosting and a minimal Panfolio MCP adapter

Research date: 2026-11-25. Scope: feasibility and design only. No server, cloud resource or new MCP endpoint was created.

## Finding

The desired experience is feasible: users add one remote MCP URL, receive a brief cookbook guide, and let their assistant explore the existing public Markdown collection. A database, accounts, model API or application backend is unnecessary. However, a standard remote MCP endpoint still needs request-handling code. GitHub Pages alone cannot provide that endpoint.

The useful distinction is “no server to operate” versus “no server-side execution.” A small managed serverless adapter achieves the former. Pure static hosting does not achieve the latter while remaining compatible with standard remote MCP clients.

## Protocol and hosting evidence

GitHub describes Pages as static hosting and does not support server-side languages. MCP Streamable HTTP requires clients to POST protocol requests; the endpoint returns a protocol response associated with that request. Static Markdown and JSON files can be source content, but are not that protocol endpoint. [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages limitations](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [MCP transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http).

A read-only probe against the existing `https://octopusgarage.github.io/panfolio/ai/manifest.json` returned HTTP 200 for GET and HTTP 405 for POST with a `tools/list` JSON-RPC request. This verifies the hosting limitation on this deployment; no file was changed by the probe.

Serving a file named `mcp.json`, `llms.txt`, a canned tool listing or a fixed guide does not implement request routing, argument handling or request-specific replies. Browser JavaScript and a service worker run in a browser context; a remote AI service's HTTP request does not execute the site's JavaScript or become controlled by a user's service worker. A custom transport could use static files if both ends explicitly implement it, but that is not equivalent to adding a normal remote MCP URL in existing clients. The MCP specification permits custom transports without requiring client support for them. [MCP transport overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports).

Do not base compatibility solely on the newest protocol. Revision 2026-07-28 changed the transport/session model; earlier clients use initialization. Google's current troubleshooting documentation still checks `initialize` and `tools/list`. Implementation should use a maintained SDK and test the actual clients and versions. JSON responses can be used for this short read-only workflow; persistent sessions and streaming application output are not inherently required. [MCP version changes](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http), [Google troubleshooting](https://developers.google.com/connected-apps/gpc/troubleshooting).

## Why a guide-only server is insufficient for reliable cooking

A genuine MCP tool may return a short explanation and index URLs. That meets a discovery use case. But the assistant still needs a separate URL-reading capability to obtain recipes. MCP access alone does not grant arbitrary web retrieval. Panfolio's earlier failures already showed why that dependency matters.

Prefer a tiny adapter with two read-only tools:

- `get_guide(language)`: return a short usage guide, the existing category structure and the entry paths for recipes and kitchen references.
- `read_document(path)`: return the existing Markdown text for an allowlisted cookbook path, such as `zh/recipes.md`, `en/preparations/samukichi-asparagus/pork-rolls.md` or `zh/references/soy-sauce-pan.md`.

The assistant still explores the index and selects the dish itself. No server-side semantic search, recipe rewriting, planning engine or LLM call is introduced. The second tool only transports the published text through MCP, so an assistant does not have to leave that working connection to browse GitHub. Tool results can contain plain Markdown in a text content block. Explicit tools provide a dependable interaction surface; server instructions, prompts or resources alone should not be assumed to be surfaced by every host. [MCP tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).

## Deployment recommendation

Keep the public repository and generated `content/` tree as the editorial source. Deploy a separate stateless edge function that handles MCP and serves those same Markdown files. A Cloudflare Worker is one suitable managed runtime: its documented remote MCP handler supports stateless requests without Durable Objects or sessions, and an unauthenticated public endpoint is supported. That is still server-side code, not GitHub Pages execution. [Cloudflare remote MCP guide](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/).

Package the generated Markdown as read-only deployment assets so calls do not depend on GitHub fetch availability. The adapter should expose only known cookbook paths, not become an arbitrary URL fetcher. Include the source revision in responses and source links in documents. A release deploys content and protocol adapter together; the existing app and portable skill can continue independently. This is a design recommendation, not a measured performance or compatibility claim.

The managed provider requires a deployment account and has quotas and operational limits. Do not promise permanently free or unlimited service. Workers currently documents a Free allowance of 100,000 requests/day and a 10 ms CPU limit per invocation; actual SDK and asset-delivery behavior must be measured before selecting a plan. No paid resource or billing change is authorized by this research. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/).

If absolutely no server-side runtime is acceptable, continue with the already published Markdown skill and direct repository links. That remains a valid AI-readable cookbook; it should not be marketed as a standard MCP server. A local stdio adapter would move execution to the user's computer and would contradict the no-install experience, so it is not the recommendation.

## Client support: distinguish the actual products

| Product     | Current primary-source evidence                                                                                               | Qualification                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatGPT     | Custom remote MCP connections are documented; public HTTPS endpoints can be added through the current Plugins connection flow | Access varies by account/workspace. Official help distinguishes full MCP access from Pro read/fetch connections; do not promise availability to every account or mobile surface |
| Gemini Apps | Official help now documents adding a custom app using its MCP server URL in the web app, then using it on web/mobile          | Current help lists US, age, personal-account, History and English-language conditions. This is different from Gemini CLI/API                                                    |
| Gemini CLI  | Official docs support Streamable HTTP via `httpUrl`, plus other transports                                                    | A CLI configuration does not establish Gemini Apps compatibility                                                                                                                |
| Doubao Work | Volcengine's official IGA Pages MCP documentation explicitly lists Doubao Work among clients supporting remote MCP            | This establishes that named product, not every Doubao consumer app/account. No first-party evidence was established here for blanket consumer-app support                       |

Sources: [ChatGPT custom MCP](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt), [Gemini Apps custom apps](https://support.google.com/gemini/answer/17209137?hl=en-PR), [Gemini CLI](https://geminicli.com/docs/tools/mcp-server/), [Volcengine IGA Pages MCP](https://docs.volcengine.com/docs/station-wide-acceleration/use-iga-pages-mcp?lang=zh).

Google's Connected Apps registration also supports a public server without authentication. That is not a guarantee that every personal-account add flow accepts every endpoint without registration. Validate the actual intended flow. No OAuth implementation is proposed for public cookbook content unless a target client or publication process requires it. [Google registration](https://developers.google.com/connected-apps/gpc/perform-the-steps).

## Acceptance before distribution

Verify the endpoint with an MCP client rather than an ordinary browser GET. Test protocol discovery, both tools, unsupported methods, two different request IDs and invalid document paths. Test older initialization-based clients as well as the selected SDK's supported newer versions. Confirm that Chinese salmon and English asparagus-roll requests receive full actual text through MCP with generic web browsing unavailable. Preserve selected-preparation boundaries, source links and the hot-pan versus off-heat soy-sauce distinction. Finally test installation and the two cooking conversations in actual eligible ChatGPT, Gemini and Doubao Work accounts; HTTP tests and a provider template alone do not certify compatibility.

The user's objective therefore needs only a thin, managed protocol layer. It does not need another recipe backend, database, app installation or model service. A pure GitHub Pages MCP URL is not feasible under the standard transports verified in this research.
