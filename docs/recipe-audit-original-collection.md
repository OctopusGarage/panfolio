# Original collection recipe fidelity audit (01–20)

Audit date: 2026-11-25. Scope: the first twenty entries only; SAMUKICHI entries are excluded. Compared the complete Chinese and English bodies, ingredient quantities, sequence, heat, timing and tips against all twenty full GitBook Markdown pages. This is a written-source audit with limited original-source metadata evidence, **not completed video verification**. No recipe JSON was edited by the delegated audit. The parent subsequently applied supported corrections; see [the consolidated audit](recipe-fidelity-audit.md) for remediation and remaining questions.

## Evidence and retrieval limits

All twenty `.md` endpoints were fetched successfully with curl using a browser user-agent. An initial Python fetch returned 403; that was recovered. Raw Markdown, recipe snapshot, descriptions and yt-dlp logs remain in `/tmp/panfolio-audit`. Ten original YouTube links were resolved from the pages. yt-dlp attempted descriptions, manual captions and automatic captions in Chinese/English for each. No captions were successfully retrieved: five caption requests failed with HTTP 429; four videos exposed no requested-language subtitles; one video was unavailable. Descriptions establish identity/context, not complete ingredient or visual evidence. No footage was watched or frames reviewed.

For entries 11–20, all ten linked Xiachufang originals were fetched, but HTTP 200 contained a slider-verification page, not recipe content. Therefore findings for those entries are limited to the GitBook transcription; agreement does not establish fidelity to the inaccessible original. No missing evidence is treated as a contradiction. No invented quantities are recommended.

Priority: resolve shrimp-oil/return operations in 03, shrimp endpoint in 08, tomato variant relationship in 10 and finishing-steam meaning in 11. Remove or substantiate the added causal tip in 06. These differ in confidence: only 10 is a clear written relationship change; 03/08 are inherited gaps and 11 is ambiguous terminology.

## 01.-ri-shi-ma-ling-shu-dun-rou — Japanese beef and potato stew (Nikujaga)

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/01.-ri-shi-ma-ling-shu-dun-rou](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/01.-ri-shi-ma-ling-shu-dun-rou); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/01.-ri-shi-ma-ling-shu-dun-rou.md).

Original link: [https://www.youtube.com/watch?v=1UfWOyM6rNc](https://www.youtube.com/watch?v=1UfWOyM6rNc).

**Finding:** No material written-source contradiction.

Large potato cuts, along-grain onion slices, short rib/thin beef alternatives, sugar after browning beef, liquid level, drop lid and medium-low 25-minute simmer all match in Chinese and English. Optional fish accompaniment is omitted, without changing the preparation. Restore the onion-cutting reason (resisting disintegration) if expanding tips; do not invent quantities.

**Evidence limitation:** Metadata and description retrieved; no requested-language captions exposed. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 02.ajian-ban-dan-chao-fan — Ajian-style egg fried rice

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/02.ajian-ban-dan-chao-fan](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/02.ajian-ban-dan-chao-fan); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/02.ajian-ban-dan-chao-fan.md).

Original link: [https://www.youtube.com/watch?v=VCELAeG3lyI](https://www.youtube.com/watch?v=VCELAeG3lyI).

**Finding:** Inherited operational ambiguity; minor omission.

Three separated eggs, yolk-coated rice, salted/oiled blanching, low-heat whites and high-heat rice match in both languages. The source specifies freshly cooked rice; both ingredient lists omit that qualifier. More importantly, bacon is added only in the final combined fry in the source and app, with no explicit cooked-through cue. Restore the fresh-rice qualifier and verify bacon preparation before adding an exact instruction; this is an inherited gap, not proof the app reverses the source.

**Evidence limitation:** Description retrieved; caption download blocked by HTTP 429. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 03.-xia-ren-dan-chao-fan — Shrimp and egg fried rice

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/03.-xia-ren-dan-chao-fan](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/03.-xia-ren-dan-chao-fan); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/03.-xia-ren-dan-chao-fan.md).

