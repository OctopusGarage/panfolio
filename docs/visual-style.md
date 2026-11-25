# Visual direction

The interface uses mist white, pale sage, muted green text and restrained borders. Selected buttons use a pale green fill instead of a saturated accent. Small transitions respect reduced-motion preferences.

## Recipe covers

The current direction is natural food photography grounded in each recipe's original video. This supersedes the earlier watercolor/gouache direction: the user found the recent illustrations artificial and requested a complete source-based regeneration of the twenty-four added recipes. The original twenty recipe covers remain outside that refresh's scope.

Use 1536 × 1024 pixels (3:2), with no typography. Preserve the source's actual ingredients, cuts, food texture, portion, recognizable vessel, plating and viewing angle. Prefer an inspected finished-dish frame. Accessible original storyboard frames are useful when video media is unavailable; a readable original thumbnail is a fallback, not a reason to invent a cooked result or serving vessel.

Keep natural irregularities: uneven browning, realistic moisture, soft egg folds, individual rice and noodle texture, and ordinary kitchen or table context. Avoid excessive gloss, waxy meat, plastic vegetables, identical repeated pieces, unnaturally perfect stacks and uniformly styled studio food. Do not replace every background with paper, pale sage haze or a floating isolated plate. The interface palette does not determine the food photograph's setting.

Remove subtitle overlays, comparison panels, ticks, crosses, logos, portraits and hands while retaining the dish. Do not invent garnish, side dishes, ingredients or a different cut to improve composition. For a multi-preparation recipe, select one actual demonstrated preparation and record which one represents the cover.

Use the available image-generation tool with the dish's own original reference, never an earlier generated illustration or another dish as the content reference. Inspect the original before generation and every output afterward. Check food identity, cuts, vessel, geometry, texture, believable lighting and unwanted added elements. Regenerate material mismatches rather than accepting a style-only improvement.

Generated covers remain editorial reconstructions, even when photographic in appearance. Do not present them as original video captures, documentary photographs or exact evidence of recipe quantities. Keep reference-selection details and generation provenance in English editorial documentation, rather than adding stock disclaimers to recipe instructions.

## Presentation and assets

Include a source-informed cover with a new recipe. An unrelated text correction does not require regenerating an adequate cover. Keep the complete food composition and vessel within 3:2 where practical, with a modest natural margin. Cards and details display the full image without stretching or thumbnail-style cropping.

Original generated PNGs and downloaded source references remain outside version control. Store production JPEGs in `public/recipes/` using the stable recipe ID and retain `image: "./recipes/<stable-id>.jpg"`. Use the established responsive pipeline; do not introduce a parallel image system. Mobile downloads are capped at 768px; desktop uses width-based candidates up to the original resolution. Images are cached on demand and the service worker does not precache the image library. The build digest includes image contents so replacements trigger the existing scoped update lifecycle.

Verify source fidelity visually, natural dimensions, successful card/detail loading, full-image proportions and mobile source selection. Uniform dimensions do not require identical vessels, backgrounds or compositions. The original baseline references are recoverable at commit `55deb63` under `public/recipes/`.
