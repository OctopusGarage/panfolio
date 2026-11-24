# TalkSprout parity audit

Baseline: TalkSprout commit `462e7c041115b4c32e19fc1b8e2c597523d0f31c` (2026-11-24). This audit compares product-independent capabilities, then maps domain-specific features to recipes. The initial Panfolio release did not meet this baseline.

| Capability                                                | Initial Panfolio                         | Resolution                                                                                                                             |
| --------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Chinese/English interface, persisted preference, shortcut | Missing                                  | Bilingual operations, English recipe titles and search, persisted locale; original source instructions explicitly remain Chinese       |
| Desktop sidebar, mobile bottom navigation                 | Missing                                  | Recipe, saved, kitchen guides and settings tabs                                                                                        |
| Content-only scroll and mobile keyboard handling          | Missing                                  | Adapted `useAppFrame`, safe-area layout and per-view scroll restoration                                                                |
| Back, Escape, right-edge gesture, focus return            | Partial                                  | Recipe and information navigation with direct-link fallback, adapted gesture and modal focus restoration                               |
| Independent search/filter state                           | Partial                                  | Separate recipe and saved shelf filters survive view changes                                                                           |
| Dismissible first-use guide                               | Missing                                  | Recipe-specific first-use guide with saved dismissal                                                                                   |
| Recent items                                              | Missing                                  | Bounded recent recipe shelf, expand/collapse, no private notes in URLs                                                                 |
| Favorites and cross-window persistence                    | Partial                                  | IndexedDB serialized mutations, BroadcastChannel/storage/foreground refresh; legacy local backup migration                             |
| Share app link and system share                           | Missing                                  | Adapted app sharing dialog, clean home URL, clipboard/manual fallback                                                                  |
| Local bilingual PNG QR invitation                         | Missing                                  | Adapted share-card generator, download, native file share where available, iPhone guidance                                             |
| Share individual item                                     | Missing                                  | Stable recipe URL, no notes in shared URL                                                                                              |
| Independent settings and install instructions             | Missing                                  | Locale, native install prompt/fallback, installation detection, online/offline state, usage help                                       |
| Version check                                             | Partial                                  | Startup and foreground/reconnect checks plus explicit check action                                                                     |
| Update lifecycle                                          | Partial                                  | Available/applying/stalled/error/reloading/completed feedback, retry, 12-second activation timeout, confirmed activation before reload |
| Offline readiness                                         | Incorrect: registration treated as ready | Scoped completion marker and every precache response validated; bounded retries                                                        |
| Scoped worker and content-hashed cache                    | Present                                  | Retained; adds lazy sharing chunk, recovery page and Apple icon to precache                                                            |
| Startup fallback and scoped recovery                      | Missing                                  | Bilingual boot failure UI and standalone recovery preserving notes/preferences and neighboring app caches                              |
| Apple metadata and icons                                  | Partial                                  | Apple touch icon and standalone metadata                                                                                               |
| Strict typing, unit tests, Chromium/WebKit release gates  | Partial                                  | Additional lifecycle, cache, sharing, persistence, accessibility and shell regressions                                                 |
| Pull-request CI and separated deployment permissions      | Missing                                  | Validation runs for PRs; deployment restricted to main with separate Pages permissions                                                 |
| Content evaluation                                        | Missing                                  | Recipe-source, English-title, unsafe-link, IDs and source-text integrity evaluation; no fabricated model evidence                      |
| Documentation and repository conventions                  | Partial                                  | English README, content ownership/license boundary, audit, AGENTS and contributor commands                                             |

## Domain mapping

TalkSprout's English coaches, 160 scenarios, spoken prompts, review cards, interview pace, saved coach/scenario combinations and live LLM evaluation archives describe its English-learning product. They are not recipe features and are not copied as empty or misleading UI. Recipe counterparts are browsable categories, saved dishes, recent reading, cooking mode, local cooking notes and kitchen guides. Recipe notes and import/export remain additional Panfolio features.

## Limits

Original recipe bodies remain Chinese and external images/videos require internet access. Search includes English recipe titles; source ingredient text is not automatically translated. Installation availability depends on the browser. Physical iPhone home-screen behavior is not established by automated WebKit tests. No cloud synchronization is offered. When IndexedDB is unavailable, the fallback uses localStorage with Web Locks where supported; browsers without either serialized storage mechanism cannot guarantee atomic simultaneous writes.

Source attribution: shared infrastructure is adapted from the MIT-licensed OctopusGarage/talksprout project. The project owner’s recipe collection is separate from the application code license.

## Verification evidence

Automated suites cover lifecycle timeout and retry, single reload after silent activation, scoped recovery across two deployment paths, boot script failure, bilingual preference persistence, offline sharing, valid and invalid backup handling, cross-window concurrent favorites and WCAG checks on primary English pages. Unit tests cover lifecycle state transitions, clipboard ordering, cache completeness and bounded offline checks. These are deterministic browser/unit checks, not physical-device or participant usability evidence.