Original link: [https://www.youtube.com/watch?v=5SuekA2ucsU](https://www.youtube.com/watch?v=5SuekA2ucsU).

**Finding:** Inherited missing operations and a useful description-level omission.

Both languages preserve shells fried/crushed into broth, separately cooked shrimp option, scallion→egg→rice order, incremental broth and finishing shrimp oil. Neither source nor app explains separating/reserving shrimp oil before adding water, when separately cooked shrimp return to the rice, or what the additional shrimp juice means. Resolve these operations from original footage or the creator recipe before editing. Creator description explicitly says rice must be separate but not overly dry; app emphasizes dry grains without this balancing cue. Add the supported not-overdry caution, without inventing liquid amounts.

**Evidence limitation:** Metadata and description retrieved; no requested-language captions exposed. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 04.-ji-dan-chao-mi-fen — Egg-fried rice vermicelli

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/04.-ji-dan-chao-mi-fen](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/04.-ji-dan-chao-mi-fen); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/04.-ji-dan-chao-mi-fen.md).

Original link: [https://www.youtube.com/watch?v=uw4tSDT-ElU](https://www.youtube.com/watch?v=uw4tSDT-ElU).

**Finding:** Written method substantially faithful; aromatic identity unresolved.

One egg, approximately 2-minute boil, covered 3-minute rest on each side, egg removal, noodle frying and egg→white scallion→sprout→soy→green scallion order match across both languages. The source calls the aromatic 葱头; English asserts scallion bulbs, though the market term can be ambiguous. Keep the identity unresolved until footage confirms it. No additional timing or quantity should be inferred.

**Evidence limitation:** Description retrieved; caption download blocked by HTTP 429. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 05.-shao-jiao-pi-dan-chao-fan — Charred pepper and century egg fried rice

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/05.-shao-jiao-pi-dan-chao-fan](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/05.-shao-jiao-pi-dan-chao-fan); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/05.-shao-jiao-pi-dan-chao-fan.md).

Original link: [https://www.youtube.com/watch?v=kItDG3GaLSk](https://www.youtube.com/watch?v=kItDG3GaLSk).

**Finding:** Ambiguous egg handling simplified; source tip omitted.

Two green chilies, three mild nuomijiao, char/covered rest/partial peel, relish ingredients and about one spoonful relish match. Source egg wording mentions separation of white/yolk after cracking; app merely cracks eggs and leaves them briefly. The source wording does not securely establish a separate bowl-separation operation: verify footage before imposing one. Source explicitly presents century egg as an MSG substitute; app omits it. Restore only as an attributed flavor/seasoning suggestion if verified, without turning sweetness into a scientific explanation. Roasting alternatives are omitted; core chosen technique remains intact.

**Evidence limitation:** Description retrieved; caption download blocked by HTTP 429. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 06.-hong-shao-qie-zi — Braised eggplant

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/06.-hong-shao-qie-zi](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/06.-hong-shao-qie-zi); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/06.-hong-shao-qie-zi.md).

Original link: [https://www.youtube.com/watch?v=x6Uit9bmN-g](https://www.youtube.com/watch?v=x6Uit9bmN-g).

**Finding:** Unsupported explanatory addition, otherwise faithful.

Salt/vinegar 10-minute treatment, rinse and squeeze, separate eggplant frying, mince/garlic then pepper/sauce, return eggplant and starch slurry match in both languages. The app tip says squeezing helps the eggplant take up sauce more readily; the written source says squeeze thoroughly but does not give that mechanism. Remove the causal assertion or independently substantiate it. Lean meat and Qinglong pepper remain unspecified appropriately; do not assert pork or a different pepper variety.

**Evidence limitation:** Metadata and description retrieved; no requested-language captions exposed. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 07.-xing-zhou-chao-mi-fen — Singapore-style fried rice vermicelli

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/07.-xing-zhou-chao-mi-fen](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/07.-xing-zhou-chao-mi-fen); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/07.-xing-zhou-chao-mi-fen.md).

