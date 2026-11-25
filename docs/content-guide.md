# Recipe content guide

Add entries to `src/recipes.json`; there is no fixed collection size. Keep existing IDs unchanged so saved recipes and notes continue to work.

Each entry has `id`, simplified-Chinese `title` and `body`. Provide `titleEn`, `bodyEn`, `description` and `descriptionEn` for the bilingual collection. `image` and `source` remain optional. Keep translations with their entries. Use 1536 × 1024 (3:2) recipe illustrations in the watercolor/gouache style described in [Visual direction](visual-style.md). Place image assets in `public/recipes/`; the build creates responsive derivatives; only viewed image variants are cached offline.

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

Do not repeat the dish title or embed its cover photo in the body; the detail layout renders both. Preserve supplied quantities, timing and actual methods. Remove conversational filler, decorative emojis, unsupported claims and duplicate descriptions. Keep useful video links in an optional `## 参考链接` section.

## English fidelity

Translate the complete ingredient, method, tip and reference sections. Use `Ingredients`, `Method`, `Tips` and `References` headings with matching step numbering. Preserve numeric quantities, ranges, timing and units. Keep unspecified spoonfuls unspecified. Do not convert qualitative doneness into percentages, shacha into satay, or ambiguous market names into asserted species. Record source ambiguities in the evaluation report rather than inventing instructions. Run `pnpm eval` and refresh `pnpm eval:report` after the actual bilingual review and corrections.
