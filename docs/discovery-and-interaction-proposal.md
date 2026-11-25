# Recipe discovery and interaction proposal

Status: approved direction implemented in the working tree; see [the maintenance guide](discovery-guide.md) for the runtime contract. Prepared on 2026-11-25. The user explicitly broadened the earlier three-shelf direction: support tags and filters across occasions, ingredients, seasons and other useful dimensions, and reconsider the overall application layout. The user has no single preferred starting point; ingredient-first, occasion-first, favorites and technique lookup must all work.

## 1. Findings from the actual collection

The current working tree contains 44 recipe entries and 31 kitchen references. All 75 IDs were reviewed individually for discovery purposes; see the [per-entry audit](recipe-discovery-audit.md) and [structured candidate mappings](recipe-discovery-audit.json). This is a review of current complete texts, not a repeat full original-video audit. The ingredient candidates are not an exhaustive dietary/allergen index.

Nineteen recipe entries already link to kitchen references. Four references are deliberately standalone knife lessons. The remaining recipes do not automatically need a reference: add a relationship only when the method actually applies.

The current Chinese/Japanese/Dessert field mixes cuisine with dish role. The practical shelf currently places Western-style tomato beef under Chinese and all SAMUKICHI dishes under Japanese, including steak and onion soup. Source authors, cooking styles and meal roles therefore need independent representation. Keep familiar labels as quick filters rather than making one exclusive field own every recipe.

Multi-preparation entries are a more serious correctness issue than the number of visible categories. The instant-noodle collection has ten preparations, the rice-cooker collection six, and tuna three. Eggs in one child and potatoes in another must never satisfy a request for both ingredients in one preparation. Optional cheese finishes, actual alternative dishes, components and incomplete serving ideas must also remain distinct. The salmon bowl and pasta accompaniment must not become fabricated complete recipes.

No current entry establishes a complete active/total duration. Partial simmering, soaking, cooking-program or frying durations cannot produce a trustworthy total-time filter. The pancake's short frying stage and the sago's one-minute boil are especially misleading if detached from resting. Keep existing timing instructions; defer numeric total-time filters until reviewed data exists.

Vegetable tags do not mean vegetarian: eggplant, broccoli dishes and sauces may contain meat, shrimp, oyster sauce, chicken seasoning or dairy. Do not auto-publish dietary, nutrition or health claims. Likewise, cold serving is not proof of a summer-only season, and no location-independent harvest calendar follows from these texts.

The current app also has specific discovery friction: introductory content and the large chef-series panel precede search; recipes and references search separately; recipe search is a full-text substring; reference search includes the entire JSON, including counterexamples and scope exclusions; only one browse category can be selected. Technique references and original video playback already work and should be retained.

## 2. Options and recommendation

| Approach                                                                      | Benefit                                                                                   | Cost or limit                                                                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Add more quick tags to the existing pages                                     | Small immediate change                                                                    | Retains duplicated search, parent-union matching errors and a growing header                                                    |
| A shared content model with faceted discovery and compact pages — recommended | Supports all starting points and accurate matching while keeping ordinary browsing simple | Requires reviewed metadata, variant-aware indexing and coordinated navigation work                                              |
| A pantry, shopping and personalized meal-planning application                 | Could eventually answer broader planning questions                                        | Requires inventory, portion, time and preference data that the current collection does not supply; unnecessary for this request |

Choose the middle approach. Model rich metadata behind a restrained interface. Do not expose every available dimension at once, and do not create a deep category tree.

## 3. Content and tag model

Keep original recipe IDs, source URLs and parent notes stable. Each recipe contains one or more cookable preparations. Give genuine preparations stable child keys, while recording optional finishes, shared components and serving ideas separately. A single dish can be its own preparation without adding a visible nesting level.

Maintain these independent dimensions:

| Dimension           | Examples                                                                                                    | Meaning and editorial rule                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Occasion            | Breakfast, everyday main meal, side dish, snack/dessert, advance preparation                                | A serving or preparation suggestion; does not imply speed                                               |
| Main ingredients    | Vegetables, meat/poultry, fish/shrimp, eggs, grains/noodles, bean products; searchable specific ingredients | Main ingredients are separate from aromatics, condiments, optional additions and accompaniments         |
| Method              | Stir-fry, pan-fry, steam, simmer/braise, roast, cold toss, rice-cooker meal                                 | Actual operations; retain multi-stage combinations                                                      |
| Seasonal preference | Spring, summer, autumn, winter; combinations allowed                                                        | Manually curated serving suggestions. Do not auto-apply the calendar or claim local harvest seasonality |
| Style               | Chinese home cooking, Japanese, Western, mixed or unassigned                                                | Reviewed style signals, not creator nationality or a mandatory exclusive slot                           |
| Equipment           | Oven, rice cooker, steamer, microwave, thermometer                                                          | Required versus optional equipment must remain distinct                                                 |
| Source              | SAMUKICHI and other original authors; source collections                                                    | Attribution and topic discovery independent of style                                                    |
| Personal            | Saved, tried, repeat favorites, private tags                                                                | Local user data; never inferred from merely opening cooking mode or included in shared URLs             |

