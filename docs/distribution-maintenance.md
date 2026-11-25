# AI distribution maintenance

This is the current operational contract for the portable Skill, host-specific plugins and Cloudflare MCP. Version and endpoint values live in [the distribution configuration](../distribution/config.json), not in this guide. Historical reports describe earlier implementations and are not release instructions.

## Sources of truth

| Concern                         | Editable source                                                            | Derived outputs                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Recipe and reference text       | Reviewed `src/` content and preparation selectors                          | Tracked `content/` Markdown, legacy JSON feed, MCP document snapshot                             |
| Cooking rules                   | `distribution/guidance.json`, paired English/Chinese rules with stable IDs | Skill cooking guidance and both MCP guides                                                       |
| AI release version and identity | `distribution/config.json`                                                 | Plugin manifest, MCP package version, Skill metadata, release notes and MCP health/tool metadata |
| Artwork                         | `distribution/branding/panfolio-mcp/icon-source.png`                       | Public 512/128 PNGs, Skill icon, plugin icon and MCP-served icon                                 |

`pnpm sync` rebuilds Markdown, icon sizes and generated distribution files. `pnpm content:check` and `pnpm distribution:check` compare source-derived outputs byte for byte. Do not hand-edit generated Skill/plugin/version metadata. The same shared guidance is embedded in the MCP snapshot and checked against both languages. The existing `/ai/` JSON exporter remains for old v0.1 clients; current consumers do not need it.

The generated `distribution/identity.json` records the version, cookbook content hash, guidance hash, icon hash and a release-input fingerprint covering the release configuration and implementation inputs. `scripts/build-mcp.ts` carries that same identity into the Worker. A package's release metadata records the same identity. The web app has its own application version; its UI version is independent of the AI distribution version.

## Make a change

1. Edit canonical content, rules, branding or implementation. Never invent source quantities or merge sibling preparations.
2. Increase `distribution/config.json`'s semantic version when release inputs change after publication. `pnpm release:preflight` blocks changed inputs under an existing immutable release tag. Documentation-only commits can retain the version when the release-input fingerprint is unchanged.
3. Run `pnpm sync`, then the checks below. Commit canonical sources and generated tracked files together.
4. Push to `main`. GitHub Actions performs validation, builds once, deploys the exact artifacts and publishes the release automatically.

```sh
pnpm install --frozen-lockfile
pnpm --dir mcp install --frozen-lockfile
pnpm sync
pnpm docs:check
pnpm test
pnpm eval
pnpm mcp:test
pnpm mcp:build
pnpm build
pnpm release:prepare
pnpm test:e2e
pnpm format:check
```

Python 3.9+ is used only by the deterministic ZIP packager and archive tests; consumers require no terminal or Python. Node.js 24 and pnpm 10 are the supported complete maintenance environment. Install Chromium/WebKit with Playwright before local browser tests.

## Automated publication

The single [workflow](../.github/workflows/deploy.yml) runs checks for PRs and main pushes. PR jobs have read-only repository access and no Cloudflare credential. The main workflow is serialized without cancelling an in-progress deployment. Checks include stale content, guidance/version/icon parity, documentation links, immutable release preflight, application tests, MCP protocol tests and production builds.

The check job uploads three artifacts: the Pages site, Cloudflare Build Output and the host-specific ZIPs with the icon, manifest and checksums. Deployment jobs download these exact artifacts rather than rebuilding. Pages and MCP deploy independently; publication waits for both. The MCP job uses `cf deploy --prebuilt --mode production`, then the official SDK client verifies the deployed release version, source commit, content hash, guidance hash, fingerprint and icon bytes before reading actual recipes. A failure blocks public release publication.

`release-manifest.json` records artifact hashes and the tested source commit. CI archives pin the Skill’s content base and entry links to that commit. Their instructions also rebase downstream cookbook links to the same revision, because the Markdown index itself contains main-branch links. This is an instruction followed by the host, not an HTTP redirect or an enforced server-side pin; model-consumer tests must verify the requested URLs. Repository-based skill installs follow main instead. Old installed packages do not automatically update, and MCP normally serves the current deployed snapshot. These states must not be presented as globally atomic or universally identical: a rollout can temporarily expose different revisions, and already retrieved cooking text should remain in use for that conversation.

