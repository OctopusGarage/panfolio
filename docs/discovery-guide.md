# Browsing and reference maintenance

## Current approved scope

The cookbook uses four exclusive categories: Chinese (`chinese`, 中餐), Japanese chef series (`japanese`, 日厨系列), Desserts (`dessert`, 甜品) and Drinks (`drinks`, 饮品). Every recipe has one explicit category in `src/recipes.json`. The Japanese category includes all 13 SAMUKICHI recipes and the existing Nikujaga recipe. Preserve the separate original collection/source metadata without claiming that Nikujaga came from SAMUKICHI. Chinese remains the existing practical home-cooking grouping, not a claim that every adaptation is a traditional Chinese dish. Do not add cuisine subdivisions, occasions, seasons, ingredient groups, equipment, source filters or tag editors without a new user request.

The initial view shows the complete cookbook. The four category buttons are mutually exclusive; clicking the active button returns to the complete view without selecting an additional category. Search applies within the chosen category. Kitchen essentials has keyword search only. Recipe text, preparations, video access, favorites, notes, explicit cooking records, recent reading and private backups remain available.

## Search and preparations

`src/recipe-discovery.json` contains genuine preparation boundaries, ingredient synonyms and source section selectors. `src/reference-discovery.json` contains positive lookup aliases. There is no runtime facet taxonomy. Counterexamples must not become positive ingredient or technique recommendations.

`methodSteps` selects one-based method sections. `ingredientLines` selects zero-based ingredient bullets; `ingredientParagraphs` selects zero-based prose paragraphs. Keep shared preparation steps where needed and preserve the complete original recipe. Incomplete serving suggestions are not independent complete preparations. Keep stable parent IDs, notes, source URLs and legacy recipe/reference routes.

Old backup fields for tags and saved filters are accepted and preserved solely for data compatibility. They do not drive current search or expose removed controls. Never delete existing personal information merely because a UI feature was removed. Keep all personal data outside public URLs, share cards and telemetry.

## Kitchen-reference clarity

A reference should answer when to use the method, how to perform it, what visible result to look for, why the operation helps, what commonly goes wrong and where the method does not apply. Explain jargon using concrete actions. Keep source distinctions and counterexamples. Do not expand terse text by inventing timings, temperatures, quantities, storage guarantees or scientific claims.

Cards should identify the technique and provide an actionable starting point, with a clear link to complete instructions. Detail pages prioritize instructions; videos supplement the written reference. Related recipes can include comparisons and exceptions, so do not label every association as an application example. Add an explicit comparison note when needed.

## Verification

Run `pnpm test`, `pnpm eval`, `pnpm build`, `pnpm test:e2e` and `pnpm format:check`. Confirm four-category coverage, every SAMUKICHI preparation, keyword search, source section selectors, complete bilingual references, legacy data preservation, responsive alignment, accessibility and recipe/reference return state. Historical facet proposals and reports are evidence of earlier work, not current product requirements.
