# ChatGPT plugin packaging and installation

Research checked against OpenAI documentation on 2026-11-25. Product availability and workspace controls can change.

## Two packages, one skill

`pnpm ai:build` produces both archives from the same `skills/panfolio` source:

| Archive                                        | Intended entry point                                          | Archive layout                                                       |
| ---------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| `public/downloads/panfolio-skill.zip`          | Compatible skill importers, including ChatGPT's Skills upload | `panfolio/SKILL.md` and supporting files                             |
| `public/downloads/panfolio-chatgpt-plugin.zip` | Plugin ZIP upload in the OpenAI plugin developer portal       | Root `plugin.json`, `skills/panfolio/`, `assets/icon.png`, `LICENSE` |

The plugin manifest lives in `plugins/panfolio/plugin.json`. Its skill directory and icon are assembled at build time; do not maintain a second copy of the skill. The manifest uses the recommended portable Agent Plugins format, with OpenAI presentation metadata under `extensions.com.openai`. No MCP server, registered app mapping, lifecycle hook, credentials or account integration is included. MIT covers the package code and instructions; it does not relicense remote recipes or media.

## Install for personal or workspace use

For an eligible ChatGPT account, open **Plugins → Skills → Create → Upload from your computer** and select **panfolio-skill.zip**. Wait for the uploaded skill scan, review any findings, then install/enable it and test in a new conversation. Merely attaching a ZIP to an ordinary chat is not the documented installation flow.

OpenAI currently lists eligible Business, Enterprise, Healthcare and Edu accounts, subject to availability and administrator settings. Do not promise this entry point for every account or plan. A missing upload action can be an availability or workspace permission issue.

Try: “Use Panfolio to guide me through asparagus pork rolls.” Confirm that it retrieves the public feed, selects the pork-roll preparation and includes the actual source URL. Test a kitchen reference separately: “Explain when to pour soy sauce around a hot pan.” The answer must preserve the difference between hot-pan aromatics and off-heat butter-soy sauce.

## Upload a complete plugin package

For plugin distribution, open <https://platform.openai.com/plugins>, create a plugin, choose the skills-only ZIP flow, and upload **panfolio-chatgpt-plugin.zip**. This is separate from the Skills upload above. Follow the portal's metadata, identity and scan requirements. Upload validation, review and public publication are separate stages; creating this artifact does not submit or publish anything. Public directory submission requires a verified developer or business identity and policy attestations.

The ZIP places `plugin.json` directly at its root. Do not wrap it in another folder or upload the standalone skill ZIP as if it were the full plugin. Listing metadata stays within documented final-submission text limits. Optional policy/contact URLs are omitted rather than invented. Public approval and account-side installation remain unverified until performed in the target account.

## Runtime requirements and deployment dependency

The workflow needs a host tool capable of retrieving HTTPS JSON. A skill package provides instructions and resources; it does not grant network tools. The Python standard-library helper is optional and only used where execution and network access are available. It is not a required local program, so the plugin is not marked desktop-only. If neither native HTTPS retrieval nor a network-enabled executor is available, the skill explains that limitation instead of inventing cookbook content.

The recipes stay on the public Panfolio feed, beginning at <https://octopusgarage.github.io/panfolio/ai/manifest.json>. That feed and the download URLs become available only after this revision is deployed. A local build passing does not establish public availability. Before distributing, verify the public manifest, its hashed catalog and a selected preparation record; then perform an actual account upload and cooking conversation. Do not report a successful ChatGPT installation based on local ZIP checks.

## Evidence and maintenance

Local tests check deterministic packaging, root placement, shared skill byte parity, icon paths, listing limits, no remote recipe payloads, and serving both ZIPs outside the PWA precache. Existing helper and feed tests cover content integrity, preparation boundaries, errors and version pinning. These checks do not reproduce OpenAI's official scans.

Increase the plugin semantic version for a published package revision. Rebuild both archives whenever the shared skill changes. No MCP is needed for the current read-only public-feed design. If a future design needs guaranteed structured retrieval through MCP, investigate and test that integration before promising it: current submission documentation warns that an MCP integration cannot simply be added later to an existing skills-only plugin.

Primary sources:

- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt): eligible accounts, Skills upload, scans and workspace controls.
- [Package your plugin](https://developers.openai.com/plugins/build/plugins): root portable manifest, skill discovery and path rules.
- [Build skills](https://developers.openai.com/plugins/build/skills): instructions, resources and optional MCP dependencies.
- [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission): ZIP upload, identity, review and publication.
- [Plugin submission errors](https://developers.openai.com/plugins/deploy/submission-errors): final listing limits and upload versus submission validation.
- [Desktop-only plugins](https://developers.openai.com/plugins/deploy/desktop-only): required local execution and the desktop-only flag.

## Local verification record

The generated manifest passed validation against the canonical Agent Plugins 1.0.0 JSON Schema downloaded from its declared `$schema` URL. Repeated ZIP builds were byte-identical; the plugin's skill files matched the standalone source byte for byte. Project unit tests passed (60), Python helper tests passed (16), Chromium/WebKit browser tests passed (142), all 44 recipes passed the content evaluation, and production build and formatting checks passed. The public feed check returned HTTP 503 during this research session; public runtime availability has not been verified. No package was uploaded to a ChatGPT account or submitted to the plugin directory.
