# Panfolio skill runtime audit and Markdown delivery proposal

Date: 2026-11-25. Audited commit: `587e6a28b80d86cbf44e8887db21b521df27a313`. Published package: `panfolio-ai-v0.1.0`. This records the investigation and proposal before implementation. The subsequent v0.2.0 implementation is described in [the current design](panfolio-skill-design.md) and [evaluation](panfolio-skill-evaluation.md); no successful ChatGPT installation is claimed here.

## Conclusion

The released skill made the cooking workflow depend on generic HTTPS retrieval of a machine-oriented feed. The optional Python helper simplifies that feed protocol in a coding environment but does not supply a missing network capability. This is the wrong default interface for a broadly installable cookbook skill.

The user's preferred correction is appropriate: organize the existing content into readable Markdown, provide a small, explicit lookup index with stable links and useful aliases, and teach assistants how to select and read a dish through the skill. Consumers should not need Python, a terminal, JSON parsing or checksum commands. Author-side generation scripts may still prevent duplication; they are separate from consumer runtime requirements.

Markdown format alone does not fix inaccessible hosting. The current Markdown catalog failed through the Web tool in this investigation even though it returned HTTP 200 through local Python. Publishing and validating a usable retrieval route is part of the correction.

## Evidence and limits

| Probe                                                            | Observed result                                                                                                  | What it establishes                                                                                                   |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| User-provided ChatGPT asparagus-roll request                     | Search, repository discovery and Curl attempt ended without the recipe                                           | Real product task failed; the trace does not expose the underlying HTTP/tool error                                    |
| User-provided Chinese salmon request                             | Could not read official content and switched toward generic cooking advice                                       | A second actual recipe task failed; source-specific cooking assistance was not delivered                              |
| Local Python GET of deployed manifest, Markdown index and ZIP    | HTTP 200; manifest identifies the audited commit                                                                 | The deployed files exist and are reachable from this local execution environment                                      |
| Local helper search and retrieval for both reported dishes       | Both searches found the correct recipe; the two selected preparations were retrieved with actual YouTube sources | These dishes are present; missing content and absent English/Chinese aliases do not explain these failures            |
| Web tool opening Pages manifest, Markdown index and app root     | Each returned “not accessible via this tool”                                                                     | A retrieval-route problem is reproducible outside the user's session; the error does not identify its network cause   |
| Same Web tool opening GitHub Raw README, skill and recipe source | Readable text returned                                                                                           | Raw GitHub is a candidate alternative route, not proof of universal ChatGPT compatibility                             |
| Downloaded GitHub Release plugin inspection                      | Eight files; no cookbook records, no local index, no MCP configuration; skill bytes match repository source      | The release has no usable content fallback if generic retrieval fails                                                 |
| Deliberately denied networking in a helper diagnostic            | Exit 1 with a network error                                                                                      | Simulated negative test confirms that the helper has no network-independent path; this is not the user's actual error |

These are transport and functional observations, not invented model scores. The installed package version, exact tool inventory and Curl error in the user's ChatGPT account remain unverified. A private plugin identifier is not enough to inspect that account's installation.

## Why the workflow fails poorly

1. The skill starts with a manifest, then a 127,307-byte bilingual JSON catalog, then a selected JSON record. Discovering a dish requires multiple remote reads before the assistant can help. It can additionally fetch a parent before a child when selection is unclear.
2. The fallback changes tools but keeps the same hostname and remote dependency. A helper cannot bypass host permissions or a failed retrieval route. The `metadata.requirements` text documents a requirement; it does not grant network access.
3. The Markdown index is only a flat list of hashed JSON links. Its 12,910 bytes are readable, but following it still returns a protocol envelope rather than a focused cooking document. It lists parents rather than providing direct links to the requested child preparations.
4. There is no declared Panfolio search/read tool. A skills-only plugin supplies instructions and files; a plugin manifest does not itself create an HTTP client or an MCP tool.
5. Failure behavior preserves attribution by refusing to invent Panfolio content, which is correct, but does not accomplish the cooking task. Requiring a screenshot of a recipe already in this public collection transfers the integration failure to the user. Generic salmon advice also loses the collection's specific technique.

## Recommended simpler design

Use one maintained skill source for portable and ChatGPT plugin packages. Remove the consumer Python helper and script examples from that distribution when the replacement is implemented. Do not introduce MCP as a prerequisite for this small public cookbook.

### Content and lookup

Generate human-readable Markdown from the existing reviewed recipe and kitchen-reference data, preserving stable recipe and preparation IDs. Use a source-controlled, public content tree so that both GitHub-rendered pages and GitHub Raw can serve the same generated text. Keep generated cookbook content distinct from English-only developer documentation. Keep one authoritative recipe dataset; do not manually maintain a second cookbook.

A compact public Markdown index in the repository should include localized names, actual aliases, the existing three recipe categories and explicit detail URLs. The skill should link directly to its GitHub Raw URL. Keep the index with the published content rather than requiring an installed copy of the full catalog to remain current. Kitchen references have their own index section, not a fourth recipe category. Reuse reviewed ingredient aliases for lookup; do not resurrect removed occasion, season or equipment taxonomies or infer new dietary claims.

For a specific request, the assistant finds the title in this small index and reads the matching Markdown document directly. Examples of proposed stable content paths:

