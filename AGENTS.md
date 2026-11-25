# Project conventions

- Use pnpm, React and strict TypeScript. Keep shared infrastructure separate from recipe content.
- Support Chinese and English for every interface action, feedback message and accessibility label. New or substantially revised recipes and kitchen references must provide complete Chinese and English content.
- Follow [Discovery maintenance](docs/discovery-guide.md) when changing categories, preparations, search or kitchen references.
- Preserve stable recipe IDs and source URLs. Never fabricate quantities, nutrition, timing or attribution.
- Keep personal notes out of URLs, sharing cards and telemetry. No analytics or remote account is required.
- Scope service workers, recovery and cache cleanup to this deployment. Never remove another app's data or clear local notes during recovery.
- Verify complete precache evidence before claiming offline readiness. Only reload for a confirmed activated update.
- Run `pnpm test`, `pnpm eval`, `pnpm build`, `pnpm test:e2e` and `pnpm format:check` before publishing.
- Keep repository documentation and About text in English. Keep workflow scratch files out of version control.

## Recipe and kitchen-reference work

Before adding or revising recipes, extracting cooking knowledge, or generating recipe covers, read [Recipe workflow](docs/recipe-workflow.md). Follow its task-specific links to the content, kitchen-reference and visual standards. These are standing project requirements; users do not need to repeat them.

- Explain necessary operations, doneness cues, reasons and source counterexamples clearly; do not shorten at the expense of clarity.
- Keep extraction commentary and missing-source disclaimers out of reader-facing recipes. Preserve uncertainty in editorial records without inventing facts.
- Extract reusable knowledge into Kitchen essentials while retaining complete recipe steps and tips. State applicability and exceptions.
- Reader-facing references for the video-derived workflow use the corresponding original YouTube videos only. Preserve source provenance and stable IDs in the underlying records.
- New recipe entries should include a matching source-informed photographic cover with natural food texture, using the existing image pipeline. Reuse suitable existing covers during text-only revisions.
- Finish authorized implementation and verification without asking users to reconfirm these defaults. Deployment requires authorization from the current task or an already established instruction; do not infer it from content editing alone.

## AI distribution maintenance

- Use `distribution/config.json` for the shared Skill/plugin/MCP version and target account. Edit cooking rules only in `distribution/guidance.json`; generated channel outputs must not be hand-maintained.
- Run `pnpm sync` after canonical content, guidance, branding or release-input changes, then `pnpm distribution:check`, `pnpm docs:check`, and MCP checks alongside the app release gates.
- Bump the AI distribution version when published release inputs change. Never overwrite a published release's assets or retag it. Read `docs/distribution-maintenance.md` before changing release/deployment behavior.
- Preserve the dedicated OctopusGarage Cloudflare account and unrelated account prefixes. Deployment credentials belong only in GitHub Actions secrets or the operator's authorized credential store.
