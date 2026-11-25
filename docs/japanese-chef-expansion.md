# Japanese chef expansion — nine videos

Reviewed on 2026-11-25. This adds nine bilingual recipe entries to the Japanese chef collection, including three separate tuna preparations within one entry. Existing IDs remain stable. All nine have source-informed watercolor/gouache covers, original YouTube references, both video-provider associations and relevant kitchen-reference links.

## Evidence boundaries

Original creator descriptions and Bilibili metadata were reviewed. Complete source-media byte sizes were checked. Embedded bilingual captions were extracted by OCR from frames sampled every three seconds, with focused frame checks and recovery of incomplete tails. This is not an acquired YouTube subtitle track, an original-audio transcription, or uninterrupted footage review. YouTube caption requests were rate-limited. Source media, OCR and generated PNG originals remain outside version control.

## Cover review

Covers follow the existing 1536 × 1024 watercolor/gouache style and responsive-image pipeline. Mushrooms, cauliflower and caramelized onions use their own source thumbnails and reviewed cooking context; mushroom cutting was corrected to chunky quarters. Yakisoba, shrimp, tuna eggs, chicken breast, steak and fried rice use inspected frames from their own videos. Whole shrimp retain their shells and heads; chicken retains its cast-iron pan; steak retains mustard cream sauce. Optional ornamental accompaniments are omitted except the source-supported tuna green beans and ketchup. Illustrations are editorial interpretations, not documentary evidence of quantities or exact plating.

## Batch A editorial evidence

## Cauliflower — BV1qkxE62Eau / _ki3H1gioig

Reviewed the original YouTube description, Bilibili source metadata and full available OCR text from embedded Chinese/English captions sampled every three seconds (0–408 seconds). This is OCR evidence, not an acquired subtitle track or a claim to uninterrupted video review. The description supplies 300 g cauliflower, about 2.2 g salt, garlic oil/olive oil and optional cheese ingredients. OCR supplies the practical cut-face, washing/drying, light oil, tray spacing, convection-oven preheat, 220°C (425°F), first 12 minutes, 1–2-minute extensions if pale, one turn and about 5 minutes more. Both deep cut-face color and browned edges matter; the cheese finish follows the completed basic roast. Cheese quantities and broiling duration remain unspecified. Black pepper/lemon finishing is explicit in OCR. No raw/roasted cauliflower variation is merged accidentally.

## Yakisoba — BV1LQyJzLEa7 / U3C2MIUxkjA

Reviewed original YouTube description, Bilibili source metadata and full available OCR text (0–408 seconds). OCR is sampled embedded Chinese/English caption evidence, not an acquired subtitle track. Original description supplies all numerical ingredient amounts and distinguishes steamed-yakisoba weight from replacement noodles. OCR establishes warming without tearing, material-dependent medium wok heat, oil separately for noodles/fillings, noodles cooked alone without constant turning, removal, pork cooked through before onion/carrot then cabbage, batching, tiny water only for sticking, evaporation before sauce, and reduced heat for easily burned sauce. No warming duration, searing duration, raw-noodle weight or vegetable dimensions invented. Japanese Worcestershire differs from Western sauce; substitutions remain adjusted-to-taste, and commercial yakisoba sauce remains an alternative.

## Reference decisions

New references cover cauliflower roasting geometry/oven conditions and yakisoba moisture sequencing. Existing dry-before-searing is explicitly scoped to salmon/chicken/asparagus; contact-and-turning concerns skin contact and natural release, not oven vegetables/noodles. No association is added merely because a broad theme overlaps; the mushroom hot-pan soy sauce association below is an explicitly demonstrated match. These new references retain cooking-specific exceptions and do not infer storage guidance.

## Mushrooms — BV1LFyszxEg7 / 6Aa3aFccue8

Reviewed original YouTube description, Bilibili metadata, all 14 OCR sheets from embedded bilingual captions sampled every three seconds, plus individual snapshots at 99 seconds (water amount) and approximately 231–237 seconds (butter/garlic). Source MP4 size is 31,040,189 bytes, exactly matching play metadata; ffprobe duration 327.842540 seconds matches expected 327842 ms. One OCR sheet initially failed and was successfully rerun with the clipsmith-ocr executor; its text covers the undisturbed-browning/turning instruction.