Original link: [https://www.youtube.com/watch?v=wgZPifWWNmc](https://www.youtube.com/watch?v=wgZPifWWNmc).

**Finding:** Strong written-source fidelity; ingredient-list and aromatic clarification desirable.

150 g noodles, about 100 g each char siu/sprouts, 2 eggs, 30–50 g chives, curry/turmeric/chili 20/5/10 g, optional 15 g diluent, blanching salt/oil 3–5/8–10 g, 10-second shrimp blanch, half-minute shrimp fry and separate oil additions all match bilingually. Off-heat curry mixing and smoke/white-pan low-heat counterexample are retained. Source calls shrimp salted; ingredient lists merely say shrimp, although methods retain salted shrimp. Clarify consistently without inventing salting strength/duration. English scallion bulbs for 葱头 requires footage confirmation.

**Evidence limitation:** Description retrieved; caption download blocked by HTTP 429. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 08.-hai-xian-fen-si-bao — Seafood glass noodle casserole

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/08.-hai-xian-fen-si-bao](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/08.-hai-xian-fen-si-bao); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/08.-hai-xian-fen-si-bao.md).

Original link: [https://www.youtube.com/watch?v=k5ed5oJ7g4w](https://www.youtube.com/watch?v=k5ed5oJ7g4w).

**Finding:** Inherited missing shrimp doneness cue.

20-second hot soak, 10-minute cold soak, 1/3 spoon dark soy, two separate 2-spoon light-soy additions, 1-spoon oyster sauce, 1 egg, head-oil extraction and approximately 1-minute noodle fry before shrimp match. Both methods then say quick fry and serve, without an explicit shrimp cooked-through cue or duration. This omission is present in GitBook too. Add a qualitative cooked-through cue after verification, not a fabricated number of minutes. English nearly cooked appropriately avoids converting 八成熟 into an asserted percentage.

**Evidence limitation:** Video unavailable in yt-dlp. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 09.-qie-zi-chao-ji-dan — Eggplant and scrambled eggs

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/09.-qie-zi-chao-ji-dan](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/09.-qie-zi-chao-ji-dan); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/09.-qie-zi-chao-ji-dan.md).

Original link: [https://www.youtube.com/watch?v=Gw22Gjk4LEI](https://www.youtube.com/watch?v=Gw22Gjk4LEI).

**Finding:** No material written-source contradiction found.

Two eggplants/two eggs, approximately 1 cm cubes, 20-minute salting, two rinses, pepper in beaten eggs, separate low-heat egg and eggplant cooking, tomato before green pepper and high-heat final sauce coating are preserved in both languages. Quantities absent from the source remain absent. No correction required on written evidence; video verification remains outstanding.

**Evidence limitation:** Description retrieved; caption download blocked by HTTP 429. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 10.-rang-pao-mian-hao-chi-fan-bei-de-10-zhong-zuo-fa — Ten ways to upgrade instant noodles

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/10.-rang-pao-mian-hao-chi-fan-bei-de-10-zhong-zuo-fa](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/10.-rang-pao-mian-hao-chi-fan-bei-de-10-zhong-zuo-fa); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/10.-rang-pao-mian-hao-chi-fan-bei-de-10-zhong-zuo-fa.md).

Original link: [https://www.youtube.com/watch?v=m7adV4qL2KE](https://www.youtube.com/watch?v=m7adV4qL2KE).

**Finding:** One concrete variant relationship change; several inherited gaps.

All ten independent preparations remain distinguishable. Shacha is correctly retained; 2 spoonfuls shacha, 1 small spoon peanut butter, half cup milk and low microwave 1 minute 30 seconds match both languages. The tomato variation source says adding fermented-black-bean chili sauce with tofu/cured sausage forms a heavier-flavored variant; app turns this into a separately served accompaniment (另配 / Serve with). Restore the alternative preparation relationship rather than asserting a side dish. The microwave power/amount caveat is editorial advice absent from GitBook, though not a contradiction. Century-egg noodle insertion is made explicit by the app where GitBook omits it; tomato egg/noodle starting state remains unclear. Verify footage before supplying egg ratios, noodle precooking or microwave wattage.

**Evidence limitation:** Metadata and description retrieved; no requested-language captions exposed. No video or frame inspection; GitBook comparison alone cannot verify spoken or visible instructions.

## 11.-qing-zheng-huang-hua-yu — Steamed yellow croaker

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/11.-qing-zheng-huang-hua-yu](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/11.-qing-zheng-huang-hua-yu); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/11.-qing-zheng-huang-hua-yu.md).

