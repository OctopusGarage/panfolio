# Visual direction

The interface uses mist white, pale sage, muted green text and restrained borders. Selected buttons use a pale green fill instead of a saturated accent. Small transitions respect reduced-motion preferences.

Recipe covers are AI-generated watercolor/gouache food illustrations made for Panfolio. The selected direction keeps ingredients recognizable without the visual noise of video thumbnails or exaggerated cartoon characters. All image assets are 1536 × 1024 pixels (3:2), with no typography. Each cover is redrawn from its own original reference, preserving the recognizable vessel, food proportions, sauce texture, plating and viewing angle. Uniform dimensions and rendering do not mean identical bowls or compositions. Original generated PNG files remain outside the repository; responsive JPEG derivatives are generated at build time and requested variants are cached on demand.

Both list cards and detail covers display the full illustration at 3:2 without stretching or the previous video-thumbnail crop. Mobile downloads are capped at 768px; desktop uses width-based candidates up to the original resolution. The service worker does not precache the image library. New recipe illustrations should follow the same source dimensions and rendering style, using their own source photos rather than another dish illustration as the reference. Remove subtitle overlays and portraits while retaining the dish itself. Original references for this collection are recoverable at commit `55deb63` under `public/recipes/`.

## New recipe covers

Include a source-informed cover when adding a new recipe. A text-only correction does not require regenerating an adequate existing cover. Use each dish's own video frame or source photo where available; a readable original thumbnail can serve as a fallback. Inspect the reference before generating. Never use another dish's illustration as the content reference.

Preserve the recognizable food shape, cut, vessel, proportions, sauce and viewing angle. Represent the successful preparation, removing comparison panels, failure examples, captions, ticks, crosses, portraits and logos. Do not invent garnish, side dishes or ingredients to make the composition richer. When interpreting a cooked result from a preparation thumbnail and recipe, record that distinction in the editorial evidence rather than claiming an exact final-frame reproduction.

Use the available image-generation tool, inspect every output, and correct material mismatches. Keep original generated PNGs and downloaded references outside version control; retain production JPEGs under `public/recipes/`. Use `image: "./recipes/<stable-id>.jpg"` on the recipe. Run the existing build pipeline for responsive variants rather than introducing a parallel image system. Verify full-image 3:2 presentation in cards and details, natural dimensions, successful loading and mobile source selection.

Do not present generated illustrations as documentary photographs or exact evidence of recipe quantities.
