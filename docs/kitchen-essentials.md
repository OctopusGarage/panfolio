# Kitchen essentials

Kitchen essentials is a separate bilingual reference collection at `#essentials`. It extracts reusable preparation and cooking knowledge without removing instructions or tips from recipes. Application help remains at `#guides` under the name User guide, linked from the reference index.

## Organization

The collection contains thirty-one references in four populated categories: Ingredient preparation, Heat & doneness, Seasoning & aroma, and Storage & meal preparation. The nine-video expansion adds nine references, including explicitly sourced caramelized-onion storage. The coconut sago addition contributes cooking and storage references from Ali Kitchen. The eleven-video expansion adds seven references, including three standalone vegetable-cutting entries whose video source is sufficient without an invented recipe association. The potato julienne addition places Wang Gang’s standalone knife lesson alongside the existing vegetable preparation references. Source collections remain independent of task-oriented categories; the renderer must not attribute every reference to SAMUKICHI.

Content lives in `src/kitchen-essentials.json`; category metadata and recipe association helpers live in `src/kitchen-essentials.ts`. Routes use stable reference IDs, for example `#essentials/soy-sauce-pan`. Existing recipe IDs, favorites and notes are unchanged. Reference pages link to associated recipes when present; recipes expose Related kitchen essentials. Standalone references use their own original YouTube sources for video playback and labels, and omit the empty related-recipes section.

## Editorial rules

Each entry has a localized title, summary, scope, practical steps, explanations, common mistakes, applicability limits, recipe IDs and YouTube sources. Keep both languages complete, with matching quantities and timings. Keep necessary operational detail. Avoid editorial statements about the extraction process in reader-facing content.

Shared explanations are written once per reference, while recipe tips retain their cooking context. Do not promote a source-specific instruction into a universal rule. In particular, preserve cold-pan chicken versus preheated salmon, off-heat butter versus near-doneness chicken basting, and hot-pan soy sauce aroma versus off-heat butter-soy sauce. Broccoli blanching and salmon salting times remain tied to those preparations.

The initial content is based on the reviewed SAMUKICHI captions and descriptions documented in `japanese-chef-series.md`. Source URLs are YouTube only in the reader-facing reference sections. Storage durations, thawing instructions and garlic-oil preservation guidance are not inferred from immediate cooking methods.

## Verification

Unit checks cover bilingual field completeness, unique IDs, populated categories, valid recipe associations, YouTube source domains and measured-value parity. Browser coverage verifies search, filtering, direct detail routes, English content, recipe round trips, empty results and mobile layout. Existing recipe and application checks continue to apply.

## Ongoing extraction

Whenever new recipe material is organized, review it for reusable knowledge. Preserve full instructions and contextual tips in the recipe; additionally create or improve a reference when the knowledge is useful independently. Search existing entries first and add relevant recipe associations instead of creating duplicates for the same technique.

Choose titles based on everyday lookup questions or tasks. Each reference must stand alone without requiring the video to be opened. Keep concrete methods, reasons, common errors and scope limits clear. Do not create every possible section when it would be empty or repetitive.

Classify by task: preparation; heat and doneness; seasoning and aroma; storage and meal preparation when sourced content exists. Food and technique search tags provide a separate lookup dimension. Source series are another dimension, not competing task categories. Do not freeze the collection at twelve entries or display empty categories for symmetry.

A shared reference may combine several source examples, but must preserve their different conditions. Cold-pan thighs do not establish a cold-pan rule for all food; off-heat salmon butter does not override near-doneness chicken basting. Soy sauce contacting a hot pan for aroma is a technique for a desired result, not a universal requirement for soy sauce. Recipe-specific amounts and timings retain their food and preparation context.

Never derive storage temperatures, durations, thawing or preservation procedures from a video that only demonstrates immediate cooking. Populate storage content only from appropriate evidence. Use the existing bilingual schema and recipe associations, and keep external references to the corresponding original YouTube videos for this video-derived collection.
