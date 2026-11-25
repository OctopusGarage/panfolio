# ChatGPT skill and plugin installation

Current versions and release status are defined by [the distribution configuration](../distribution/config.json) and [GitHub Releases](https://github.com/OctopusGarage/panfolio/releases). The shared [maintenance contract](distribution-maintenance.md) explains generation and automatic GitHub publication. Existing installed plugins require an explicit update; a new GitHub release does not update a host account automatically.

## Packages and entry points

`pnpm ai:build` creates two deterministic archives from the same `skills/panfolio` directory:

| Archive                                        | Upload destination                                         | Layout                                                   |
| ---------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| `public/downloads/panfolio-skill.zip`          | Compatible skill importers; eligible ChatGPT Skills upload | `panfolio/SKILL.md`, license and UI metadata             |
| `public/downloads/panfolio-chatgpt-plugin.zip` | OpenAI plugin ZIP portal                                   | Root `plugin.json`, `skills/panfolio/`, icon and license |

Neither archive includes consumer scripts, an MCP server or a second copy of the cookbook. Skills use an already connected Panfolio MCP when available; otherwise they read repository Markdown with the host’s HTTPS text-reading tool. Neither archive grants network access or connects MCP automatically. Keep one retrieval route and content identity for each task. No terminal, Python, account, API key or app installation is required by the cooking workflow. Python remains only a maintainer-side archive build dependency.

## Install a skill

For an eligible ChatGPT account, open **Plugins → Skills → Create → Upload from your computer**, choose the new `panfolio-skill.zip`, complete its scan and install/enable it. Merely attaching a ZIP to a conversation does not install a skill. OpenAI documents eligible Business, Enterprise, Healthcare and Edu users, subject to product availability and workspace controls.

When replacing v0.1.0, confirm that the installed skill instructions reference `raw.githubusercontent.com/.../content/` and no longer show `python3` or `manifest.json`. Test in a new conversation so an old loaded workflow is not reused. Exact update controls can vary by surface; use the available skill update/replacement action rather than assuming a GitHub release updates the account automatically.

## Upload a plugin

Open <https://platform.openai.com/plugins>, choose **Upload new or existing plugin**, select the required developer identity, and upload `panfolio-chatgpt-plugin.zip`. Follow the portal's automated findings and review process. The root portable manifest carries the shared distribution version; do not wrap it inside another directory. Uploading, review and public publication are distinct stages. No account submission or approval is implied by generating the archive.

This is a skills-only package. Optional policy/contact URLs and MCP fields are omitted rather than invented. Public publication requires the applicable verified identity and attestations. Changes to the skill require uploading a revised ZIP.

## Verify the actual workflow

The GitHub workflow publishes checked-in `content/` and pins release archive links to the tested source commit. Repository/main links below follow current content. Verify both language indexes and both reported dishes through the target host's URL-reading tool:

- [Chinese recipe index](https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/recipes.md)
- [English recipe index](https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/en/recipes.md)
- [Asparagus pork rolls](https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/en/preparations/samukichi-asparagus/pork-rolls.md)
- [Crispy-skin salmon in Chinese](https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/preparations/samukichi-salmon/main.md)

Ask “Use Panfolio to guide me through asparagus pork rolls.” It should retrieve the selected preparation and begin cooking guidance, retaining its actual quantities and source. Ask “看看三文鱼怎么煎”. It should read the salmon method in Chinese, including its drying, heat control and off-heat finish, rather than generic advice.

If Raw cannot be read, the skill tries the same file once using `https://github.com/OctopusGarage/panfolio/blob/main/content/...`. It does not search repository metadata or use shell commands. The web route requires host networking. A connected MCP uses its own document tools instead. Release archive instructions rebase every linked cookbook document onto the installed content-base revision; original video URLs are unchanged. A failed read is not evidence that a recipe is missing. Actual ChatGPT installation and runtime tests remain separate from local archive/content checks.

The [AI quality evaluation](ai-quality-evaluation.md) records actual consumer traces, known source limitations, controlled simulations and unverified account-side checks. Passing package-schema tests alone does not establish recipe-answer quality.

## Maintainer workflow

After changing reviewed content, bump the AI distribution version as needed and run `pnpm sync`, then the repository release checks. Commit the generated Markdown alongside its source changes so direct Raw URLs exist. The main-branch workflow builds and publishes both revised ZIPs, their manifest, icon and checksums after successful deployment checks. OpenAI portal upload and approval remain separate. The web app's Pages deployment is separate from repository Markdown availability. Retain ownership notices: the package's MIT software license does not relicense recipe content or external media.

Primary sources, researched on 2026-11-25:

- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt): skill upload, resources, scans and workspace availability.
- [Build skills](https://developers.openai.com/plugins/build/skills): reusable instructions and supporting resources versus live-data tools.
- [Package your plugin](https://developers.openai.com/plugins/build/plugins): portable manifest and path rules.
- [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission): upload, update, review and publication.
- [Plugin submission errors](https://developers.openai.com/plugins/deploy/submission-errors): package and listing limits.
