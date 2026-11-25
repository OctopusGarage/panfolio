# Embedded source video

Recipe and Kitchen essentials detail pages use the shared `SourceVideo` component. Source metadata lives in `src/recipe-videos.json`, keyed by stable recipe ID, independently of recipe Markdown and provenance. Existing original YouTube IDs are copied from reviewed recipe references; all thirteen Japanese chef entries also include their reviewed Bilibili IDs. No chapter positions are inferred.

## Behavior

No player iframe, player SDK, provider thumbnail or provider preconnect is created before the reader selects Watch video. Only one iframe exists per panel. Source switching remounts the iframe; closing, navigating to another recipe/reference, or going offline removes it. Returning online re-enables the button but does not resume automatically. Language switching updates labels without remounting the video.

YouTube uses `youtube-nocookie.com`, requests inline iOS playback and disables autoplay. Bilibili uses its official external player with the first part selected, autoplay disabled and danmaku disabled. Original-site links remain available inside the open panel. YouTube privacy-enhanced mode is not a claim that playback makes no third-party requests. Provider playback may show ads or require opening the original site.

Frames have a localized accessible title, fullscreen support and `strict-origin-when-cross-origin` referrer policy, supplying origin identification without adding recipe notes to URLs. No arbitrary iframe URL or HTML is accepted from content. The shared URL builder validates known provider IDs.

The player is responsive, with a minimum height of 200 pixels rather than forcing a narrow 16:9 frame below YouTube's documented minimum. Closing restores focus to the disclosure button. Escape closes the panel when focus is in the surrounding panel; keys inside the cross-origin player remain controlled by the provider.

Video playback requires connectivity and is not part of offline readiness. The service worker handles only same-origin resources, so these third-party player requests are not added to the app's caches. Recipe favorites and notes are unchanged.

## References

- [YouTube player parameters](https://developers.google.com/youtube/player_parameters)
- [YouTube IFrame API and errors](https://developers.google.com/youtube/iframe_api_reference)
- [YouTube embedding and privacy-enhanced mode](https://support.google.com/youtube/answer/171780)
- [Bilibili external-player parameters](https://player.bilibili.com/)

## Verification limits

Integration tests stub provider documents to verify lazy network behavior, URLs, source switching, route teardown, offline handling, localization and geometry deterministically. They do not prove that the actual source videos can play from a particular country, device or account. A loaded iframe is not reported as successful playback. Original-site fallback is always provided; source-specific embed restrictions remain controlled by each platform. Physical iPhone standalone playback and live provider behavior require separate manual verification.
