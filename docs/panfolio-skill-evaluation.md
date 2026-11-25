# Panfolio skill implementation and evaluation

Status: locally implemented and evaluated; not yet pushed or deployed. Hosted feed/archive URLs and repository installation become available only after publication and successful Pages deployment.

## Implemented artifacts

- `skills/panfolio/`: portable consumer instructions, optional standard-library Python helper, protocol reference, optional OpenAI UI metadata and software license. No recipe/media snapshot is shipped.
- `scripts/ai-content.ts` and `scripts/build-ai.ts`: deterministic export from canonical public content. All parent/preparation bodies use the existing reviewed selectors; reference conditions and comparison notes are preserved.
- `scripts/package-skill.py`: reproducible ZIP containing only the skill folder, with no caches, source recipe files or runtime dependencies.
- `pnpm ai:build`: generates public resources and archive. The normal production build includes this step. Python helper tests are included in CI.

The current content produces 143 files: manifest, hashed catalog, text index, 44 parent recipes, 65 preparations and 31 references. The generated archive is about 8 KB. Public AI files and the archive are excluded from the PWA precache, and are not embedded in the application's JavaScript.

## Automated evidence

Feed tests check determinism, all resource hashes, category coverage, exact Chinese/English preparation body parity, original source associations and reference conditions. Archive tests compare repeated builds and inspect allowed contents. Python tests use a temporary HTTP fixture server and isolated working directories: localized output, original IDs containing periods, selected preparation identity, sibling intersection, unknown inputs, JSON errors, version pinning, bounded refresh, malformed checksums/JSON, oversized responses and redirect/path rejection.

The production browser test retrieves every public parent/reference resource through HTTP, verifies hashes/versions and confirms that `/ai/` and `/downloads/` are absent from the worker precache. Existing application tests remain release gates.

## Independent consumer forward tests

Two fresh agents received separate folders extracted from the generated ZIP and realistic requests. They were permitted to read only the installation and a local HTTP feed, not this project's source or documentation. Neither needed the React app, a project checkout, `node_modules`, an API key, package installation or file writes. Both used the optional helper and pinned subsequent lookups to the returned content version.

1. Asparagus pork rolls plus a request to use hot-pan soy sauce on salmon: the agent retrieved the rolls preparation and soy reference, used the selected ingredients/method, began only the first cooking stage, and preserved salmon's contrasting off-heat procedure. It noted that inherited parent tips include other preparations. The skill now explicitly tells agents to apply such tips only when the selected food and conditions match.
2. A two-person ribs/potato rice request, potato julienne and a one-minute sago question: the agent found chestnut/pork rice rather than inventing a matching catalog record, stated that the source does not support a quantified two-person conversion, distinguished its suggested substitution, retrieved the standalone knife lesson and explained subsequent sago resting/reboiling rather than treating the first boil as total cooking time.

These are actual consumer traces and observed behavior, not scores inferred from YAML validation. They do not certify every commercial host or model. The standard folder format was validated locally; HTTP-only access is checked at the protocol level, while the independent agents exercised the Python helper path. A native-fetch assistant can use the documented identical endpoints without executing Python. Specific vendor-host installation/UI behavior remains to be tested on that host.

## Boundaries

The helper is read-only, with no automatic personal-data access or disk cache. The software license continues to exclude remote recipe/media redistribution. Network failure or unavailable pinned versions must produce an error rather than new guessed instructions. Cooking safety and source fidelity remain grounded in the curated records; no new original-video audit is claimed by the exporter.

Final verification passed: 60 project unit tests, 16 Python helper tests, 142 Chromium/WebKit browser tests, bilingual evaluation of all 44 recipes, strict production build, skill-format validation, formatting and whitespace checks. Public URLs remain unavailable until this revision is deployed.

ChatGPT plugin packaging was added subsequently from the same skill source. The portable plugin manifest passed canonical JSON Schema validation; root layout, listing limits, asset references and shared skill byte parity are tested. Both downloadable ZIPs passed the HTTP delivery and precache exclusion browser checks. See [ChatGPT research and installation](chatgpt-plugin.md) for official sources and unverified account-side steps.
