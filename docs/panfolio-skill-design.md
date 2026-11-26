# Panfolio AI distribution design

The [distribution maintenance contract](distribution-maintenance.md) defines current versions, generation commands and publication rules.

## Shared meaning, separate transports

Canonical reviewed recipe data and preparation selectors produce the same bilingual Markdown used by the app's content export, the repository Skill and the MCP snapshot. Shared bilingual rules in `distribution/guidance.json` generate Skill guidance and MCP guides. `distribution/config.json` owns the AI distribution version, endpoint and publisher identity. Generated outputs and fingerprints are checked in CI.

The portable Skill uses already connected Panfolio MCP tools when available, otherwise public GitHub Markdown through native HTTPS tools. It uses one retrieval route per task and reuses retrieved documents during active cooking. Each release ZIP starts new tasks at stable bilingual guides on main. The package build revision remains recorded in release metadata. The host-specific plugin packages carry that exact Skill and the common icon; it is still skills-only and does not silently acquire MCP access. A separately connected MCP server returns the same Markdown through `get_guide` and `read_document`, so generic web browsing is unnecessary. Consumers require no Python, shell, app installation or Panfolio account.

The three recipe categories remain Chinese, Japanese chef series and Desserts. Kitchen references have a separate index. Alternative preparations have independent paths using stable IDs; components and finishes are explicitly labeled. Source quantities, conditions, counterexamples and real video links remain intact. Related links can be comparisons rather than universally applicable techniques.

## Derived content and identity

`content/index.md` links to Chinese/English indexes. `content/{zh,en}/recipes/` contains parents, `preparations/{recipe-id}/{preparation-id}.md` contains selected methods, and `references/` contains scope, operations, reasons, mistakes and limits. The current content inventory is checked dynamically rather than imposing a future recipe-count limit.

The source artwork generates public icon sizes. The same 512 PNG is copied into the Skill, packaged as the plugin icon and served by the Worker. A hash-addressed icon path permits immutable caching.

Every release manifest and MCP response identifies content, guidance and source revision. Archive metadata carries the same baseline. Old installations can differ from a new live MCP, and deployments are not globally atomic; source identities make these differences inspectable. Reuse retrieved text throughout an active cooking conversation.

## Boundaries

The static JSON feed is retained for older clients, but current Skill usage does not require its protocol. Python remains a maintenance ZIP dependency only. Private browser notes, favorites and backups are not public content. The software MIT license excludes source recipes/media. Host-specific installation, networking and output behavior require separate real-account verification.

## Host formats and onboarding

The app’s AI page selects the package for the chosen host. Portable `panfolio-plugin-chatgpt.zip` has root `plugin.json`; native `panfolio-plugin-claude.zip` has `.claude-plugin/plugin.json`. Both manifests and the common plugin README derive from shared distribution sources. The separate formats avoid unsupported cross-host manifest assumptions. See [Claude packaging](claude-plugin.md).