```text
content/index.md
content/zh/preparations/samukichi-asparagus/pork-rolls.md
content/en/preparations/samukichi-asparagus/pork-rolls.md
content/zh/preparations/samukichi-salmon/main.md
content/en/preparations/samukichi-salmon/main.md
content/zh/references/soy-sauce-pan.md
```

The proposed entry point is `https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/index.md`. Its detail links should be absolute, not app hash routes such as `#samukichi-salmon`. For example, a proposed salmon detail link is `https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/preparations/samukichi-salmon/main.md`. A `.md` suffix is useful; readable text content matters more than whether the HTTP content type is `text/plain` or `text/markdown`. `main` follows published repository updates; a session should keep using the document it already read. Commit-pinned links can support reproducibility without requiring the user or model to calculate hashes.

These paths are a proposal and do not exist yet. Independent documents for actual preparations avoid mixing asparagus-only ingredients with pork-roll ingredients. Single-preparation recipes need only their one preparation document. Category browsing can link to the same records rather than duplicate content.

Every detail document should expose its title, category where applicable, parent/preparation identity, applicability, ingredients, ordered method, necessary explanations, tips and real source links. Kitchen references should preserve scope, operations, reasons, mistakes and limits. Keep Chinese and English in separate detail files to avoid returning both languages for every request. Content/version metadata can be unobtrusive, readable text; model-side byte hashing should not be part of an ordinary cooking conversation.

### Access and skill instructions

Use explicit absolute HTTPS links in the repository index. Make GitHub Raw the primary content route and test GitHub's rendered file page as another presentation of the same public file. The consumer skill should not depend on GitHub Pages. These routes are not independent guarantees: both still depend on host networking. Do not invent a live fallback URL before publishing its content.

Tell the assistant to open the repository Markdown index, choose the user's intended preparation, open its direct Markdown link, then answer from that document. For follow-up turns, reuse the index and content already read rather than rediscovering them. Do not begin with web search for the repository, require manifest discovery, invoke Curl/Python, or repeatedly retry a route already known to fail. Allow one documented alternative route before a short, accurate limitation message. Clearly separate “cannot retrieve this source” from “no matching recipe exists.”

If the host cannot retrieve either route, online documentation alone cannot complete the task. A later self-contained content bundle is a separate option if needed; do not promise universal offline support from a link-based skill. Preserve recipe/media ownership notices if packaged content is ever introduced; the software's MIT license does not relicense the cookbook.

## Evaluation required before the next compatibility claim

| Scenario                                        | Required result                                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| English asparagus pork-roll request             | Reads the pork-roll document, preserves quantities and balsamic method, gives the first cooking stage without asking for the existing recipe  |
| Chinese salmon request                          | Reads the salmon document in Chinese; preserves salt/drying, heat control and off-heat butter finish; does not replace it with generic advice |
| Ambiguous asparagus request                     | Presents actual preparation choices before using a child recipe                                                                               |
| Soy sauce explanation                           | Preserves hot-pan versus off-heat conditions and the salmon comparison                                                                        |
| One retrieval route fails                       | Uses the published alternative without shell execution or broad web search                                                                    |
| No executor or Python                           | Both supported dish tasks still complete using readable files and links                                                                       |
| All retrieval routes unavailable                | Reports source access failure, avoids invented attribution and avoids repeated tool attempts                                                  |
| Unknown dish or unsupported quantity conversion | Distinguishes no match from a network error and preserves source boundaries                                                                   |

Validate generated Markdown against the existing reviewed preparation selector and bilingual data. Then test the extracted package and the actually installed ChatGPT plugin using ordinary prompts. Keep simulated transport tests, local HTTP tests, model behavior tests and target-account tests distinct. Previous passing application/browser tests did not cover the user-facing ChatGPT retrieval environment; those results remain valid only for their narrower scope.

At the end of this investigation, no production skill, package version or release had been changed. A subsequent implementation updates the local skill and package to v0.2.0; publication and account-side validation are separate.

## Primary sources

- [OpenAI: Build skills](https://developers.openai.com/plugins/build/skills): instructions and supporting files versus live-data tools; skills-only workflows can use packaged resources.
- [OpenAI: Build an MCP server](https://developers.openai.com/plugins/build/mcp-server): servers define callable tools for live data. This explains the architectural distinction, not a requirement to add MCP here.
- [OpenAI: Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt): uploaded skills, supporting resources, scans and product availability.
- [OpenAI: Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission): package changes require a new ZIP; adding MCP to an existing skills-only plugin is not currently supported. This would matter only if a later design chooses MCP.
- [Released Panfolio package](https://github.com/OctopusGarage/panfolio/releases/tag/panfolio-ai-v0.1.0), [skill](https://github.com/OctopusGarage/panfolio/blob/587e6a28b80d86cbf44e8887db21b521df27a313/skills/panfolio/SKILL.md), [helper](https://github.com/OctopusGarage/panfolio/blob/587e6a28b80d86cbf44e8887db21b521df27a313/skills/panfolio/scripts/panfolio.py), [exporter](https://github.com/OctopusGarage/panfolio/blob/587e6a28b80d86cbf44e8887db21b521df27a313/scripts/ai-content.ts) and [license](https://github.com/OctopusGarage/panfolio/blob/587e6a28b80d86cbf44e8887db21b521df27a313/LICENSE): implementation evidence and ownership boundaries.

Responses API hosted-shell network restrictions were reviewed but are not treated as proof of this ChatGPT session's permissions; these are different product surfaces.