Releases use `v<version>`, generated by `distribution/release.ts` for both publication and app download links. The initial stable release is `v0.1.0`, with the app and AI distribution both at `0.1.0`. Earlier pre-release records and tags were retired at the maintainer’s explicit request. Identical published fingerprints are skipped. A compatible draft is resumed; public assets are never overwritten. Failed deployment jobs can be rerun against their original build artifacts. If a release is public and its inputs need changing, bump the version; do not retag or clobber it. A deployment can succeed while the subsequent publication fails, so inspect the workflow status and MCP health before retrying. Rollback is an operator action using a known tested build; there is no automatic cross-product rollback.

GitHub Releases contain `panfolio-skill.zip`, `panfolio-plugin-chatgpt.zip`, `panfolio-plugin-claude.zip`, `panfolio-mcp-icon.png`, `release-manifest.json` and `SHA256SUMS`. This does not upload or approve a plugin in OpenAI's directory. Those account-side scans and publication controls remain separate.

## Cloudflare identity and credentials

The target is the dedicated **OctopusGarage** resource account selected in `distribution/config.json`. One Cloudflare email login can administer several accounts; account IDs, prefixes and resource settings remain separate. Never rename a shared account prefix or change unrelated services during a Panfolio deployment.

GitHub Actions uses the repository secret `CLOUDFLARE_API_TOKEN`. Its account-owned token is named `panfolio-github-actions`, limited to this dedicated account, with Workers Scripts Write and Account Settings Read. It has no DNS, storage, billing or other-account permissions. The account ID is public configuration and is not a second secret. Never store a token in a tracked file, release asset or workflow log.

To rotate, create a replacement with the same scope, update the GitHub repository secret, verify a deployment, then revoke the previous token. Do not revoke the working token first. The provider's resource limits still apply; this workflow does not enable paid plans or provision a database.

## Operational checks

The configured endpoint exposes `/health`, `/icon.png` and a hash-addressed immutable icon URL. Health metadata identifies the deployed distribution, source and content. Run `pnpm mcp:smoke <endpoint> <manifest-path>` to compare a known release manifest with the live service. Without the manifest argument, the same command validates transport and actual document reads without claiming a version match.

The official MCP client smoke test is not a ChatGPT/Gemini/Doubao installed-account test. Such tests must verify the actual account/plan's connection, tool discovery, selected-preparation fidelity and output language. A skills-only plugin and a separately added MCP server use different host capabilities even though their underlying cookbook and rules share one source.

Historical investigations and source audits are indexed in [the documentation guide](README.md). Keep evidence that explains recipe/source decisions. Generated caches, local browser helpers, credential files and build output are not repository sources.

## AI behavior evaluation

Use [the scenario inventory](../tests/fixtures/ai-scenarios.json) and [evaluation report](ai-quality-evaluation.md) when changing instructions or document routing. Fixture tests check source evidence, not model responses. MCP protocol tests compare every bundled document and metadata against its snapshot; these are deterministic transport checks. Fresh consumer agents must execute representative scenarios from extracted packages or the live MCP without reading implementation files, preserve their observed tool traces and be graded against source facts. Test archive revision propagation, recipe/variant selection, staged follow-ups, shared-tip scope, optional shopping items, source-limited scaling, no-match versus access failure, and privacy. Label simulations and untested host accounts explicitly. Do not turn a source’s missing quantity into an invented value to make a test pass.

## Host-specific plugin formats

Archive filenames are canonical in `distribution/config.json` under `packages`. `panfolio-plugin-chatgpt.zip` uses the portable Agent Plugins root manifest; `panfolio-plugin-claude.zip` uses exactly one native `.claude-plugin/plugin.json`. The host manifests and shared root README are generated by `pnpm distribution:sync`. Both package the same Skill rather than divergent cooking guidance. Native validation is a package check, not account installation or public-directory approval.
