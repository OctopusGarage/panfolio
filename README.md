# Panfolio

[![Build and deploy](https://github.com/OctopusGarage/panfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/OctopusGarage/panfolio/actions/workflows/deploy.yml)
[![AI packages](https://img.shields.io/github/v/release/OctopusGarage/panfolio?label=AI%20packages&color=356354)](https://github.com/OctopusGarage/panfolio/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-356354)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-English%20%2F%20中文-52675a)](https://octopusgarage.github.io/panfolio/)
[![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP-356354)](docs/mcp-server.md)

A bilingual cookbook and personal kitchen notebook, available as a web app and through your own AI assistant.

[Open the app](https://octopusgarage.github.io/panfolio/) · [AI setup guide](https://octopusgarage.github.io/panfolio/#ai) · [Download AI packages](https://github.com/OctopusGarage/panfolio/releases) · [Documentation](docs/README.md)

## Cook, learn and keep notes

Browse Chinese recipes, the Japanese chef series, Desserts and Drinks. Search dishes and ingredients, choose a specific preparation, save favorites and record cooking notes. Kitchen essentials explains reusable handling, storage, knife work, heat and seasoning techniques with their conditions and exceptions.

Chinese and English cover the interface and cookbook. Recipes retain source quantities, necessary explanations and original video links. Source videos load on request and require connectivity. After confirmed caching, bundled recipe text works offline; viewed photos are cached on demand. Favorites and notes stay on your device, with JSON export/import for backups and no account or cloud sync.

## Use Panfolio in your AI

Open the app's **AI** destination and copy the installation prompt to your agent. Skill installation is the default; plugin upload and remote MCP are also available.

| Method                        | Use                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `panfolio-plugin-chatgpt.zip` | Portable plugin for eligible ChatGPT workspace uploads or OpenAI public submission |
| `panfolio-plugin-claude.zip`  | Native Claude plugin with `.claude-plugin/plugin.json`                             |
| `panfolio-skill.zip`          | Standalone Skill for compatible agent installers and eligible Skill importers      |
| Remote MCP                    | Read complete cookbook documents through a connected assistant                     |

Host formats differ; one manifest is not advertised as universally accepted. Installation availability depends on the host and account/workspace controls. Uploading to a workspace, installing a Skill and publishing to a public directory are separate operations.

**MCP endpoint:** `https://panfolio-mcp.octopusgarage.workers.dev/mcp`

**Transport:** Streamable HTTP · **Authentication:** none

A standalone Skill reads the public [Markdown cookbook](content/index.md) or already connected Panfolio MCP tools. Consumers need no Panfolio app, Python runtime or API key. Try “Use Panfolio to guide me through asparagus pork rolls” or “看看三文鱼怎么煎”.

See [ChatGPT installation](docs/chatgpt-plugin.md), [Claude installation](docs/claude-plugin.md) and [MCP configuration](docs/mcp-server.md). Package checks and SDK tests do not certify every installed client account; [evaluation evidence](docs/ai-quality-evaluation.md) distinguishes observed behavior from simulations.

## Develop

Use Node.js 24, pnpm 10 and Python 3.9+ for maintainer builds. Python is only used for archive generation/tests; consumers do not run it.

```sh
pnpm install --frozen-lockfile
pnpm --dir mcp install --frozen-lockfile
pnpm dev
```

Before publication:

```sh
pnpm sync
pnpm distribution:check
pnpm docs:check
pnpm test
pnpm eval
pnpm mcp:test
pnpm mcp:build
pnpm build
pnpm exec playwright install --with-deps chromium webkit
pnpm test:e2e
pnpm format:check
```

Pushes to `main` automatically validate, deploy Pages and the tested MCP build, verify deployed identities, then publish versioned packages. No manual tag is required. Published release inputs must not change under the same AI version. See [distribution maintenance](docs/distribution-maintenance.md) for credentials, retries and immutable releases.

## Repository map

| Directory       | Responsibility                                                              |
| --------------- | --------------------------------------------------------------------------- |
| `src/`          | React app, canonical recipe/reference records and preparation selectors     |
| `content/`      | Generated, checked-in bilingual Markdown for AI readers                     |
| `distribution/` | AI release configuration, guidance, branding and generated plugin manifests |
| `skills/`       | Generated consumer Skill instructions                                       |
| `mcp/`          | Isolated Cloudflare Worker, SDK dependencies and protocol tests             |
| `scripts/`      | Maintainer generators, validation, packaging and release tooling            |
| `tests/`        | Automated regression checks and editorial evaluation data                   |
| `public/`       | Web assets, original recipe images and exported branding                    |
| `docs/`         | Maintained guides, architecture and dated research/audit evidence           |

Build output, dependencies, generated ZIPs and local workflow scratch files are ignored. Do not edit generated cookbook/channel files independently. The legacy JSON feed remains for older released clients; current Skill usage follows Markdown.

## Maintain content and infrastructure

Read [Recipe workflow](docs/recipe-workflow.md) before adding recipes, extracting techniques or generating covers. Preserve stable IDs and provenance, provide complete bilingual content, and never invent quantities or timing. Follow [Discovery maintenance](docs/discovery-guide.md) for categories, preparations and search.

Shared AI changes start in `distribution/config.json` and `distribution/guidance.json`; `pnpm sync` regenerates the channels. Keep the dedicated Cloudflare account and unrelated services unchanged. Service workers and recovery remain deployment-scoped and preserve personal notes.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [documentation guide](docs/README.md). Report reproducible bugs through GitHub Issues; follow [SECURITY.md](SECURITY.md) for vulnerabilities.

## License

Application code is [MIT licensed](LICENSE). Recipe text, source videos and external media retain their respective ownership.
