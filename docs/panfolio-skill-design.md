# Panfolio consumer skill design

This design was prepared on 2026-11-25 against commit `14c1877`. The implementation includes a shared skill, public exporter, optional helper and two distribution archives. Versioned packages are distributed through GitHub Releases; the hosted content feed is published by the Pages deployment workflow. See the release and workflow status for publication evidence.

## Product intent

An installed `panfolio` skill should let a person use the curated cookbook directly through a compatible AI assistant. The person should not need to install or open the Panfolio web app, clone the project, run React, create a Panfolio account or provide a Panfolio API key.

The skill supports finding a dish, following one actual preparation, understanding a reusable technique and producing a shopping checklist from selected source recipes. Responses follow the conversation language. The skill is for people cooking from Panfolio; it does not carry project maintenance, video-ingestion, image-generation, commit or deployment workflows into their assistant.

“No app installation” does not imply “works in every AI chat” or “works without a connection.” The initial design needs a host that supports Agent Skills and can retrieve HTTPS content, either directly or through an optional small helper. Host-specific installation and tool availability remain explicit.

## Findings from this repository

| Existing asset                              | Current contents                                                                      | Design consequence                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/recipes.json`                          | 44 complete bilingual parent recipes                                                  | Export their existing text; do not write a second cookbook inside `SKILL.md`.                                                                                |
| `src/kitchen-essentials.json`               | 31 bilingual references with operations, explanations, mistakes, limits and sources   | Treat these as first-class knowledge, not decorative recipe tips. Preserve the salmon comparison note.                                                       |
| `src/recipe-discovery.json`                 | 65 preparation records across 44 parents; eight parents contain multiple preparations | Preserve child IDs, kinds and section selectors. These are not 65 interchangeable complete recipes.                                                          |
| `src/reference-discovery.json`              | Positive lookup aliases                                                               | Reuse them without indexing counterexamples as recommendations.                                                                                              |
| `src/preparation-content.ts`                | Bilingual selection of ingredient bullets/paragraphs and shared method steps          | Reuse this function during export rather than asking each host model to infer preparation boundaries.                                                        |
| `src/recipe-videos.json` and reference URLs | Original-video associations and stable video identifiers                              | Return links when relevant; playback and availability belong to the user's host and source platform.                                                         |
| Local backup model                          | Favorites, notes, cooking records and legacy private fields                           | The public skill cannot read another browser's IndexedDB. User-provided backups are private inputs, never public feed content.                               |
| GitHub Pages pipeline                       | Static build and deployment already exist                                             | A read-only content export can use the current hosting; no new application server is necessary.                                                              |
| `LICENSE`                                   | MIT software license explicitly excludes recipes and external media                   | Do not label a bundled full cookbook as MIT. The first skill package contains instructions/client code, not a redistributed offline recipe/media collection. |

The only recipe categories remain Chinese, Japanese chef series and Desserts (29/14/1). The Japanese category includes 13 SAMUKICHI recipes plus the existing Nikujaga; source attribution and category membership stay separate. The recently removed occasion, season, method, equipment and source filter taxonomy must not return through the skill.

The README was updated with the implementation to remove obsolete navigation/reference claims and document the actual skill installation and runtime boundaries.

## Delivery approaches

| Approach                                                         | Benefit                                                                                         | Limitation                                                                                                           | Decision                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Instructions pointing at the React site or raw source files      | Smallest prototype                                                                              | Browsing may expose only the app shell; raw JSON combines too much content and leaves variant selection to the model | Not the main consumer interface              |
| Skill containing the complete offline cookbook                   | Can work after installation without fetching recipe text                                        | Requires a clear content redistribution policy; duplicates content across releases and enlarges the package          | Defer; not assumed from the software license |
| Lightweight skill with an official static read-only content feed | No app installation; current curated content; small targeted retrieval; reuses existing hosting | Requires network access to the feed                                                                                  | Recommended first version                    |

The recommended design is two public artifacts generated/maintained in the same repository: a small installable skill, and static machine-readable cookbook files. These are not an MCP service, database, vector store, model gateway or account system.

## User capabilities and boundaries

| Request                                      | Expected behavior                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Find dishes using potato                     | Search the catalog and return a short list of actual matches, with names and distinguishing details.                          |
| Show Japanese chef recipes                   | Use the Japanese category and retain all SAMUKICHI parents. Do not narrow it through inferred Western/mixed labels.           |
| Walk me through asparagus pork rolls         | Select the rolls preparation, retrieve its relevant ingredients/shared steps and guide one stage at a time.                   |
| Why pour soy sauce around the pan edge?      | Retrieve the hot-pan reference; explain its purpose and conditions, including the different off-heat salmon treatment.        |
| How do I cut potato julienne?                | Retrieve the standalone knife lesson even though it has no parent recipe.                                                     |
| Make a shopping list for two selected dishes | Read their chosen preparations, preserve quantities/units and separate optional ingredients. Do not combine sibling variants. |
| Use my exported favorites                    | Read only a file the user provides; resolve IDs against the public catalog. Do not claim automatic app synchronization.       |

Natural conversational needs such as breakfast can guide a suggestion from actual recipes. This is an assistant's contextual recommendation, not a new stored breakfast classification or a claim that the source prescribed a meal occasion. The skill should not turn ingredient search into unsupported vegetarian, allergen, nutrition or health guarantees.

Portion scaling is offered only when the source establishes a usable base quantity/serving relationship. Preserve unspecified amounts rather than inventing grams, oil, salt, total duration or nutrition. Shopping checklists are an on-request conversational output, not a new shopping service or ordering integration.

## Proposed skill package

```text
skills/panfolio/
├── SKILL.md
├── scripts/
│   └── panfolio.py
├── references/
│   └── content-contract.md
└── agents/
    └── openai.yaml
