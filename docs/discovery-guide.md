# Discovery maintenance guide

Panfolio presents three primary destinations: Recipes, Kitchen essentials and My kitchen. Chinese, Japanese, dessert and breakfast are quick filters rather than mutually exclusive shelves. Existing recipe IDs, source URLs, collection links and the legacy `#saved` route remain stable.

## Reviewed metadata

Keep discovery infrastructure separate from source recipe text:

- `src/discovery-tags.json` owns canonical bilingual tag IDs, labels and aliases. Reuse an existing ID before creating another spelling of the same ingredient.
- `src/recipe-discovery.json` records each recipe's actual preparations and their facets.
- `src/reference-discovery.json` records positive reference topics, tasks, ingredients and stages. Counterexamples and exclusions remain readable in the reference but are not positive search metadata.
- `src/discovery.ts` implements local matching, ranking and deduplicated parent counts.

Review every preparation against both language bodies. Ingredients must belong to that preparation; never union siblings to satisfy All ingredients. Use `ingredientChoices` for mutually exclusive source alternatives. Optional ingredients and incomplete serving suggestions must not become a fabricated complete preparation.

`methodSteps` selects one-based source method sections. `ingredientLines` selects zero-based ingredient bullets; `ingredientParagraphs` selects zero-based blank-line paragraphs when the source uses prose. Shared preparation steps can appear in more than one child. Keep the original complete recipe accessible through View all preparations. Renumber displayed child steps without modifying source content. Retain necessary explanations, failure examples and tips.

Cuisine style is independent of author or collection. Occasions and seasonal suitability are editorial browsing aids, not claims that a source prescribed a meal or a universal harvest calendar. Vegetable tags do not imply vegetarian suitability. Never derive total cooking time, nutrition, allergens or health claims from partial instructions.

## Interaction contract

Normal facets use OR within a group and AND across groups. All ingredients uses intersection within one actual preparation. Counts represent distinct parent recipes, not the number of children. Search prioritizes exact titles, preparation names and reviewed aliases before source method text. Related kitchen knowledge in All scope follows the search query independently of recipe occasion filters.

Desktop filters apply immediately. Mobile filters use a draft: Cancel, Escape and browser Back discard it; Show results commits it. Applied filters are removable, and Clear all restores the original destination scope. Preserve filter state, list position and focus when returning from a detail. Preparation choices live in navigation state and preserve parent recipe IDs.

My kitchen contains favorites, explicit tried/repeat choices, notes, private tags, saved searches and recent reading. Personal information stays in local storage/IndexedDB and exported backups. It must never enter public URLs, share cards or telemetry. Saved searches retain an optional chef-series collection context independently of cuisine and author tags. My kitchen keeps its in-session search query across recipe round trips. Existing version-1 backups without kitchen metadata remain valid; new optional metadata merges without discarding existing notes.

## Verification

Run `pnpm test`, `pnpm eval`, `pnpm build`, `pnpm test:e2e` and `pnpm format:check`. The discovery tests validate tag coverage, sibling boundaries and bilingual section selectors; browser tests cover mobile drafts, child readers, private persistence and saved scopes. Review actual phone and desktop layouts when changing card sizing or navigation. Retain the offline, scoped cache/recovery, protected sharing and accessibility tests.

The initial design rationale and evidence are recorded in [the proposal](discovery-and-interaction-proposal.md) and [the research review](discovery-research.md). The audit files document discovery review of current recipe text; they do not claim that every original video was rewatched.
