# AI quality verification

Use [the scenario inventory](../tests/fixtures/ai-scenarios.json) when changing Skill instructions, host packages or MCP delivery. Current release status is in GitHub Actions and Releases; this document defines the repeatable verification method rather than retaining transient execution transcripts.

## Automated checks

- Unit tests verify source-backed scenario fixtures, generated instructions, package identity, revision-bound installation sources and setup prompt scope. Fixture checks establish evidence availability, not model-answer quality.
- MCP tests compare every bundled document and its metadata through the tool boundary, plus bilingual guides, protocol compatibility, unknown paths, request limits and allowed/rejected Origins.
- Archive checks verify portable and native Claude manifests, common Skill content and deterministic ZIPs.
- Browser tests cover all three setup methods in Chinese and English at 320, 390, 768 and 1280 pixels, accessibility, host-specific downloads, denied/pending clipboard operations, return navigation and offline instructions.
- The AI page starts with a copyable Skill installation prompt. Plugin upload and MCP are sibling methods, not nested platform/method selections. Keep package-format comparisons, account eligibility and publication procedures in maintenance documentation. Copying, downloading and connecting are distinct states; never report installation or connection success from a copy action.
- Pointer and touch returns must not create a keyboard focus frame. Keyboard navigation must retain a visible, rounded focus indicator inside the navigation target. Check tab arrow keys, stale copy feedback and 44-pixel touch targets when revising the page.
- CI deploys tested artifacts, verifies live MCP identities and retrieval, and only then publishes immutable packages.

## Setup prompt review

Keep each prompt limited to one setup method and one authoritative source or endpoint. Skill installation uses the site revision's GitHub Skill directory; manual ZIP downloads remain separate UI actions. MCP setup supplies its endpoint, transport and authentication. Both prompts preserve unrelated settings and ask the agent to read the recipe index to confirm access, with a clear explanation if unavailable. Do not embed recipe quizzes, shopping tasks, internal tool names, client command catalogs or publication procedures in installation prompts.

Browser coverage must exercise the displayed prompt and the actual copied value, successful copy feedback, denied access with selectable fallback, and selection changes while a copy is pending. Host selection must retain the corresponding package and support pointer, touch and keyboard input. Mobile manual-copy fields use at least 16-pixel text to avoid focus zoom.

This review checks prompt intent, links and UI behavior. It does not establish that every third-party account can install a Skill, upload a plugin or configure MCP. Actual host installation requires a supported environment; a browser copy operation is not such an installation.

## Model-consumer evaluation

Use fresh consumer contexts with only the extracted installation or connected MCP tools, without access to implementation files. Execute the scenario prompts and record actual document requests and response evidence. Grade document/variant selection, exact source amounts, operation order, conditions, language, attribution, uncertainty and privacy. A refusal to invent unsupported quantities can pass even when a requested exact conversion cannot be completed.

Cover staged cooking, salmon's off-heat finish versus hot-pan soy aroma, asparagus alternatives, optional shopping ingredients, sago boiling/resting/storage, knife work, unsupported scaling, components versus dishes, absent recipes, inaccessible hosts, private data, release revision propagation and source-text injection.

Treat invented quantities/sources, mixed variants or revisions, false connection claims and private-data disclosure as failures. Separate actual tool use from controlled simulations and deterministic checks. Independent model contexts do not represent different model families or commercial-host account certification.

## Known boundaries

Shared tips can discuss sibling preparations; apply only the selected method's conditions. Missing original quantities or timing require source review, not guessed completion. Native package validation does not establish successful account upload, security review or public-directory approval. Verify the exact published package inside each target account before claiming host-specific support.

Earlier dated consumer trials and investigation transcripts are available in Git history. They are not current installation instructions or a statistical reliability benchmark.