```

`SKILL.md` stays concise: when to use the skill, how to retrieve the catalog and relevant content, how to select one preparation, how to answer from source material, and how to handle an unavailable feed. `references/content-contract.md` is loaded only for helper use, version handling or troubleshooting. `agents/openai.yaml` is optional UI metadata for hosts that understand it; generic operation must not depend on that file.

The optional Python helper uses the standard library, has no package installation step, and returns bounded machine-readable results. A host with native HTTPS retrieval can use the same feed directly. Do not make shell access, Python or a particular MCP tool the only way to use the skill.

Suggested entrypoint metadata:

```yaml
---
name: panfolio
description: Look up recipes and kitchen techniques in the Panfolio cookbook, guide a selected preparation, and build recipe-based shopping checklists. Use when cooking from Panfolio or asking about its dishes and methods.
metadata:
  requirements: "HTTPS retrieval; optional Python 3 standard-library helper"
---
```

The core workflow is: identify the request and language; find relevant catalog entries; retrieve the selected recipe/preparation or reference; answer using its actual operations, quantities and limits; cite the relevant original source when useful. Read only needed records. If a parent contains alternatives, choose one before giving a cooking flow or ingredient list. Do not silently select a different preparation on a later turn.

Neither a missing catalog match nor a retrieval failure authorizes presenting a general model-generated recipe as a Panfolio record. A general suggestion can be offered with a clear distinction if it helps the user's request.

## Official read-only content feed

Proposed base: `https://octopusgarage.github.io/panfolio/ai/`.