Original link: [https://www.xiachufang.com/recipe/128601/](https://www.xiachufang.com/recipe/128601/).

**Finding:** Potential technique narrowing; preserve uncertainty.

One fish, 3–4 garlic cloves, 2–3 chilies, 2 tablespoons sauce, 1 teaspoon wine, 1–2 tablespoons oil, half-centimeter scores and 20-minute marinade match in both languages. The 8-minute high steam plus 2–3-minute low stage is retained, but GitBook calls the second stage 虚蒸; app says ordinary low-heat steaming. Do not silently convert it to heat-off resting either: obtain the original instruction and distinguish the intended covered finishing stage. English very hot oil paraphrases the source qualitative heat without inventing a temperature.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 12.-liang-ban-zhe-er-gen — Cold houttuynia salad

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/12.-liang-ban-zhe-er-gen](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/12.-liang-ban-zhe-er-gen); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/12.-liang-ban-zhe-er-gen.md).

Original link: [https://www.xiachufang.com/recipe/1012651/](https://www.xiachufang.com/recipe/1012651/).

**Finding:** Minor preparation-texture loss.

Cold-water 10-minute soak, complete dressing, final scallions and unspecified quantities match both languages. GitBook specifies 蒜泥 (garlic paste); app says 蒜末/minced garlic. Restore garlic paste in both languages if preserving source texture exactly. No video is linked by this source; original written page is blocked by verification.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 13.-dou-chi-zheng-pai-gu — Steamed pork ribs with black bean sauce

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/13.-dou-chi-zheng-pai-gu](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/13.-dou-chi-zheng-pai-gu); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/13.-dou-chi-zheng-pai-gu.md).

Original link: [https://www.xiachufang.com/recipe/106804588/](https://www.xiachufang.com/recipe/106804588/).

**Finding:** No material written-source contradiction found.

500 g ribs, 1 potato, 2 spoon garlic, half spoon beans, 2 spoon light soy, 1 spoon oyster/starch, 2-minute flour wash, hot-oil aromatics, 30-minute marinade and 25-minute high steam match both languages. English correctly leaves spoon sizes unspecified. Oil added to ingredient list is supported by the source method. Do not invent thickness or steaming time adjustments.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 14.-bo-cai-chao-ji-dan — Spinach and scrambled eggs

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/14.-bo-cai-chao-ji-dan](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/14.-bo-cai-chao-ji-dan); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/14.-bo-cai-chao-ji-dan.md).

Original link: [https://www.xiachufang.com/recipe/106014471/](https://www.xiachufang.com/recipe/106014471/).

**Finding:** No material written-source contradiction found.

One bunch spinach, 4 eggs, half spoon salt, blanch→cold rinse→cool→squeeze sequence, separate cooked eggs, low-heat scallions/spinach then high-heat combination match. English very hot oil is a qualitative rendering of 八成热, not an invented Celsius temperature. Blanching salt and final salt allocation are not quantified separately by GitBook; do not manufacture a split.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 15.-xia-ren-hua-dan — Silky scrambled eggs with shrimp

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/15.-xia-ren-hua-dan](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/15.-xia-ren-hua-dan); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/15.-xia-ren-hua-dan.md).

Original link: [https://www.xiachufang.com/recipe/103468406/](https://www.xiachufang.com/recipe/103468406/).

**Finding:** No material written-source contradiction found.

4 eggs/200 g shrimp, 2 teaspoons wine, total 1.5 teaspoons salt split 1/0.5, 2 teaspoons starch, cooling shrimp with juices/oil before combining, non-excessive egg beating, smoking oil followed by heat off and residual-heat cooking match bilingually. Slurry water amount and brief marination duration are absent in GitBook; keep unspecified. Source repeats switching off at finish after already switching off; app reasonably removes that redundancy.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 16.-suan-xiang-zi-ran-pai-gu — Garlic and cumin ribs

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/16.-suan-xiang-zi-ran-pai-gu](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/16.-suan-xiang-zi-ran-pai-gu); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/16.-suan-xiang-zi-ran-pai-gu.md).

