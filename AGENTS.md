# Project conventions

- Use pnpm, React and strict TypeScript. Keep shared infrastructure separate from recipe content.
- Support Chinese and English for every interface action, feedback message and accessibility label. Original source recipes may remain Chinese if this is clearly disclosed.
- Preserve stable recipe IDs and source URLs. Never fabricate quantities, nutrition, timing or attribution.
- Keep personal notes out of URLs, sharing cards and telemetry. No analytics or remote account is required.
- Scope service workers, recovery and cache cleanup to this deployment. Never remove another app's data or clear local notes during recovery.
- Verify complete precache evidence before claiming offline readiness. Only reload for a confirmed activated update.
- Run `pnpm test`, `pnpm eval`, `pnpm build`, `pnpm test:e2e` and `pnpm format:check` before publishing.
- Keep repository documentation and About text in English. Keep workflow scratch files out of version control.
