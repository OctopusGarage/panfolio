# Panfolio MCP icon

A saucepan, an open recipe book and steam express the public cooking knowledge service. The forest-green, sage and cream palette follows the existing Panfolio app identity. The design has no text, so the same asset works in Chinese and English interfaces.

## Files

- `icon-source.png`: original AI-generated 1254×1254 PNG, retained as the original artwork source.
- `../../../public/branding/panfolio-mcp-icon.png`: recommended upload, opaque 512×512 PNG.
- `../../../public/branding/panfolio-mcp-icon-128.png`: compact 128×128 PNG.

The exported file paths above are relative to this directory. The PNGs are deliberately opaque so the small symbol remains legible on light and dark configuration screens. Consumers can apply their own rounded-square or circular mask.

## Rebuild

From the repository root:

```sh
pnpm mcp:icon
```

The command exports sizes from the tracked source using the existing Sharp development dependency. It does not regenerate or change the artwork. Source and exported files are tracked together. The image was generated specifically for Panfolio MCP; do not treat it as an official MCP, Cloudflare or AI-provider logo.

For direct upload, select `public/branding/panfolio-mcp-icon.png`. After this revision is pushed, a URL-based configuration can use:

```text
https://raw.githubusercontent.com/OctopusGarage/panfolio/main/public/branding/panfolio-mcp-icon.png
```

That URL is not published by a local export. GitHub Pages can serve `/panfolio/branding/panfolio-mcp-icon.png` after the corresponding app deployment; the MCP Worker also serves the same bytes at `/icon.png`.

`exports.json` records the source and exported image hashes. Distribution checks reject changed artwork or PNGs until `pnpm mcp:icon` regenerates this evidence. The same public PNG is copied into the Skill, packaged in the plugin and bundled in MCP.