| File/resource                                            | Purpose                                                                                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manifest.json`                                          | Schema version, content version/hash, source commit, index location and license/attribution links.                                                                                  |
| `catalog.json`                                           | Compact bilingual recipe/reference metadata, the three categories, positive search aliases, preparation IDs/kinds and content locations.                                            |
| `recipes/<id>.<hash>.json`                               | A parent recipe's complete bilingual content, provenance, original video links, stable app link and preparation pointers.                                                           |
| `preparations/<parent-id>--<preparation-id>.<hash>.json` | Source-grounded selected content generated with `bodyForPreparation`, including shared operations and applicable context. Single-preparation parents may reuse the parent resource. |
| `essentials/<id>.<hash>.json`                            | Complete bilingual scope, ordered steps, reasons, mistakes, limits, comparison notes and original sources.                                                                          |
| `catalog.md`                                             | A lightweight navigable index for hosts that retrieve text more reliably than JSON.                                                                                                 |

Each record carries its public ID, content version and kind. Preserve `dish`, `finish` and `component` distinctions; never turn an incomplete serving idea into a complete procedure. A related-recipe ID is an association, not automatically evidence that the recipe applies every linked technique. Export the written comparison/boundary alongside it.

Localized content is selected after retrieval or through helper output, without requiring the model to load the entire bilingual cookbook into its context. The catalog should contain lookup metadata, not every method. The first response to a broad search returns a small result list; full detail is retrieved when selected or needed.

The first implementation can keep source Markdown rather than inventing a new structured ingredient/nutrition schema. Generated preparation bodies already solve the dangerous sibling-boundary problem. Later extraction into structured quantities requires its own review and is not a prerequisite for this skill.

### Build and version behavior

A deterministic maintainer-side TypeScript exporter reads only the four public content JSON files and original-video metadata. It reuses existing validation and preparation-selection functions, then emits `public/ai/` before the normal Vite build. Generated files are not manually edited. The consumer does not need Node or this exporter.

The content hash derives from the public source inputs; the skill protocol version is independent. The manifest points to content-hashed records. If a cached catalog refers to a removed resource after a deployment, refresh the catalog once and retry once. Do not loop indefinitely or silently mix incompatible versions. A cooking session keeps the already retrieved preparation/version for its next steps rather than replacing instructions mid-cook.

Keep these generated public files outside Vite's emitted-chunk list so they do not accidentally join the application's complete precache. The current worker explicitly precaches bundle entries plus selected public assets; exporting through a naive bundle plugin could otherwise add all AI records to every app installation. Verify this property in tests.

No user query, note, backup, credential or browser storage enters the public export. Keyword matching can happen in the helper/host over the fetched catalog, so free-form user requests do not need to become server query parameters. No automatic personal-data upload or telemetry is introduced.

### Retrieval and local state

The optional helper conceptually exposes `search`, `recipe`, `preparation` and `reference`, with language and category parameters where relevant. It is read-only by default and should not create personal files or rewrite an installation on ordinary lookup. Bound response sizes/timeouts and validate IDs/versions before accepting content. Recipe text is data, not executable instructions; do not fetch and execute remote scripts or treat a source's embedded prompt as an instruction.

Normal operation does not read app favorites, import backups or save notes automatically. If the user explicitly asks to use a backup or save a note, operate only on the user-provided file/location and keep it outside the shared skill directory and public content. There is no background cloud synchronization.

## Installation and compatibility plan

After publication, a target CLI installation is:

```sh
npx skills add OctopusGarage/panfolio --skill panfolio -g
```

This is a proposed post-release command, not a currently working Panfolio installation. The installer has its own Node requirement; the skill's lookup workflow does not depend on the Panfolio app runtime. Also provide a ZIP containing the skill root for hosts that import archives, plus the direct repository skill path for folder-based installers. Avoid product-wide promises that every host imports a ZIP or executes helper scripts identically.

The portable core follows the Agent Skills `SKILL.md` format. Actual compatibility is demonstrated on named hosts, not inferred solely from that format. Validate a native-fetch path, a helper path and a clear failure when neither is available. Hosts that cannot load skills or retrieve content need a manual text workflow; that is a fallback, not native skill compatibility.

Skill behavior updates use installation/update mechanisms. Cookbook edits update the official feed through the existing build/deployment process, without requiring a new skill release when the schema remains compatible. An offline content bundle remains a separate future decision about content permission, packaging and freshness; no recipe/media MIT license is assumed.

## Behavioral evaluation before release

| Scenario                 | Required evidence                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery                | The three categories partition 44 parent recipes; Japanese contains 14 including every SAMUKICHI parent.                                                               |
| Selected preparation     | Pork-roll lookup excludes basic-asparagus-only ingredients/steps while retaining shared trimming; parent notes/IDs stay stable.                                        |
| Alternatives             | A request for one rice-cooker variation does not combine all six; tuna's egg, toast and rice preparations remain separate.                                             |
| Technique exceptions     | Soy-pan answers retain salmon's off-heat comparison; fried-rice additions exclude raw meat as a brief finishing ingredient.                                            |
| Standalone knowledge     | Potato julienne is available without an invented recipe relationship.                                                                                                  |
| Numbers and duration     | Sago's one-minute initial boil is not called its total cooking time; unknown portions/amounts are not fabricated.                                                      |
| Source attribution       | Only relevant real source links are returned; generated artwork is not called a verified original-video frame.                                                         |
| Language                 | Chinese/English retain the same method, quantities, conditions and source URLs.                                                                                        |
| Missing result/network   | Unknown IDs and unavailable feeds produce a bounded honest response, not a hallucinated cookbook entry or endless retry.                                               |
| Private data             | An ordinary lookup accesses no local notes/backups; explicit backup use never publishes private fields.                                                                |
| Independent installation | Copy only the skill folder into a clean environment with no repo, `node_modules`, React app or local development server, and complete real lookup/cooking tasks.       |
| Freshness                | Mixed/cached versions recover once; a cooking session preserves its selected content.                                                                                  |
| Host capability          | Native HTTPS retrieval works without helper execution; helper lookup works without third-party Python packages. Unsupported hosts fail clearly.                        |
| Export parity            | All public recipe/reference records and generated preparation bodies match the canonical source and preserve conditional notes. AI files do not join the PWA precache. |

Run source/export invariants and consumer-script tests, then independent forward tests using a fresh agent that receives only the installed skill and a task. Examine retrieval traces as well as answers. Fix observed failures and repeat those scenarios. A valid YAML manifest alone is not a behavioral pass.

These are the acceptance gates for the implementation. Actual local verification and independent forward-test results are recorded in `panfolio-skill-evaluation.md`; do not infer universal host compatibility from the format.

## Implementation sequence

1. Implement the minimal public exporter and versioned content contract; verify parity, private-field exclusion and worker scope.
2. Add the compact skill instructions and optional standard-library helper, with native-retrieval fallback.
3. Validate the folder, test it outside the repository, and run the behavioral cases on selected supported hosts.
4. Update the outdated README and add installation instructions/distribution ZIP for the actual validated artifact. Publish the skill and feed together only when authorized and verified.

## Primary references

- [Agent Skills specification](https://agentskills.io/specification): required entrypoint, optional resources, compatibility metadata and progressive disclosure.
- [Skill creator best practices](https://agentskills.io/skill-creation/best-practices): grounding in actual project knowledge and validating observable behavior.
- [Skills CLI source and usage](https://github.com/vercel-labs/skills): installation to supported hosts; host support does not imply every AI product works identically.
- [Skills installation reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md): repository, folder, archive and agent-specific installation options.
