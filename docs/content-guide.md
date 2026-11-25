# Recipe content guide

Add entries to `src/recipes.json`; there is no fixed collection size. Keep existing IDs unchanged so saved recipes and notes continue to work.

Each entry has `id`, simplified-Chinese `title` and `body`. Provide `titleEn`, `bodyEn`, `description` and `descriptionEn` for the bilingual collection. `image` and `source` remain optional. Keep translations with their entries. Use 1536 × 1024 (3:2) source-grounded photographic covers following [Visual direction](visual-style.md). Preserve the original food and natural texture rather than adding decorative or artificial-looking elements. Place image assets in `public/recipes/`; the build creates responsive derivatives; only viewed image variants are cached offline.

Use this Markdown structure:

```markdown
## 食材

- 鸡蛋 2 个
- 盐适量

## 做法

### 1. 准备食材

鸡蛋打散，加盐拌匀。

### 2. 炒熟出锅

热锅加油，倒入蛋液，炒熟后出锅。

## 小贴士

- 调味可按个人口味调整。
```

Use short action titles and complete sentences. Keep step numbering sequential. Use spaces between Arabic numbers and units, `～` for ranges, and Chinese punctuation. Omit unneeded tips and reference sections rather than adding empty headings. Collections may omit a shared ingredient list and use one numbered third-level heading per preparation.

Do not repeat the dish title or embed its cover photo in the body; the detail layout renders both. Preserve supplied quantities, timing and actual methods. Remove conversational filler, decorative emojis, unsupported claims and duplicate descriptions. For video-derived recipes with an original YouTube source, the `## 参考链接` section contains only that corresponding YouTube video. Do not add Bilibili chapter links, timestamp lists or duplicate source links. If an original YouTube source cannot be established, preserve the supplied source and resolve the reference treatment rather than inventing a YouTube URL. Older non-video sources need not be rewritten solely to conform to this workflow.

## English fidelity

Translate the complete ingredient, method, tip and reference sections. Use `Ingredients`, `Method`, `Tips` and `References` headings with matching step numbering. Preserve numeric quantities, ranges, timing and units. Keep unspecified spoonfuls unspecified. Do not convert qualitative doneness into percentages, shacha into satay, or ambiguous market names into asserted species. Record source ambiguities in the evaluation report rather than inventing instructions. Run `pnpm eval` and refresh `pnpm eval:report` after the actual bilingual review and corrections.

## Detail, explanations and reader-facing copy

The goal is clear, complete cooking instructions, not the shortest possible text. Keep the practical sequence, heat level, timing where given, sensory cues, doneness checks and necessary operational explanations in the method. Retain useful counterexamples and the reasons behind techniques in the closing Tips section. Necessary explanations may remain beside their steps; avoid duplicating the same paragraph merely to fill a section.

Remove editing-process statements such as “adapted from English subtitles,” “the video does not specify a weight” or “no alternative was provided.” An ingredient may simply be named when no quantity is supplied. Do not replace absent quantities with invented measurements or add a stock disclaimer to each line. Record meaningful source gaps, conflicts and the evidence actually reviewed in an English editorial document, such as a series source record. If a missing instruction makes a preparation unusable, resolve it from the source or keep it clearly as a serving idea rather than fabricating a complete recipe.

Preserve the video's useful mistakes-and-corrections material: what goes wrong, the visible result, what to do instead and the relevant reason. Do not repeat promotional claims or treat a chef's explanation as permission to invent scientific mechanisms. For example, describe surface drying as helping browning; do not assert that searing creates an impermeable seal.

Keep alternative preparations distinguishable. A bonus roll preparation may start from raw asparagus even when the main preparation uses already-seared asparagus. A serving suggestion without a sauce recipe remains a serving suggestion. Do not imply that every numbered variation must be performed in succession.

Every curated entry has one explicit `category`: `chinese`, `japanese`, `dessert` or `drinks`. These are the approved practical browsing shelves, labeled Chinese, Japanese chef series, Desserts and Drinks in English. Keep this taxonomy simple; do not add ingredient, cuisine or course filter layers without a new user request. Never infer categories from title keywords. All SAMUKICHI entries and the original nikujaga recipe belong to Japanese chef series; dessert recipes belong to Desserts, and beverages belong to Drinks. The remaining existing entries belong to Chinese. New dishes require an explicit editorial assignment. Category values are validated; the catalog test requires every curated entry to have one.

Collections group recipes by a meaningful theme or source independently of their browse category. A fixed count from a previous task is not a collection limit. When ingesting new material, also assess whether it contributes reusable Kitchen essentials entries under [their content rules](kitchen-essentials.md).

## Discovery metadata

Follow [the discovery maintenance guide](discovery-guide.md) for the four approved categories, preparation boundaries, ingredient aliases and kitchen references. Do not reintroduce the removed multi-facet taxonomy or tag controls. Preserve both language selectors and stable parent IDs.
