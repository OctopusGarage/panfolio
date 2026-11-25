# AI distribution quality evaluation

Date: 2026-11-25. Baseline: published AI distribution v0.3.0, source `13977dc7dcbdea17e9bef8f3f09ebb826f36b642`. Candidate evaluated: local v0.3.1 before publication. Current publication status is recorded in [GitHub Releases](https://github.com/OctopusGarage/panfolio/releases) and [Actions](https://github.com/OctopusGarage/panfolio/actions), rather than inferred from this dated evaluation. This report evaluates the maintained instructions, package consumption, document delivery and observed answer quality; it is not a new original-video audit.

## Method and evidence

Three fresh consumer agents received only the extracted published Skill, extracted plugin or live MCP tool adapter. They were instructed not to inspect implementation files, tests or maintainer documentation. They used the configured Codex model and evaluated realistic tasks; they are separate agent contexts, not different model families or commercial client accounts. A fourth fresh consumer evaluates the corrected local packages. These small trials establish observed behavior, not statistical reliability or universal host compatibility.

The Skill/plugin agents read actual public Markdown through their host URL reader. The MCP agent invoked an official SDK client against the public endpoint through a maintainer-side command adapter. That adapter was evaluation infrastructure only; it is not distributed consumer code and does not establish native ChatGPT/Gemini tool integration. All successful baseline MCP reads identified v0.3.0 and the baseline source above.

Detailed evidence:

- [Published Skill consumer trace](evals/2026-11-25/skill-baseline.md).
- [Published plugin consumer trace](evals/2026-11-25/plugin-baseline.md).
- [Live MCP consumer trace](evals/2026-11-25/mcp-baseline.md).
- [Corrected candidate consumer trace](evals/2026-11-25/candidate.md).
- [Scenario inventory and grading rubrics](../tests/fixtures/ai-scenarios.json).

The linked evidence files are evaluator-curated response transcripts and URL/call ledgers, not verbatim exports of every host tool event. They support the observations below but offer weaker independent reproducibility than full host traces. A separate evidence reviewer checked the report against these files and the current instructions; it found no material contradiction and retained that provenance limitation.

Each scenario is graded against the retrieved source: correct document/variant, source quantities and sequence, conditions and counterexamples, requested language and interaction, original attribution, uncertainty and privacy. A wrong variant, invented quantity/source, false access claim, private-data disclosure or mixed release identity is a failure even if the answer reads fluently. A refusal to invent missing quantities can pass while the requested exact conversion remains unsupported. There is deliberately no composite score that hides a critical failure.

## Baseline findings

| Area                   | Actual observation                                                                                                                                  | Judgment                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Skill staged cooking   | Retrieved pork rolls; gave exact ingredients and first source stage; continued wrapping on the next turn using already-read text                    | Passed in this trial                                |
| Skill source scope     | Retrieved salmon and soy reference; retained off-heat salmon finish; successfully searched index before declining a nonexistent Wellington original | Passed in this trial                                |
| Plugin discovery       | Offered two actual asparagus alternatives before selection; selected raw-asparagus pork rolls without adding the basic searing method               | Passed in this trial                                |
| Plugin shopping        | Combined two selected dishes; kept required salmon butter distinct from optional roll butter and excluded bonus rice-bowl ingredients               | Passed in this trial                                |
| Plugin sago/privacy    | Distinguished initial boil from subsequent resting/reboiling; correctly denied private app access                                                   | Passed in this trial                                |
| MCP kitchen technique  | Read the knife-work reference and preserved ordered handling, mistakes and the limit on soaking                                                     | Passed in this trial                                |
| MCP comparison/scaling | Preserved salmon counterexample; distinguished chestnut rib rice from sausage-potato rice and refused unsupported exact two-person conversion       | Passed; conversion remains source-limited           |
| MCP discovery/recovery | Offered actual asparagus choices; unknown path returned a tool error, then an exact index path succeeded                                            | Passed in this trial                                |
| Release revision       | Both Skill and plugin followed main-branch child links from a commit-pinned index                                                                   | **Failed**; actual requested URLs prove the drift   |
| Access failure         | No real network failure occurred during these consumer trials                                                                                       | Unverified; instruction-only simulation is separate |

No reported retrieval failures were reproduced in this host during the baseline trials. This does not show that the user's previously failing ChatGPT account has been fixed.

## Corrections in the candidate

1. The Skill now defines its content base and explicitly rewrites every subsequent cookbook link to the same revision, including references and the rendered-GitHub fallback. Original video links remain unchanged. This corrects the observed release drift. Enforcement is still the consuming model's responsibility; the cookbook's public main links are unchanged.
2. The Skill can use already connected `get_guide` and `read_document` tools. Otherwise it uses native public-URL reading. It keeps one route/content identity per task and does not suggest that installing a skills-only package connects MCP automatically. The plugin listing states the same capability boundary.
3. Shared bilingual shopping guidance now covers ingredients embedded in method text, bonus serving suggestions, required versus optional amounts, compatible explicit units and the absence of weight/volume conversion evidence. This formalizes a task that passed in the baseline but required careful interpretation. A presentation follow-up also removes repeated missing-quantity caveats while retaining the absence of invented numbers.
4. Connection/install/design documents now agree on these routes and revision behavior. The MCP guide removes obsolete publication wording, separates login from resource-account identity without publishing the login email, qualifies the client-specific JSON example and points to dated evidence instead of stale test counts.

Version v0.3.0 remains immutable. The candidate version is increased to v0.3.1. At the evaluation cutoff it was local and unpublished; subsequent commits and deployment are tracked in Releases and Actions.

## Regression evidence and its meaning

The scenario inventory contains 16 representative/adversarial requests: staged follow-up, salmon method, soy-sauce counterexample, variant choice, shopping, small/large sago, storage scope, knife work, source-limited conversion, component versus dish, missing recipe, inaccessible host, private data, revision propagation, connected MCP and source-text injection.

Fixture checks establish that each rubric's referenced documents and key facts exist. They do **not** generate or grade model answers. Instruction regressions detect missing revision/route rules, while package tests compare shared bytes and release metadata. The MCP protocol test reads every one of the 285 bundled documents through `tools/call`, compares exact text and checks each result's path, version, source revision and content/guidance fingerprints. These are deterministic integrity tests, not 285 AI conversations.

The fresh candidate consumer performed five successful public cookbook reads. Every request retained the pinned revision even though the fetched documents linked to main. The salmon comparison and shopping task passed. Connected-MCP routing with web unavailable and source-injection handling were explicitly simulated; no connected MCP or hostile text was actually introduced in that candidate trial.

Its shopping response was correct but repeatedly mentioned missing quantities. A final wording refinement tells consumers to list unquantified ingredients plainly and explain missing source data only when it blocks the requested calculation. A same-agent follow-up checks that narrow presentation change; it is not a second independent trial.

Local regression gates passed: 86 unit tests (including 16 scenario-evidence fixtures and two instruction guards), 11 MCP tests (including all-document tool-boundary comparison), all 44 recipe content evaluations, production MCP and app builds, 142 Chromium/WebKit browser tests, documentation links and formatting. Scenario fixtures and instruction guards remain distinct from observed AI answers. No installed-account test or candidate publication is claimed.

## Remaining limits and recommended next checks

- Shared tips in a selected preparation can still describe sibling variants. All three baseline agents observed this in asparagus; they handled it correctly using the scope rule. Preserve necessary source explanations, but do not silently interpret every shared tip as an additional step. A future editorial change should attach tips to preparations explicitly, retain the full parent source and review all affected bilingual variants rather than deleting explanations by keyword.
- Optional butter is listed for pork rolls without a dedicated use in the selected method. The shared tips mention residual-heat butter, but consumers should not invent a mandatory roll step. Missing source quantities and timing remain unsupported, including precise rice scaling. Resolving those gaps requires source review rather than prompt assertions.
- Rendered-GitHub fallback, actual unavailable networking, native client multi-turn behavior and account installation remain untested. Privacy and source-injection pressure cases are controlled instruction simulations, not evidence of a real hostile network response.
- Before claiming a particular host is supported, install the exact candidate in that ChatGPT/Gemini/Doubao account, inspect actual tool discovery and run direct/indirect requests, selection, staged follow-ups and deliberate access failures in new conversations. Include negative activation checks outside cooking. This evaluation does not access or change those accounts.

## Primary-source cross-check

The package keeps portable `plugin.json` and `skills/` at the root, as described in [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins). Portable skills are discovered from that directory; adding a legacy-only manifest field is unnecessary. [OpenAI's skills guide](https://developers.openai.com/plugins/build/skills) separates workflow instructions from MCP capabilities, recommends representative and edge-case tests, and allows avoiding scripts when existing tools suffice. [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) documents account/workspace availability and upload controls. These sources were rechecked on the evaluation date; account eligibility and a passing local test are different facts.
