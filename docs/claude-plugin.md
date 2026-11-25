# Claude plugin installation

Use `panfolio-plugin-claude.zip` from the matching AI distribution release or the app's **AI → Claude** page. The filename and version come from `distribution/config.json`; current publication status is in [GitHub Releases](https://github.com/OctopusGarage/panfolio/releases).

## Install and use

In Claude, open **Customize → Plugins** and use the custom-plugin upload option offered by your current interface. In Cowork, open Cowork before Customize. Upload the native Claude ZIP, complete the applicable checks and enable it. Start a new conversation/task; use `/` or `+` to find Panfolio's Skill. Ask it to read the crispy-skin salmon recipe, explain when to add soy sauce and provide the original video link. A correct response preserves the off-heat finish. Product surface, plan and organization controls affect availability; uploading a ZIP as an ordinary chat attachment is not installing it. [Official Claude plugin guide](https://support.claude.com/en/articles/13837440-use-plugins-in-claude).

The package contains no local server, hook, command runner, database or credentials. It includes the shared Skill and uses public cookbook Markdown or already connected Panfolio MCP tools. Plugin upload does not itself connect MCP. If the host cannot read public URLs, configure the separately documented remote connector or state that access is unavailable; do not invent a recipe.

## Why a separate ZIP

Claude uses `.claude-plugin/plugin.json` with `skills/` beside that directory. The portable `panfolio-plugin-chatgpt.zip` uses root `plugin.json` for the Agent Plugins/OpenAI path. The native archive contains one Claude manifest and omits the portable root manifest; its cooking instructions, icon and release metadata match the other packages. [Manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference), [Claude upload requirements](https://platform.claude.com/docs/en/manage-claude/plugins-api).

## Verification boundaries

Local archive tests check native layout, shared Skill/version and the absence of OpenAI-specific manifest fields. The installed official CLI's `claude plugin validate` command passed against an extracted package and discovered `panfolio:panfolio`. The package includes a descriptive root README so directory structure checks also pass. No marketplace install command is fabricated because Panfolio does not yet distribute a validated Claude marketplace catalog. The CLI's nonblocking marketplace advice is not an account-side failure.

This evidence does not certify an upload into a real Claude account, security scan, public-directory review or every Claude client version. Do not treat a successful format check as a successful recipe read. Native Claude accounts must still be tested with the actual published package and a real source-backed query.