Material source conflict: original description/Bilibili description say about 20 ml water, whereas both visible Chinese and English captions at 99 seconds say 10 ml. The recipe uses the directly verified demonstrated 10 ml, without silently presenting the description amount as confirmed. Screenshot shows chopped garlic in the finishing butter; added that practical preparation detail. No minute-based cooking duration is supplied, so phase transitions use evaporation, sound, color and aroma. Butter 10 g, garlic 1 clove, soy sauce 5 g and mushrooms 3 come from the original description; water 10 ml comes from the verified on-screen instruction.

The mushroom method is a useful new reference distinct from drying food before searing: drying after washing and deliberately using a little water in the first pan phase are different operations. Added the explicitly demonstrated hot-pan soy sauce association; the existing reference should broaden its scope to include mushrooms if the integration maintains enumerated food examples. A late butter finish is retained in the recipe and new mushroom reference; no blind association to existing narrowly worded salmon/chicken butter steps.

## Coverage and checks

Verified cauliflower source file size 35,664,725 bytes and yakisoba source file size 49,119,082 bytes exactly match their play metadata. Existing yakisoba snapshot manifest ended at 396 seconds despite a complete 421047 ms source video. Extracted a fresh full snapshot set at `/tmp/panfolio-batch9/yakisoba-full` and visually checked tail frames around 405, 411 and 417 seconds: serving footage, “HEAT BUILDS FLAVOR. MOISTURE SHAPES TEXTURE.” and end card; no missing practical recipe instruction found there.

All three recipe drafts pass the repository's `evaluateTranslation` checks with empty issues, using pnpm exec tsx. New reference numeric/unit comparisons also pass when their localized fields are assembled under matching headings. Draft files only; no repository content or image assets modified.

## Batch B evidence review

All recipe source fields retain the supplied canonical Bilibili page; reader references point only to each corresponding original YouTube video. Original descriptions were read from locally saved yt-dlp info JSON; Bilibili metadata establishes the original-video mapping. No YouTube caption retries were made.

## Tuna (LWa4RVPltBw / BV1dQyQzeEpH)

Read the entire sampled-3-second embedded bilingual subtitle OCR, covering approximately 0–552 seconds, and the complete original description. Ingredient quantities come from the original description. Method and counterexamples come from subtitles. Preserved all three independent preparations, late tuna addition, retained oil for oil-packed tuna, mayonnaise/acidity balance, salted/blotted tomatoes, garlic rubbing plus garlic mayonnaise, brief final oven bake, cooled rice, and soy sauce contacting the pan edge. Description gives grated garlic amount for mayonnaise but no amount for rubbing toast; the latter is separately named without an invented quantity. Eggs and fried rice visibly use cooking oil but its quantity is unspecified. Optional ketchup and green beans are retained as accompaniments; no unsupported preparation instructions are invented for the garnish.

The video discusses slightly warming very cold tuna for gentler flavor, but supplies no storage duration. The recipe keeps that sensory observation without any room-temperature holding duration or canned-fish storage claim. New reference covers cooking and specifically limits oil advice to oil-packed tuna.

Initial draft passes evaluateTranslation from src/recipe-eval.ts with no issues.

## Shrimp (RPSQe3eZ6GA / BV1Wenv6bE44)

Read complete embedded bilingual OCR through the ending (~480s). Confirmed 15 g garlic oil, a pinch of sliced chili, a small splash of white wine (sake), about 5 g butter and about 10 g soy sauce. Original description supplies no extra quantities. Full-frame snapshot 000132 (393s) confirms shell-on shrimp being turned in the pan. Main prep preserves removal of sharp shell points, gap near the second/third segment, bending to open the gap, lifting vertically rather than tugging, alternative fork/interdental-brush tool with slipperiness caveat, very-small-shrimp exception, and gentle rinse rather than soaking/rubbing/salt-scrubbing. English embedded subtitle calls the alternative an interdental brush whereas Chinese loosely says toothbrush; use the more precise original English meaning. Alcohol is rendered white wine or sake, avoiding the Chinese term baijiu.

## Onion (8IpPp_MSQMI / BV1zJyDzqESu)

