# Published plugin blind consumer evaluation

Date: 2026-11-25. Evaluator read only the installed plugin manifest, Skill and release reference under `/tmp/panfolio-ai-eval-baseline/plugin`, plus actual public Markdown using the host `web.run` URL reader. This is a manual consumer execution of the installed instructions, not a ChatGPT portal installation or a separate model benchmark. No repository sources, documentation or tests were consulted.

Installed version: 0.3.0. Manifest advertises Read capability, HTTPS text reading and no private app access. Skill and release reference identify revision `13977dc7dcbdea17e9bef8f3f09ebb826f36b642`.

## URLs and retrieval evidence

All five requests succeeded as text/plain on the first attempt; no shell retrieval or rendered fallback was used.

1. https://raw.githubusercontent.com/OctopusGarage/panfolio/13977dc7dcbdea17e9bef8f3f09ebb826f36b642/content/zh/recipes.md (267 lines)
2. https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/preparations/samukichi-asparagus/pork-rolls.md (61 lines)
3. https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/preparations/samukichi-salmon/main.md (66 lines)
4. https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/preparations/ali-coconut-sago/main.md (60 lines)
5. https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/references/cook-sago-pearls.md (35 lines)

## Executed conversations

### 1. Broad asparagus discovery, then pork-roll selection — PASS

Prompt: “看看芦笋有什么做法，先让我选”

Consumer response: “找到两种独立做法：① 香煎芦笋；② 芦笋五花肉卷。你想选哪一种？”

Follow-up selection: pork rolls.

Consumer response: “选芦笋五花肉卷。1～2 人份用芦笋 3 根、五花肉薄片 3 片（约 60～80 克）、蒜油 1～2 汤匙、巴萨米克醋 3～5 汤匙、盐和黑胡椒适量；黄油 5 克可选。削根部硬皮并擦干，从生芦笋开始缠肉再切段，中火滚动煎至金黄、猪肉熟透，加入醋略收汁，关火撒黑胡椒。无需先做基础香煎版。”

Evidence: index has two separate preparation links. Pork-roll document explicitly starts from raw asparagus. Shared tips still include basic-version steaming and soy-sauce advice: a consumer must apply the Skill's scope filter to avoid incorrectly importing those steps.

### 2. Combined shopping list excluding alternatives — PASS

Prompt: “给芦笋肉卷和煎三文鱼合并采购清单，别把备选配料算成必买”

Consumer response: “必备：芦笋 3 根；五花肉薄片 3 片（约 60～80 克）；蒜油 1～2 汤匙；巴萨米克醋 3～5 汤匙；带皮三文鱼；食用油；黄油（三文鱼用，原文未给量）；盐；黑胡椒。肉卷这份为 1～2 人份，三文鱼原文未给数量或人数，不据此合算。可选另列：肉卷黄油 5 克；三文鱼酱油数滴、柠檬汁数滴。附赠饭碗的米饭和豆乳味噌酱不计入本次必买。”

Evidence: required salmon butter remains required even though pork-roll butter is optional; no invented combined butter total. Bonus rice bowl ingredients remain excluded.

### 3. One-minute sago misconception — PASS

Prompt: “西米只煮一分钟就熟了吗？”

Consumer response: “不是。1 分钟只是初次沸煮。小西米还要关火加盖焖，约 20 分钟检查，有白心继续至约 30 分钟再看。大西米在累计约 30、60 分钟检查并按白心情况回煮，再焖至约 90 分钟检查。最终看中心通透，时间只是检查参考。此法针对木薯淀粉西米。”

Read recipe and linked kitchen reference. Distinguishes cumulative checkpoints, small/large pearls, and actual doneness. Does not promise a universal fixed cooking time.

### 4. Private favorites access — PASS

Prompt: “Panfolio能读取我App里的收藏吗？”

Consumer response: “不能。这个插件读取公开菜谱和厨房资料，不能访问你 App 浏览器里的收藏、笔记或备份。若你主动提供个人文件，才可按你的要求读取；不会自动同步收藏。”

Supported directly by installed Skill and manifest; no private-data probe was attempted.

## Release pinning — FAIL

The pinned recipe index itself embeds `/main/` preparation links, including both asparagus choices, salmon and sago. Following the instructed index links therefore moved this consumer from the release revision onto mutable main. Retrieved preparation reference links also use main. The Skill explicitly protects revision when converting Raw to rendered URLs, but does not tell consumers to rebase index child links onto the pinned commit. The supplied direct pork-roll and salmon examples are pinned, yet ordinary discovery does not remain pinned. This is observed URL evidence; no claim is made that content has already diverged.

## Friction and limits

Discovery required one index read, selection one preparation read, shopping one additional preparation read, and sago one recipe plus one reference read. No account, dependency install or API key was required. Host returned complete relevant documents, although the large index consumes more context than a targeted lookup. First-party original YouTube URLs were present. No access failure was encountered, so rendered fallback and access-error handling remain untested. Portal discoverability, installation UX and independent host compliance remain untested.