Use stable canonical tag IDs with Chinese/English labels and reviewed aliases. Keep ingredient identities specific: potato/马铃薯 can alias; cilantro leaf and coriander seed cannot; butter and rendered beef fat cannot; sago is not rice; unspecified starch is not automatically cornstarch; broccoli and cauliflower remain separate. A broad search can suggest related terms without silently substituting ingredients.

Facts and editorial suggestions need distinct provenance internally. Supporting ingredients in the audit require completion before exclusion or dietary use. Unknowns stay unknown; the interface simply omits unsupported badges and empty facets instead of filling cards with editorial disclaimers.

For kitchen references, keep task groups as optional filters: preparation, heat/doneness, seasoning/aroma and storage. Add topic, ingredient and cooking-stage facets. Examples are knife work, sticking, surface moisture, browning, center temperature and portioning. Conditions belong to each applicable case; a salmon counterexample in the soy-sauce article is not an endorsement of hot-pan soy for salmon.

## 4. Filtering semantics

Different facet groups combine with AND. Options within an ordinary facet combine with OR: breakfast AND (chicken OR beef) AND pan-fry. Display removable applied filters immediately above results, plus Clear all. Result counts and option counts use the current other conditions; count parent entries once even if several child preparations match. On a collection card, identify the matching preparation and link directly to it.

Ingredient-led lookup also needs an explicit intersection operation. In the ingredient panel, a small Any of these / All of these control makes that request unambiguous. It is not a hidden global logic change. The default browsing facet remains Any; the deliberate Find dishes containing these ingredients action can start in All mode. This is not a pantry inventory or a promise that no other ingredients are needed.

Every combined condition must match the same preparation. The rice-cooker collection cannot pass eggs AND potato merely because its sausage-egg preparation and sausage-potato preparation are siblings. Shared steps and genuinely required common ingredients may be inherited; alternatives and serving suggestions may not.

On desktop, show filters in a narrow content sidebar and update results immediately without moving focus. On phones, open one accessible filter sheet containing collapsible groups; keep a draft selection, show a live preview count and use a bottom Show results button to commit. Cancel, Escape and Back discard the draft and restore focus to the opener. Clearing a committed chip updates immediately; Clear all resets the deliberate search/filter state, not private data.

A zero-result state retains the current conditions and suggests a reversible relaxation, such as removing the seasonal condition. Do not silently drop conditions or relax ingredient intersections. Unavailable choices should remain understandable, with counts rather than disappearing unpredictably.

Do not make a default seasonal restriction, hide recipes outside a hemisphere assumption, or expose empty categories for symmetry. Breakfast and season are entry points into the same result list, not additional navigation branches.

## 5. Information architecture

Use three primary destinations: Recipes, Kitchen essentials and My kitchen. On desktop they can sit in a compact top navigation. On phones they form a stable bottom navigation. Settings, language, app sharing, import/export and help move into My kitchen or a small consistent header action, rather than each occupying a primary content destination. My kitchen remains local; this does not introduce an account.

The Recipes page begins with a compact title and search, followed by a restrained quick-filter row and immediately visible food cards. Keep Chinese, Japanese and Desserts as familiar presets, and add context-appropriate shortcuts such as Breakfast without turning them into exclusive buckets. Selecting a preset exposes its actual applied condition. The large source-series panel becomes a source/topic filter or optional compact link. Existing chef-series deep links remain valid.

The first screen should show search, the filter entry and usable results at narrow phone widths. Avoid a large introductory hero, carousel or repeated onboarding card. A resumable cooking session may occupy one compact row only when one exists. Recent items are a compact optional section, not a second feed above all results.

Use a two-column recipe grid on normal phone widths when titles remain readable, falling back to one column for narrow or enlarged-text layouts. Desktop can use a filter sidebar and a three-column grid. Keep uniform 3:2 full-image presentation, aligned title/summary/metadata areas, and predictable card heights without masonry or hover-dependent controls. Show at most two useful tags on the card; explain the full set in the detail page. Never invent a duration to fill a visual slot.

Kitchen essentials shares the search/filter conventions but uses compact text cards focused on task and scope rather than requiring photographs. A question such as potato julienne should lead to a knife reference; a butter-timing question should lead to that reference before broad full-text mentions in dishes.

My kitchen contains saved recipes, optional Tried/Make again states, private notes/tags, recently viewed items and saved filter combinations. Adding a tried event is an explicit, reversible action after cooking, not a side effect of pressing Start. Expand the backup format compatibly only when those new personal fields are implemented; preserve existing favorites and notes.

## 6. Search, detail and cooking flows

Use one search model across both content types. A search view offers All, Recipes and Kitchen essentials result scopes with separate counts and visually distinct result cards. Normal browsing still respects the current page. In All results, label recipe-specific controls as Recipe filters and show kitchen references in a separate Related techniques group matched to the query; breakfast or seasonal filters must never be silently imposed on a knife lesson. Within the reference scope, show task/topic controls instead of recipe-only occasion controls. Rank exact titles and preparation names first, reviewed ingredient aliases and topics next, and full body mentions later. Counterexamples must not create positive tags. Search a private note only in a local personal scope if the user explicitly chooses it; never index it into public sharing.

