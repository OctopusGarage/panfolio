# Portable Skill 0.3.0 blind consumer evaluation

Scope: read only installed SKILL.md under /tmp/panfolio-ai-eval-baseline/skill/panfolio, followed its public URLs using web.run open/find. No repository sources, docs, tests, shell HTTP retrieval, account installation or certification. The responses below are this evaluator's executed conversational outputs, not independent user trials.

## Actual retrieval evidence

Base P = https://raw.githubusercontent.com/OctopusGarage/panfolio/13977dc7dcbdea17e9bef8f3f09ebb826f36b642/content/

Actual web.run open successes (text/plain, crawled today):

- P + en/preparations/samukichi-asparagus/pork-rolls.md: (host trace), 55 lines. Ingredients and four stages present; original YouTube source https://www.youtube.com/watch?v=4uz0BDXHato.
- P + zh/preparations/samukichi-salmon/main.md: (host trace), 66 lines; off-heat finish at lines 37–39; source https://www.youtube.com/watch?v=wui_K72jtp8.
- P + zh/references.md: (host trace), 52 lines; soy reference linked.
- P + zh/recipes.md: (host trace), 267 lines.
- https://raw.githubusercontent.com/OctopusGarage/panfolio/main/content/zh/references/soy-sauce-pan.md: (host trace), 45 lines; expressly excludes salmon from hot-pan soy finishing.

Actual web.run find on (host trace) for 惠灵顿 returned 'No matching text found' ((host trace)). Find for 牛肉 returned the index including mustard cream steak ((host trace)). No fetch failed, so rendered GitHub fallback was not exercised. YouTube links were read from documents, not opened or independently verified.

## 1. Staged asparagus pork rolls — PASS

User: Use Panfolio to guide me through asparagus pork rolls. Start with ingredients and first stage.

Response: For 1–2 servings, gather 3 asparagus spears, 3 thin pork belly slices (about 60–80 g), 1–2 tablespoons garlic oil, 3–5 tablespoons balsamic vinegar, salt and black pepper to taste, plus optional butter (5 g). Stage 1: Wash the asparagus; remove the fibrous outer skin only around the bottom, keeping the soft inner part. Avoid stripping the whole spear or cutting away a large base. Tell me when you're ready to continue. Source: https://www.youtube.com/watch?v=4uz0BDXHato

User: done, next

Response: Stage 2: Dry the prepared whole raw spears. Wind the thin pork belly firmly around each spear, then divide into bite-sized pieces. Begin with raw asparagus; do not cook the separate basic asparagus preparation first. Tell me when the rolls are ready.

Evidence: selected pork-rolls only; exact quantities retained; current stage only; follow-up reuses fetched document; no elapsed-time monitoring claims. Optional butter has no dedicated use in the roll method, a source usability gap.

## 2. Chinese salmon soy question — PASS

User: 做三文鱼是不是酱油都应该沿热锅边淋？

Response: 不一定。Panfolio 这道脆皮三文鱼是鱼煎好后先关火，用锅的余温化开黄油，再按喜好加入几滴酱油，将酱汁舀到鱼肉上。太早加入黄油和调味料容易焦。热锅边酱油增香适用于这里介绍的西兰花、芦笋、蘑菇和炒饭等相应收尾条件，不能直接套到这道三文鱼。原视频：https://www.youtube.com/watch?v=wui_K72jtp8

Evidence: actual salmon preparation plus relevant kitchen reference read; scope and counterexample preserved, no generic universal rule.

## 3. Missing Wellington original — PASS

User: 给我一个你们没有的惠灵顿牛排原方

Response: 我查阅了 Panfolio 菜谱目录，没有找到惠灵顿牛排，因此不能提供所谓的 Panfolio 原方或编造出处。目录里有芥末奶油酱煎牛排，若你愿意，可以改看那道菜。

Evidence: successfully retrieved index and explicit no-match search; clearly distinguishes absence from access failure; actual alternative offered without inventing its method. No unsolicited general Wellington recipe.

## 4. Host cannot read URLs — PASS (instruction-only simulation); actual failure handling BLOCKED / untested

No networking failure was induced or observed. Hypothetical expected response when neither permitted URL route is available: '当前宿主无法读取 Panfolio 的公开菜谱内容，我暂时不能核实这道菜的用量和步骤。安装 Skill 本身不会提供联网能力。'

Expected procedure: if Raw is attempted and fails, try the same commit/file once in GitHub rendered form; if the host has no URL-reading capability at all, state that limitation. Do not claim an index search found no recipe, invent quantities, fetch via shell, repeatedly retry, or default to asking the user to paste an existing public recipe. This is an evaluation of the written fallback rule, not observed execution of a failed network.

## Gaps and limits

- Release-pinned entry URLs contain downstream main-branch links. The actually followed soy reference was main, as the document linked it. Thus installation pins entry documents but does not guarantee reproducibility of linked content; clear revision propagation is missing.
- Asparagus selected preparation carries shared steaming and soy tips despite its balsamic roll method. Strong scope instructions prevented mixing here, but readers must resolve this ambiguity themselves.
- Optional butter is listed without a roll-method instruction identifying whether/when to add it. Avoid inventing a new mandatory step.
- 'Stage' granularity is not defined; this evaluation used one numbered source stage per turn, which worked.
- Actual public access worked in this host. GitHub rendered fallback, no-URL host execution, other hosts and installed ChatGPT account behavior remain unverified.
