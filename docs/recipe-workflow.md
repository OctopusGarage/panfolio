# Recipe curation workflow

This is the entry point for adding or revising Panfolio recipes, organizing video collections, extracting reusable cooking knowledge and creating recipe covers. It captures standing editorial preferences so later tasks need only supply the source and intended scope.

## Read the relevant standards

- Always read [Recipe content guide](content-guide.md) for recipe structure, detail, bilingual fidelity and reference treatment.
- Read [Kitchen essentials](kitchen-essentials.md) when assessing or extracting reusable knowledge.
- Read [Visual direction](visual-style.md) when adding or changing covers or their presentation.
- Use [Japanese chef series](japanese-chef-series.md) as an example of source evidence and limitations, not as a fixed recipe count or universal cooking authority.

Keep rules in their owning documents rather than copying full standards into skills, prompts or new series records. AGENTS.md routes agents here. A project skill is optional orchestration, not the only place these requirements are recorded.

## 1. Inspect the existing collection

Check current changes, recipe IDs, collection metadata, related references and available artwork. Preserve unrelated work. Keep established IDs stable so favorites, notes and links remain valid. Follow the existing schemas and components; keep content separate from shared infrastructure.

A request to organize source material ordinarily includes complete bilingual recipes, assessment of reusable techniques, source-informed covers for new entries and verification. It does not automatically authorize deployment, unrelated redesign or adding an empty taxonomy. Apply existing approved defaults without repeating preference questions. Ask only when the source or a consequential decision cannot be resolved from available context.

## 2. Establish the source

Resolve supplied video links to their original creator and original YouTube video where possible. Review captions, descriptions and relevant visual material according to availability. Separate main preparations, variations, serving ideas and general tips. Capture actual quantities, units, times, temperatures, doneness cues, operation order, reasons and counterexamples.

Treat captions as evidence of spoken or captioned instructions, not proof that every visual action was reviewed. Inspect original frames or thumbnails for covers. Record which evidence was actually available in a concise English source record. Recover from routine retrieval failures where possible; do not repeatedly retry an access restriction or claim to have watched inaccessible footage.

Preserve supplied source URLs in provenance. Reader-facing reference sections for this workflow use the original YouTube link only. Do not fabricate a missing original source. Evidence gaps belong in editorial records, not repeated disclaimers in the recipe.

## 3. Write useful recipes

Follow the content guide. Preserve necessary explanations and source counterexamples; do not equate optimization with aggressive shortening. Keep operational instructions and doneness checks where the cook needs them. Put additional reasons, common mistakes and shortcuts in closing tips. Include only supported ingredients and measurements.

Translate the complete content into English, preserving technical meaning, quantities, timings, step order and reference URLs. New recipes and substantially revised content are bilingual; the source's language does not excuse an untranslated reader experience.

## 4. Extract reusable knowledge

Assess every curated source for independently useful preparation or cooking knowledge. Keep the recipe intact while creating or updating relevant Kitchen essentials entries. Check for duplicates, preserve scope and exceptions, and link recipes and references in both directions through the existing associations. Use task categories and search tags rather than creating a new category for every video.

## 5. Complete the visual presentation

For new recipes, create a matching cover following the visual standard unless the user explicitly limits the task. Base it on that dish's own source, preserve the food and vessel, remove thumbnail noise and inspect the result. Integrate with the established responsive image pipeline. Do not regenerate artwork for an unrelated text correction.

Reuse current layout and motion conventions: clear reading hierarchy, restrained spacing, full-image proportions, mobile support, keyboard accessibility and reduced-motion support. Content work does not require redesigning the entire application.

## 6. Review and verify

Editorial review comes before mechanical checks. Check source fidelity, separate variants, necessary detail, bilingual meaning, useful tips, reference scope, knowledge reuse and visual correspondence. The evaluation script verifies parity, not whether cooking claims are true.

Run the required checks before publishing:

```sh
pnpm test
pnpm eval
pnpm build
pnpm test:e2e
pnpm format:check
```

For recipe JSON changes, refresh `pnpm eval:report` after bilingual review. Verify relevant card/detail images, search, categories, language switching, cooking-reader behavior and recipe/reference navigation when affected. Report actual check results and any material limitation. Keep downloads, original generated PNGs and workflow scratch files outside version control.

## 7. Publish only when authorized

Complete reviewable implementation and checks first. When deployment is requested or already authorized, use the repository's established GitHub Actions / GitHub Pages path, verify the workflow result and then inspect the live assets. Report whether work is local, pushed, or successfully deployed; do not claim deployment from a push alone.

## Example future requests

These short requests should be sufficient once the source is supplied:

- “Organize these videos into a new recipe series using the project standards.”
- “Add this recipe, extract reusable kitchen techniques and include a matching cover.”
- “Revise this recipe's explanations while keeping its existing artwork.”

The specific dishes, number of entries and video availability remain task inputs; the standing editorial and visual preferences above do not need to be repeated.
