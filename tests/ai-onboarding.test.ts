import test from "node:test";
import assert from "node:assert/strict";
import config from "../distribution/config.json";
import {
  projectAiDistribution,
  aiLinks,
  skillInstallPrompt,
  mcpSetupPrompt,
} from "../src/ai-onboarding";
const revision = "b".repeat(40);
const metadata = () => projectAiDistribution(config, revision);
test("onboarding exposes only public installation data and revision-bound sources", () => {
  const data = metadata();
  assert.equal(data.version, config.version);
  assert.equal(data.mcpEndpoint, config.mcpEndpoint);
  assert.ok(!JSON.stringify(data).includes(config.cloudflareAccountId));
  const links = aiLinks(data);
  assert.ok(links.skill.includes(`/v${config.version}/panfolio-skill.zip`));
  assert.ok(links.plugin.endsWith("panfolio-plugin-chatgpt.zip"));
  assert.ok(links.claudePlugin.endsWith("panfolio-plugin-claude.zip"));
  assert.ok(links.source.includes(`/${revision}/skills/panfolio`));
});
test("setup prompts give one source and stay focused on setup rather than cooking tests", () => {
  for (const locale of ["zh", "en"] as const) {
    const skill = skillInstallPrompt(metadata(), locale);
    const mcp = mcpSetupPrompt(metadata(), locale);
    assert.ok(skill.includes(aiLinks(metadata()).source));
    assert.ok(skill.includes(revision));
    assert.ok(mcp.includes(config.mcpEndpoint));
    assert.match(mcp, /Streamable HTTP/);
    for (const prompt of [skill, mcp]) {
      assert.equal((prompt.match(/https:\/\//g) || []).length, 1);
      assert.doesNotMatch(
        prompt,
        /三文鱼|酱油|salmon|soy sauce|get_guide|read_document|do not mix|不要混用/i,
      );
      assert.match(prompt, locale === "zh" ? /保留其他/ : /preserve other/i);
      assert.match(
        prompt,
        locale === "zh" ? /读取菜谱目录/ : /read the recipe index/i,
      );
      assert.match(prompt, locale === "zh" ? /无法.*说明/ : /cannot.*explain/i);
    }
    assert.match(skill, locale === "zh" ? /个人/ : /personal/i);
    assert.match(mcp, locale === "zh" ? /无需认证/ : /no authentication/i);
  }
});