Read complete original description and full embedded bilingual subtitles. Original MP4 advertised 481s but contained only 29,506,455 of the expected 45,590,969 bytes, ending decoding near 300s. Downloaded the original Bilibili media again into onion-complete.mp4, confirmed expected byte size, and OCRed 300s–end into onion-tail/*.jpg.txt. No captions were retried. First section supports even 2–3 mm slices, 5 ml (1 tsp) oil, medium-low heat, pinch of salt, pauses between stirring, repeated water deglazing, distinction between brown fond and bitter burnt deposits, and time guides 10–15/20–30/30–40 minutes. Heat level and onion amount affect cooking time; source retains a little onion texture for soup.

Tail confirms soup garlic is sliced, slowly warmed over low heat without browning. Add water and bouillon and simmer a few minutes, adjust salt, TURN OFF HEAT, then add caramelized onions and mix gently, warming through by residual heat to preserve texture and aroma. Preserved these source-specific details rather than simmering the onions in the soup. The optional chicken is already cooked; asparagus remains a serving accompaniment without invented preparation.

Storage section explicitly states refrigerated 3–4 days and frozen about 2–3 months. Full-frame contact sheet onion-storage/contact.jpg (345–380s) confirms onions going into a resealable bag, flattened and sealed, followed by the bilingual storage duration text. Added recipe batch-storage step plus new storage reference. No temperature, cooling duration or thawing instructions have been invented. Integration adds the populated storage category in kitchen-essentials.ts.

## Final draft verification

All three draft objects pass evaluateTranslation from src/recipe-eval.ts with no issues (section structure, sequential bilingual numbering, numeric quantities, measured units and reference URLs). Repository shared files were not edited. Integration and project checks are performed after draft review. New reference entries: canned-tuna-oil-and-heat, devein-shrimp, caramelize-onions, store-caramelized-onions. Existing associations: soy-sauce-pan/tuna, dry-before-searing/shrimp, garlic-oil/onions.

## Batch C evidence record

All entries preserve the provided Bilibili canonical provenance and use the corresponding original SAMUKICHI YouTube video as their sole reader-facing reference. Creator descriptions were read from local yt-dlp info JSON, alongside Bilibili metadata descriptions. The completed caption and visual review is recorded below.

## Chicken breast

Bilibili BV1CryvzTECp; original https://www.youtube.com/watch?v=2YXtnZybJtI. Creator description supplies 80–85°C WATER, not center temperature; plastic-free alternative rests salt/sugar-seasoned meat 10–20 minutes and then cooks directly in the water. Heat-resistant bags must be explicitly suitable for cooking and kept away from pot bottom/sides. Do not treat the brand-wide 100°C claim as a general guarantee for all bags. The 50°C rinse is a preparation step, never a pathogen-killing step.

Independent safety check: USDA FSIS https://ask.fsis.usda.gov/article/What-is-a-safe-internal-temperature-for-cooking-meat-and-poultry and federal FoodSafety.gov https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures, accessed 2026-11-25, specify poultry internal temperature 74°C (165°F), measured with a thermometer. This is an explicitly separate safety completion criterion; do not invent a source cooking duration or substitute water temperature for center temperature.

## Steak

Bilibili BV19CyVzxEsv; original https://www.youtube.com/watch?v=5OneMsDQQPM. Creator description contains complete ingredients (250 g sirloin, thickness 2.5–3 cm; browning butter about 5 g; sauce white wine or water 30 ml, heavy cream 40 ml, whole-grain mustard 10 g, butter 5 g, pepper/salt/water as needed). It explicitly recommends USDA 63°C (145°F) internal with at least 3 minutes rest. Verified independently against the same federal sources above. Source culinary targets, if present in subtitles, must remain distinguishable from safety guidance. Crust helps flavor; no impermeable-sealing assertion is retained.

## Fried rice

Bilibili BV1Pin26oEnV; original https://www.youtube.com/watch?v=0loSYanxAfE. Creator ingredient list: oil 1 tbsp, egg 1, Japanese cooked rice 200 g (Calrose/sushi rice alternatives), water 30 g, garlic 1 clove, red bell pepper 1/4, green pepper 1 small, salt 1 tsp, soy sauce a small amount. Salt quantity is preserved as source quantity rather than silently changed. Water amount remains measured in grams, not an invented conversion.

## Completed caption and visual review

Recovered complete MP4s for C using first Bilibili API backup URLs. API byte-size checks match: chicken 32,388,083; steak 44,154,311; fried rice 64,055,712. Preserved the initial incomplete fried-rice download as `.mp4.partial`. Clipsmith fixed snapshots sampled every 3 seconds; the existing OCR script cropped the lower subtitle band and tiled eight frames per sheet, then used the native Vision OCR wrapper. Read all three resulting OCR transcripts in full. Steak sheet 010 initially failed, reran successfully and reviewed its output (temporary pan removal and avoid resting in hot pan); its contents also appear in neighboring output. Do not interpret sampled OCR as a full original-audio transcription.

Inspected full snapshot steak 000131 (plated slices, pale grain-mustard cream sauce, green beans/carrot) and chicken 000111 (golden-browned skin-on breast in cast-iron pan), as well as fried rice 000185 (finished portion). These support source-informed cover production, completed during integration.

Chicken OCR confirms salt 3 g (1%) and sugar 1.5 g (0.5%) for 300 g meat; 10–20 minute seasoning; 23–25 minute immersion; and explicitly requires center at least 74°C/165°F. If lower, source reheats water to 80–85°C and continues a few minutes. The source's 30 seconds after boiling/off-heat is retained as an example/counterexample, never a physical guarantee that water has reached 80–85°C. The transcript includes exaggerated claims that surface contraction stops heat reaching the center and gentle cooking prevents all undercooking; these are not repeated. Final method measures both water and center temperature.

Editorial deviation: the video includes 50°C washing for 1–2 minutes before patting dry. This operation is omitted from reader-facing directions: USDA FSIS explicitly advises against washing raw poultry because it spreads bacteria via cross-contamination (https://ask.fsis.usda.gov/article/Should-I-wash-chicken-or-other-poultry-before-cooking; also https://ask.fsis.usda.gov/article/Is-it-necessary-to-rinse-soak-or-brine-chicken-to-make-it-safe). Accessed 2026-11-25. Default is trimming and patting dry, with cleanup of contacted hands, utensils and surfaces. No claim that warm washing disinfects poultry, removes all odor, or is necessary for safety is retained.

Steak full captions confirm: salt immediately before cooking OR salt then rack/uncovered refrigeration at least 45 minutes; initial medium heat adjusted as needed; brown fatty edge/opposite edge then broad sides; lower heat after browning and turn every 30–60 seconds; remove from hot pan to rest. Caption culinary targets are 57°C medium-rare, 63°C medium, 71°C well-done. Recipe distinguishes preferences from USDA 63°C plus at least 3-minute rest. Sauce is wine/water deglazing, wine reduced by half, low-heat cream thickening, then mustard/butter off heat. Initial searing butter and off-heat sauce butter are intentionally distinct.

Fried-rice full captions confirm cooled/slightly surface-dried short-grain rice; medium heat base/high as necessary; egg lightly cooked first; immediate breaking of rice clumps; 30 g water followed by evaporation; alternating spatula spreading/pan contact/mixing; garlic after drying (or a separate low-heat garlic-first alternative); peppers, salt then soy sauce against hot pan. Quantities confirmed again in continuous demonstration. Omitted overconfident sealing-style explanations. Preserved the 1-teaspoon salt listing, instructing gradual tasting rather than adding it all without checking.

## Essentials and association integration

Two new scoped heat references: chicken water-versus-center measurement, and short-grain fried-rice loosening/pan contact. The chicken essential uses source-supplied center-temperature guidance and does not infer storage advice or validated sous-vide pasteurization schedules. Existing associations file contains additions only. When merging `butter-timing`, explicitly add initial steak butter and final chicken browning as separate cases; do not imply the existing off-heat-salmon/late-chicken-thigh timings apply. When merging `garlic-oil`, add the fried-rice garlic-first low-heat alternative while retaining the main after-drying sequence. `contact-and-turning` should explicitly distinguish steak's post-browning 30–60 second turns from initial undisturbed browning. No broadening of chicken-thigh trimming reference to chicken breast.

## Verification

Ran the repository's `evaluateTranslation` on all three temporary draft objects: all return empty issue arrays, including numeric, measured-unit, heading, step and reference parity checks. No repository files were edited. Integrated content is covered by the whole-repository checks.