Recipe details lead with title, natural source-grounded cover, concise description and the primary Start cooking action. Provide an ingredient/method/tips index, associated techniques and the existing click-to-open original video. Keep complete explanations and counterexamples available; a simpler listing is not a reason to shorten the recipe.

A collection opens with a preparation chooser. A filter hit can preselect and scroll to the matching preparation. Cooking mode includes only that preparation's relevant ingredients and steps. Preserve parent notes and link child-specific context without changing the original recipe ID. Incomplete serving suggestions remain suggestions and do not expose a fabricated cooking flow.

Navigating from a recipe to a technique and back restores the originating preparation and position. Leaving a detail restores query, filters, result scope, sort order, list position and focused card. Sheet dismissal takes priority over page navigation. Existing recipe links, protected sharing, local privacy, deployment-scoped recovery and cache rules remain intact.

## 7. Smoothness, accessibility and visual direction

Preserve the calm mist-white/sage interface and the newly regenerated source-grounded photographic covers. Reduce decorative containers and give controls, counts and headings a stable alignment. Use ordinary spacing and hierarchy rather than making every block another card.

The 75-entry collection does not justify remote search or a recommendation service. A small local reviewed index should respond without blocking typing or reloading images. Reuse image variants and on-demand offline caching. Avoid virtualized grids or a new animation framework until measurements demonstrate a need. Aim for local search/filter feedback within 100 ms on a representative phone, then measure rather than asserting that budget has already been met.

Use approximately 120–180 ms feedback transitions, respect reduced motion and avoid bouncing card reordering or automatic scroll jumps. Give primary touch targets a practical 44-pixel design target; WCAG 2.2 AA has a 24 CSS-pixel minimum with exceptions, which is not the same requirement. Keep focus visible above sticky headers, bottom navigation and sheet actions. Announce committed result counts politely, without interrupting each checkbox toggle. All actions and accessibility labels remain bilingual.

## 8. Evidence behind the proposal

[Baymard's multi-value filtering research](https://baymard.com/research-articles/allow-applying-of-multiple-filter-values) supports OR within normal facets and AND between facets. Its [applied-filter research](https://baymard.com/research-articles/how-to-design-applied-filters) supports a visible removable overview. These studies concern commerce, not Panfolio; their conventions are a starting point, and the explicit ingredient-intersection mode is a domain-specific adaptation.

[Nielsen Norman Group's progressive disclosure guidance](https://www.nngroup.com/articles/progressive-disclosure/) supports showing common choices first and deferring advanced ones. [Schema.org Recipe](https://schema.org/Recipe) and [Google's recipe documentation](https://developers.google.com/search/docs/appearance/structured-data/recipe) distinguish cuisine, category, ingredients and durations; this supports separating these concepts, not treating a search-engine schema as a complete app UX specification.

The [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) informs focus containment, Escape and focus return. W3C's [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) and [motion guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) inform the mobile interaction constraints. Accessibility targets and usability recommendations must not be described as completed conformance tests.

## 9. Delivery sequence and acceptance scenarios

1. Review and normalize discovery metadata, ingredient aliases, preparation boundaries and source/editorial provenance. Keep the current app behavior until the model passes content tests.
2. Implement shared search/filter state and compact Recipes/Kitchen essentials pages. Preserve legacy deep links and private data. Add exact variant-aware matching tests before exposing filters.
3. Implement preparation-aware detail/cooking navigation, then the expanded My kitchen page and optional saved filters/tried records. Do not bundle pantry inventory, shopping, automatic nutrition, AI recommendations or new accounts into this redesign.

Acceptance scenarios:

- Breakfast plus tuna identifies the toast or egg preparation, rather than labeling the entire three-preparation collection as a breakfast procedure.
- In All-ingredients mode, eggs plus potato does not falsely match different sibling rice-cooker preparations.
- Autumn/winter plus chestnut can identify the appropriate curated rice variations without declaring a universal harvest season.
- Potato julienne search ranks the standalone knife lesson rather than a potato-chunk stew.
- Butter timing search exposes its conditional cases rather than turning every source association into a universal instruction.
- A vegetable result containing meat or oyster sauce never receives an automatic vegetarian badge.
- A pancake's 5–6 minute frying stage and sago's 1-minute boil never become complete-time badges.
- Mobile filters can be selected together, cancelled, committed and removed without losing state or focus; zero results have reversible recovery.
- Recipe → technique → recipe and recipe → cooking → list round trips restore the relevant preparation, filters and scroll position.
- Saved recipes, notes, old exports and stable links survive the migration; no private tags or notes enter shared URLs.

The accompanying interactive study was used to discuss the initial direction. Production implementation uses the complete reviewed local metadata. This document preserves the design rationale; implementation details and verification requirements are maintained in the discovery guide.
