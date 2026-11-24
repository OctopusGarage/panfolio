# Recipe content guide

Add entries to `src/recipes.json`; there is no fixed collection size. Keep existing IDs unchanged so saved recipes and notes continue to work.

Each entry has `id`, simplified-Chinese `title` and `body`. Optional fields are `titleEn`, a concise `description`, an `image` path and a `source` URL. Keep translations with their entries. Place local photos in `public/recipes/`; the build automatically includes them in the offline cache.

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
