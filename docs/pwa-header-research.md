# Installed PWA header text: research

Research baseline: commit `0e2021f`.

Scope: the confirmed report concerns the top-left header text, not the QR/share icon or home-screen icon. Read project AGENTS.md. This is source inspection and primary-source research, not physical-iPhone reproduction. No application code changed during the research-only phase.

## Verified code findings

- `index.html:5–11` enables `viewport-fit=cover`, standalone capability and **default** status-bar style. `src/usePwaGestures.ts:5–17` detects standalone and rewrites the viewport while retaining `cover`; it adds no safe-area compensation.
- Header content is PANFOLIO plus the dynamic h1 (`src/App.tsx:449–457,512–538`). Recipe headings can be longer than navigation headings. The two action buttons compete for horizontal space.
- Header safe-area protection is missing: base padding is `20px 36px` (`src/style.css:143–150`), later desktop top/bottom padding is 18px (`1215–1220`), final mobile padding is `14px 20px` (`1524–1526`). Search overrides top/bottom to 10px (`1707–1710`). None uses the top, left or right safe-area insets. Bottom navigation already uses the bottom inset (`905,912–913`). This is a verified layout protection gap under cover, not proof of the reported device's exact obstruction mechanism.
- No header/h1 fixed height, max-height, line clamp, ellipsis or local overflow clipping is present. h1 has `line-height:1.4`, `overflow-wrap:anywhere`; its parent has `flex:1; min-width:0` (`152–160`). Header has `flex-shrink:0` (`150`), and icon buttons do too (`180–187`). There is no explicit title min-height; lack of one is not itself a defect. Natural multi-line height is preferable to a fixed/minimum title height as a clipping fix.
- Root/body/app use `overflow:hidden` (`20–25`); main is a shrinking flex column (`137–141`), with a separately scrolling content area (`189–193`). Extremely tall wrapped headers can consume the available viewport and leave little content space; this does not establish that normal header text is clipped internally.
- `src/useAppFrame.ts:19–57` sets mobile shell height from visualViewport, detects keyboard by editing plus a >120px height delta, and sets `--app-top` to offsetTop only for an unzoomed detected keyboard. CSS applies it as relative `top` (`80–85`). This is visual viewport panning handling, not a safe-area calculation. Keyboard misclassification or a stale/panned viewport could affect shell visibility, but no device trace establishes that here. Resize/scroll/focus listeners and cleanup exist (`60–74`).
- Search state and keyboard state are separate shell classes (`App.tsx:460`). Search hides the eyebrow and reduces padding (`style.css:1707–1715`); keyboard hides bottom navigation (`1076–1080,1572–1574`). Any safe-area fix must survive the search override. Landscape can exceed the 760px mobile breakpoint: inspect both desktop/sidebar and mobile layouts, not just portrait. Neither header nor sidebar (`87–94`) reserves horizontal safe area.

## Primary-source interpretation and objections

