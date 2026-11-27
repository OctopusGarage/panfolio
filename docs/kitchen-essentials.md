# Kitchen essentials

Kitchen essentials is a separate bilingual reference collection at `#essentials`. It extracts reusable preparation and cooking knowledge without removing instructions or tips from recipes. Application help remains at `#guides` under the name User guide, linked from the reference index.

## Organization

The collection contains thirty-seven independently useful references. It has keyword search and no category or tag filters. Titles, summaries and a visible first step support everyday lookup; each card links clearly to complete instructions. Detail pages prioritize the written operations before video playback.

Content lives in `src/kitchen-essentials.json`; recipe association helpers live in `src/kitchen-essentials.ts`. Routes use stable reference IDs, for example `#essentials/soy-sauce-pan`. Existing recipe IDs, favorites and notes are unchanged. Reference pages link to associated recipes when present; recipes expose Related kitchen essentials. Standalone references use their own original YouTube sources for video playback and labels, and omit the empty related-recipes section.

## Editorial rules

Each entry has a localized title, summary, scope, practical steps, explanations, common mistakes, applicability limits, recipe IDs and YouTube sources. Keep both languages complete, with matching quantities and timings. Keep necessary operational detail. Avoid editorial statements about the extraction process in reader-facing content.

Shared explanations are written once per reference, while recipe tips retain their cooking context. Do not promote a source-specific instruction into a universal rule. In particular, preserve cold-pan chicken versus preheated salmon, off-heat butter versus near-doneness chicken basting, and hot-pan soy sauce aroma versus off-heat butter-soy sauce. Broccoli blanching and salmon salting times remain tied to those preparations.

The initial content is based on the reviewed SAMUKICHI captions and descriptions documented in `japanese-chef-series.md`. Video links remain YouTube-only. References with synthesized explanations label those links Related videos and expose an evidence-record link; Markdown and AI exports preserve this distinction. Storage durations, thawing instructions and garlic-oil preservation guidance are not inferred from immediate cooking methods.

## Verification

Unit checks cover bilingual field completeness, unique IDs, absence of removed categories/tags, valid recipe associations, YouTube source domains, measured-value parity and critical conditional boundaries. Browser coverage visits every reference in both languages, verifies visible complete steps and limits, plain search, recipe round trips, empty results, accessibility and mobile layout. Existing recipe and application checks continue to apply.

## Ongoing extraction

Whenever new recipe material is organized, review it for reusable knowledge. Preserve full instructions and contextual tips in the recipe; additionally create or improve a reference when the knowledge is useful independently. Search existing entries first and add relevant recipe associations instead of creating duplicates for the same technique.

Choose titles based on everyday lookup questions or tasks. Each reference must stand alone without requiring the video to be opened. Keep concrete methods, reasons, common errors and scope limits clear. Do not create every possible section when it would be empty or repetitive.

Use positive ingredient and technique synonyms for keyword lookup. Do not recreate task, occasion, season, source or equipment filter groups. A phrase such as preparing ingredients ahead belongs in the relevant procedure, not a meal-occasion category.

A shared reference may combine several source examples, but must preserve their different conditions. Cold-pan thighs do not establish a cold-pan rule for all food; off-heat salmon butter does not override near-doneness chicken basting. Soy sauce contacting a hot pan for aroma is a technique for a desired result, not a universal requirement for soy sauce. Recipe-specific amounts and timings retain their food and preparation context.

Never derive storage temperatures, durations, thawing or preservation procedures from a video that only demonstrates immediate cooking. Populate storage content only from appropriate evidence. Use the existing bilingual schema and recipe associations, and keep external references to the corresponding original YouTube videos for this video-derived collection.

Related recipes may include comparisons. Use the neutral heading “Related recipes” and explicitly explain a contrasting association when needed, as in the salmon off-heat soy/butter example. Do not imply that every linked recipe uses the same technique.