Original link: [https://www.xiachufang.com/recipe/107245103/](https://www.xiachufang.com/recipe/107245103/).

**Finding:** No material written-source contradiction; doneness verification still desirable.

One onion, 2 unspecified spoonfuls light soy, ginger/scallion/wine boil, frying before aromatics, dry spices before returning ribs and final scallion order match. English mostly cooked avoids a literal numeric percentage for 八分熟. Ginger and wine added to ingredient list come from the source method. A final cooked-through cue would improve usability, but do not invent a boil duration or claim the source supplies one.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 17.-xia-ren-chao-xi-lan-hua — Stir-fried shrimp and broccoli

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/17.-xia-ren-chao-xi-lan-hua](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/17.-xia-ren-chao-xi-lan-hua); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/17.-xia-ren-chao-xi-lan-hua.md).

Original link: [https://www.xiachufang.com/recipe/100551182/](https://www.xiachufang.com/recipe/100551182/).

**Finding:** Supported omission of an unverified claim; minor positional omission.

30-minute lightly salted soak, 10-minute shrimp marinade, salted blanch, garlic then shrimp then broccoli and optional cherry tomatoes/Hainan sauce match. App omits the source claim that soaking removes pesticide residues; do not restore that unsupported guarantee as cooking fact. It also omits head-down soaking orientation. English mostly cooked correctly avoids a numeric percentage. Added final cook-through wording is a qualitative operational clarification, not a supplied timed instruction.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 18.-xiang-jian-yin-xue-yu — Pan-seared yin xue yu

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/18.-xiang-jian-yin-xue-yu](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/18.-xiang-jian-yin-xue-yu); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/18.-xiang-jian-yin-xue-yu.md).

Original link: [https://www.xiachufang.com/recipe/104699264/](https://www.xiachufang.com/recipe/104699264/).

**Finding:** No material written-source contradiction found.

Dry fish, skin snip, butter sear on both sides, oyster/light-soy/water sauce before scallion/ginger/garlic and low-heat reduction match. English Yin xue yu prudently avoids asserting a species from 银鳕鱼. The app adds an explicit cooked-through endpoint without an invented time. Preserve species uncertainty and unspecified quantities until the original is readable.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 19.-wan-neng-tiao-liao-zhi-pai-huang-gua — Smashed cucumber with all-purpose sauce

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/19.-wan-neng-tiao-liao-zhi-pai-huang-gua](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/19.-wan-neng-tiao-liao-zhi-pai-huang-gua); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/19.-wan-neng-tiao-liao-zhi-pai-huang-gua.md).

Original link: [https://www.xiachufang.com/recipe/106918418/](https://www.xiachufang.com/recipe/106918418/).

**Finding:** No material written-source contradiction found.

Smashing cucumber, garlic/chili/sesame plus 1 spoon chili powder under 1 large spoon hot oil, 2/1/2 spoon light soy/oyster/aged vinegar, half spoon salt, little sugar/sesame oil and final cilantro/peanuts all match bilingually. Unspecified spoons stay spoonfuls rather than tablespoons. No additional salting/draining stage is supported; do not add one as an original-source claim.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.

## 20.-jiao-si-fu-ru-chao-kong-xin-cai — Water spinach with fermented bean curd and chili

GitBook: [https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/20.-jiao-si-fu-ru-chao-kong-xin-cai](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/20.-jiao-si-fu-ru-chao-kong-xin-cai); [full Markdown](https://codefarmer2024s-organization.gitbook.io/codefarmers-recipe/20.-jiao-si-fu-ru-chao-kong-xin-cai.md).

Original link: [https://www.xiachufang.com/recipe/104413738/](https://www.xiachufang.com/recipe/104413738/).

**Finding:** No material written-source contradiction found.

Bean curd mashed with its own brine, blanching with oil plus 1 teaspoon each sugar/salt, aromatic/sauce fry, 1-minute high-heat combined fry, final seasoning, starch slurry and peanut oil match both languages. General oil and finishing peanut oil remain distinct. Slurry ratio and bean-curd quantity are absent; do not invent them.

**Evidence limitation:** Full GitBook summary reviewed; original Xiachufang page returned slider verification. No original recipe text or video verified.