1. [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) explains that cover removes automatic insetting and that important content needs safe-area padding. Insets do not replace ordinary layout margins; its max() example preserves normal spacing. This directly supports correcting the padding gap, including landscape sides.
2. [Apple: Supported Meta Tags, status-bar style](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html) documents default/black content below the status bar, versus black-translucent extending beneath it. **Objection:** the app uses default, not black-translucent. Do not claim that it explicitly requests status-bar overlay, or switch status-bar style as a presumed fix. This archived documentation does not prove modern installed-iOS geometry for this device.
3. [CSS Environment Variables, safe-area insets](https://drafts.csswg.org/css-env-1/#safe-area-insets) defines the safe rectangle and environment variables. Insets are UA-provided and may be zero; a missing env variable fallback does not force a nonzero inset. This specification is an editor's draft.
4. [CSSOM View, VisualViewport](https://drafts.csswg.org/cssom-view/#the-visualviewport-interface) defines offsetTop relative to the layout viewport and visual viewport size/scale. Those values must not be treated as notch/status-bar heights. This specification is also an editor's draft.

Most plausible source-supported hypothesis: unsafe content placement with cover. Alternative hypotheses include viewport panning around keyboard dismissal or excessive wrapping at a narrow width. We have no screenshot, iPhone model, iOS version, orientation, installed-build identity, computed inset values, heading bounds or keyboard timeline. Therefore neither root cause nor a physical-device fix is verified.

## Smallest robust change to propose

Keep cover and current status-bar metadata. Add safe-area-aware header padding after resolving the cascade, retaining ordinary spacing: top `max(base-top, env(safe-area-inset-top, 0px))`, left/right `max(base-inline, env(safe-area-inset-left/right, 0px))`. Keep existing bottom padding. For search, change the base top spacing to 10px without overwriting safe-area protection; mobile base is 14px and desktop base 18px. max() is the smallest safe-boundary fix; use calc(base + inset) only if the design explicitly requires the full ordinary gap inside the safe boundary. Do not add a fixed title height or rewrite viewport JS without evidence. Reserve horizontal safe area for the exposed landscape sidebar as well if it occupies the unsafe edge; header-only padding cannot protect sidebar branding.

## Meaningful regressions

- Browser geometry tests with injectable CSS inset custom properties (production defaults to env): zero insets, nonzero top, asymmetric landscape sides; check text range bounds and action bounds inside the safe rectangle, not merely padding strings. Exercise portrait and landscape widths on both sides of 760px.
- Long Chinese/English recipe headings at narrow widths and increased text size: all text remains within header bounds, wraps, does not overlap actions, and header does not shrink. Verify the scrolling content remains usable.
- Search focus/blur and back navigation preserve the top inset despite reduced padding and hidden eyebrow. Mock visualViewport resize/scroll with offsetTop, then keyboard dismissal: assert shell offset resets and title stays visible; include zoom and threshold cases. Mocks validate policy, not iOS behavior.
- Real installed iPhone acceptance remains necessary: cold launch, rotate both directions, open/close search keyboard, return from background; capture computed env insets and header/text bounds alongside screenshots. Desktop WebKit/mobile emulation does not recreate the installed status bar, cutout or real keyboard.

Validation: reviewed the requested source files and final CSS overrides; primary sources fetched directly. No runtime tests, commit or push were performed during that research-only phase.

## Implemented follow-up

Header top and inline padding now respect UA safe-area insets while retaining ordinary minimum spacing. Search keeps the same protection when it reduces its ordinary top spacing. The exposed desktop/landscape sidebar also reserves safe-area padding. Header background is opaque to reduce visual interference; this is presentation hardening, not a proven cure for the reported blurriness. Viewport/status-bar metadata and viewport JavaScript are unchanged.

Chromium and WebKit geometry regressions cover portrait top insets, search focus/cancel, asymmetric landscape side insets and enlarged long-title wrapping without action overlap. Insets are injected through CSS custom properties whose production defaults use `env()`. These tests demonstrate layout policy; they do not emulate iPhone hardware cutouts or establish the original physical-device root cause.

## Screenshot follow-up (2026-11-25)

The user's screenshot shows a vertically fading blur: PANFOLIO and the top of
both header action buttons are softened, while the page heading below remains
sharp. The screenshot does not show the title colliding with an icon. The earlier
safe-area geometry tests cannot detect a system compositor effect; v0.4.2 was not
sufficient to address the reported symptom.

The app applies no filter, mask, or backdrop filter to the header. The remaining
leading hypothesis is iOS standalone top-edge compositing, consistent with this
[first-person report](https://github.com/HKUDS/nanobot/issues/5772) and its
[merged workaround with native iOS simulator evidence](https://github.com/HKUDS/nanobot/pull/5942).
This is evidence from another project, not an Apple guarantee or a Panfolio device
reproduction. The user's OS version has not been established.

Version 0.4.3 adds an empty, noninteractive, viewport-fixed 11px color surface
outside the React root, present from initial HTML. It inherits an explicit body
background and clips that background to empty text so it paints no overlay. CSS
gates it on standalone display mode and WebKit touch-callout/text-clip support.
Ordinary browser tabs retain a hidden element. Existing safe-area padding,
viewport metadata, header layout, zoom behavior and stored data remain intact.
The implementation follows the upstream compatibility technique; 11px exceeds
its documented thin-border sampling threshold. This is a browser workaround,
not a supported API for disabling iOS effects.

The regression checks verify that the surface exists outside the app root,
remains empty/accessibility-hidden, stays inactive in normal browser tabs, and
survives language changes and navigation without blocking controls. Existing
header tests check geometry separately. Desktop Playwright does not reproduce
the native iOS blur. This machine has no available `simctl`; physical-iPhone
verification after a cold relaunch is still required before calling the visual
symptom resolved.
