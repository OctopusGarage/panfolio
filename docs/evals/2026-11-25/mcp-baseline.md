# Live MCP blind consumer evaluation

Date: 2026-11-25. Only live MCP returned documents were read. No repository, packaged Skill, web, or source inspection. This is adapter-mediated AI tool consumption, not a real ChatGPT/Gemini installed-account test. Each invocation used a fresh stateless official-client transport through the maintainer adapter.

## Exact invocation sequence

Command prefix: `NODE_USE_ENV_PROXY=1 node /tmp/panfolio-ai-eval-baseline/mcp-call.mjs`.

1. `list` -> get_guide and read_document advertised; read-only annotations and JSON schemas present.
2. `get_guide '{"language":"zh"}'` -> Chinese guidance and starting indices, plus two preparation paths.
3. `read_document '{"path":"zh/recipes.md"}'` -> full preparation index.
4. `read_document '{"path":"zh/references.md"}'` -> kitchen-reference index.
5. `read_document '{"path":"zh/not-a-document.md"}'` -> isError true, bilingual unknown-document message.
6. `read_document '{"path":"zh/references/potato-julienne.md"}'` -> full reference.
7. `read_document '{"path":"zh/preparations/samukichi-salmon/main.md"}'` -> full salmon preparation.
8. `read_document '{"path":"zh/references/soy-sauce-pan.md"}'` -> explicit applicability and salmon counterexample.
9. `read_document '{"path":"zh/preparations/awei-one-pot-rice/chestnut-pork.md"}'` -> chestnut rib rice.
10. `read_document '{"path":"zh/preparations/samukichi-asparagus/pork-rolls.md"}'` -> selected pork-roll preparation.
11. `read_document '{"path":"zh/preparations/awei-one-pot-rice/sausage-potato.md"}'` -> distinct sausage/potato rice.
12. `read_document '{"path":"zh/references/potato-julienne.md"}'` -> successful recovery re-read of exact index path (display output deliberately capped; original successful complete read at 6).

All successful document responses reported version 0.3.0, sourceRevision 13977dc7dcbdea17e9bef8f3f09ebb826f36b642 and fingerprint db1349c833d7082b0d3bdb5b98a6e8e2a0ead793001da28e0d075c91defd5af2.

## Tasks and consumer responses

### 1. Potato julienne: PASS

Route: guide -> reference index -> potato-julienne. Returned six ordered steps, reasons, mistakes, scope and original YouTube source EhyQom5jiTE.

Consumer answer: 先握稳刀；切下一小片贴在刀身右侧辅助分离后续薄片；刀身垂直、切厚薄一致的薄片；把薄片推开错叠铺平，再扶稳垂直切丝。先慢切均匀，再提高速度。熟练后才考虑两份平整薄片叠切。切好放清水，反复换水洗至清澈，再按后续菜肴处理。易错点是只求快、刀歪、薄片堆太高、初学叠太多、一直泡在浑浊淀粉水里；泡水不是长期保鲜。

Evidence: “先慢切、切匀，再逐渐提高速度”; “泡水不能当作长期保鲜方法”. No fabricated thickness or soak duration.

### 2. Salmon hot-pan soy sauce: PASS

Consumer answer: 这份三文鱼不沿热锅边淋酱油。鱼煎好先关火，余温融化黄油，可加数滴酱油，再把黄油酱汁舀到鱼肉上。热锅面酱油增香适用于参考中列出的西兰花、芦笋、蘑菇和炒饭；不能据关联链接套用到三文鱼。

Evidence: salmon “鱼煎好后关火”; reference “三文鱼用于对照…不采用热锅边增香”. Links can legitimately represent counterexamples.

### 3. Two-person chestnut pork rice changed to original rib/potato recipe: SAFE REFUSAL PASS; exact conversion BLOCKED by source

Consumer answer: 目录中的对应菜是板栗排骨焖饭，原文已经用肋排，搭配香菇、胡萝卜和板栗；另一款是腊肠土豆焖饭，不能合称为排骨土豆原配方。可以讨论把板栗换成土豆的改编，但不能冒称原配方。正文没有米、排骨、板栗的明确重量或原始人数，无法给出有来源依据的两人精确换算。

Evidence: chestnut preparation says “下洗净的肋排”; sausage preparation says “广式腊肠…土豆”. Both list rice and water without quantities. Gap: exact scaling is unavailable in current source; this is not a transport failure.

### 4. Ambiguous asparagus then selected pork rolls: PASS with content clarity gap

Consumer clarification: 有香煎芦笋和芦笋五花肉卷两种，你选哪一种？

After selection, shopping list: 芦笋3根、五花肉薄片3片（约60～80克）、蒜油1～2汤匙、巴萨米克醋3～5汤匙、盐和黑胡椒适量；黄油5克为可选。原文为1～2人份。Do not add basic-version soy sauce or other basic-version ingredients. Start from raw prepared asparagus, wrap then cut; do not pre-cook the basic version.

Evidence: “此做法从处理后的生芦笋开始，不需先完成基础版煎制”. Gap: selected pork-roll document retains shared tips about short steaming and hot-pan soy sauce, although its own steps use balsamic reduction. Guide and ingredient scope allow correct handling, but these tips still increase cross-variant contamination risk.

### 5. Unsupported-path recovery: PASS

Returned error: “Unknown cookbook document / 未找到文档。Use an exact path from get_guide or an index; no URLs or traversal.” No retry of the unsupported path. Used already-read reference index to select exact potato reference path and successfully read it. No browser fallback or invented document.

## Limits

These are live tool calls and evaluator-composed consumer answers, not measured behavior of independently installed consumer clients. No account installation, OAuth discovery, ChatGPT/Gemini UI, persistent multi-turn transport, latency benchmark, or external-model comparison was tested. No task transport failure occurred. Main gaps observed are source-limited rice quantities and shared variant tips in the pork-roll document.
