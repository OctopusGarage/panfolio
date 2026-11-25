# Simplification and kitchen-reference review — 2026-11-25

## Approved product scope

The cookbook now has three exclusive practical categories: Chinese (29 recipes), Japanese chef series (14, including all 13 SAMUKICHI recipes and the existing Nikujaga), and Desserts (one). The initial view can show all 44 recipes. Kitchen essentials is a searchable collection of 31 references without category or tag controls.

Meal occasions, preparation stages, seasons, ingredients, methods, equipment and authors no longer compete as filter groups. “Prepare ahead” described a preparation task, not a meal occasion; this conceptual mismatch was one reason to remove the taxonomy rather than rename an isolated option. The runtime tag table and facet-matching/counting controls were removed. Existing private backup fields are preserved for compatibility and do not affect current results.

## Evaluation passes

1. Independent structure and interaction reviews checked the three-category partition, every SAMUKICHI preparation, keyword search, route state and old-data preservation. The 14-entry Japanese category is explicitly broader than the 13-entry SAMUKICHI source collection; attribution remains unchanged.
2. Two editorial passes reviewed all 31 reference entries against linked bilingual recipe bodies and existing source records. Titles and summaries were clarified, operational details expanded where needed, and explanations/conditions retained. Existing useful detail was not padded merely to increase length.
3. A separate independent AI review examined the revised 31 entries for contradictions, unsupported generalization, timing/temperature errors, bilingual differences and misleading associations. It found an ambiguous fried-rice finishing instruction; the source restriction to relatively dry vegetables or fully cooked meat was restored in both languages, including an explicit warning against adding raw meat in that brief finishing stage.
4. Browser and model checks exercise all reference pages in Chinese and English, preparation boundaries, the three category choices, responsive layouts, accessibility, navigation, privacy, persistence, offline recovery and source video behavior.

## Specific corrections

- The soy-sauce reference previously called every related recipe an application example even though salmon was linked as a contrasting off-heat butter/soy method. The heading is now neutral, with an explicit comparison note. Tuna fried rice remains a valid application: its existing method expressly pours soy sauce around the hot pan edge.
- Thigh turning and later steak turning are distinguished rather than appearing to contradict one another.
- Butter basting is explained as tilting the pan and spooning fat over the food; titles avoid unexplained editorial shorthand.
- The soy-sauce procedure no longer repeats unrelated salt/butter explanations.
- The carrot-cutting reference no longer relies on an unsupported nutrient-loss explanation.
- Sago's brief initial boil is separated from its subsequent covered resting/reboiling; no short total cooking-time claim is made.
- Rice-cooker variations remain separate preparations, with liquid counted per selected method rather than combined across recipes.
- Reference cards show a concrete starting step and a clear link to complete instructions. Detail pages put the procedure before video playback, then explain reasons, mistakes and cases where the method should not be copied directly.

## Entry coverage

All entries retain their stable IDs, original YouTube sources and recipe associations. The review covered washing/cutting broccoli; asparagus preparation; chicken trimming; surface drying; salmon salting; cold versus preheated pans; contact and turning; blanch/chill/drain; sear/steam; hot-pan soy sauce; butter timing; garlic oil; cauliflower browning; yakisoba sequencing; mushrooms; canned tuna; shrimp cleaning; caramelizing onions; storing onions; chicken water/core temperatures; fried rice; cooking sago; storing sago; basmati liquid; onion slicing; carrot julienne; potato julienne; pepper cutting; noodle draining; shrimp/egg handling; and rice-cooker liquids.

## Evidence limits and final checks

Editorial evidence in this pass consists of existing recipe bodies and source records, not newly reviewed original footage. Source-specific storage periods remain tied to their recipes, and the pre-existing 74°C chicken safety addition was retained rather than invented or attributed anew to the video. Historical facet proposals are superseded by the current [maintenance guide](discovery-guide.md).

Final verification passed: 54 unit tests, 140 Chromium/WebKit browser tests, bilingual evaluation of all 44 recipes, strict production build, formatting and whitespace checks. The new `kitchen-reference-eval.spec.ts` visits every reference in both languages and checks complete step rendering, applicability limits, neutral related-recipe labels, no automatic video loading and procedure-before-video order. It also checks all 31 card previews and the salmon comparison. The classification tests require exactly three categories and ensure legacy facets cannot hide content.
