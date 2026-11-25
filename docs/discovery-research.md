# Recipe discovery: independent evidence review

Reviewed 2026-11-25 against the proposal and primary sources. This report verifies external claims, not the underlying 75-entry content audit. No production implementation or conformance testing was performed.

## Filtering: supported convention, explicit exception

**External evidence.** Baymard explicitly describes AND between filter groups and OR between values inside a group. Its testing found that restricting a group to one selection forces repeated searches and comparisons. This supports ordinary multi-select facets; it does not establish every domain's desired semantics. The evidence concerns commerce and booking experiences, not a direct study of Panfolio. [Baymard: multiple filter values](https://baymard.com/research-articles/allow-applying-of-multiple-filter-values).

**Panfolio inference.** Breakfast AND (chicken OR beef) is a defensible default. An explicitly labeled All selected ingredients mode is a separate task: finding a preparation containing every requested ingredient. Keep that mode visible in the applied summary, including shared links. Matching all ingredients across different sibling preparations would misrepresent the result. This preparation-level constraint follows from the collection model, rather than Baymard's findings.

## Applied conditions and mobile commitment

**External evidence.** Baymard reports disorientation and extra work when selections cannot be reviewed or removed directly from the results. It recommends an applied-filter overview on desktop and mobile; a numeric filter badge alone does not reveal the conditions. Its multi-value article also supports selecting several options during one visit to a mobile filter interface. [Baymard: applied filters](https://baymard.com/research-articles/how-to-design-applied-filters).

**Panfolio inference and objection.** Removable, labeled conditions near results are well supported. A draft sheet with a preview count, Apply and Cancel is a reasonable implementation candidate, but these sources do not make that exact transactional design universally mandatory. Compare it with immediate updates that keep the sheet open. Test whether users understand committed versus draft counts, Escape cancellation and what Clear all resets. Presets must expose their resulting conditions too.

## Accessibility: distinguish standards from stronger targets

**External evidence.** WCAG 2.2 SC 2.5.8 is Level AA and specifies 24 × 24 CSS pixels, with spacing, equivalent-control, inline, user-agent and essential exceptions. A practical 44-pixel target is a stronger design choice, not this AA minimum. [W3C: target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

SC 2.4.11 at AA prevents a focused component from being entirely hidden by author-created content. Keeping it completely unobscured is stronger; that distinction matters around sticky navigation and sheet actions. The Understanding pages explain criteria rather than themselves constituting normative requirements. [W3C: focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).

The APG modal pattern puts initial focus inside, contains Tab navigation, makes background content inert, closes with Escape and normally returns focus to the opener. It allows logical alternatives if the opener disappears or the next workflow step warrants them. It also recommends a visible close control. APG is implementation guidance, not proof of WCAG conformance. [W3C: modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

**Panfolio inference.** Escape discarding draft filters and browser Back dismissing the sheet are product decisions layered onto that pattern. Specify and test them; ARIA alone supplies neither behavior.

## Recipe semantics and unsupported precision

**External evidence.** Google separates meal/course category, regional cuisine, ingredients, preparation duration, cooking duration and total duration. It also distinguishes multiple recipes from sections of one recipe. This supports conceptual separation, not a complete discovery taxonomy or navigation design. [Google: recipe structured data](https://developers.google.com/search/docs/appearance/structured-data/recipe).

**Panfolio inference.** Breakfast and seasonal suggestions should carry editorial provenance; neither establishes nutrition, dietary suitability, universal seasonality or speed. A timed frying or boiling stage cannot stand in for total duration, or necessarily even complete cooking duration. Retain stage timings while withholding unsupported total-time filters. Do not infer active time from elapsed time.

## Remaining design questions

The cited evidence does not establish three destinations, two-column phone cards, two visible tags, 100 ms feedback or 120–180 ms transitions as optimal. Treat these as hypotheses. Evaluate ingredient, occasion, seasonal, saved-item and technique entry points without imposing one primary persona. Include enlarged text, bilingual labels, zero results and recipe-to-reference return journeys. The proposal's strongest foundation is transparent semantics; its layout and interaction details still need comparative usability evaluation.
