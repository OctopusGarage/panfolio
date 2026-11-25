import { releaseTag } from "../distribution/release";
import type { Locale } from "./types";
export interface AiDistribution {
  version: string;
  repository: string;
  mcpEndpoint: string;
  sourceRevision: string;
  packages: {
    skill: string;
    plugin: string;
    claudePlugin: string;
  };
}
export function projectAiDistribution(
  config: Omit<AiDistribution, "sourceRevision">,
  sourceRevision: string,
): AiDistribution {
  if (!/^[a-f0-9]{40}$/.test(sourceRevision))
    throw Error("Invalid onboarding source revision");
  return {
    version: config.version,
    repository: config.repository,
    mcpEndpoint: config.mcpEndpoint,
    sourceRevision,
    packages: { ...config.packages },
  };
}
export function aiLinks(data: AiDistribution) {
  const tag = releaseTag(data.version);
  return {
    release: `${data.repository}/releases/tag/${tag}`,
    skill: `${data.repository}/releases/download/${tag}/${data.packages.skill}`,
    plugin: `${data.repository}/releases/download/${tag}/${data.packages.plugin}`,
    claudePlugin: `${data.repository}/releases/download/${tag}/${data.packages.claudePlugin}`,
    source: `${data.repository}/tree/${data.sourceRevision}/skills/panfolio`,
    icon: new URL("/icon.png", data.mcpEndpoint).href,
  };
}
export function skillInstallPrompt(data: AiDistribution, locale: Locale) {
  const source = aiLinks(data).source;
  return locale === "zh"
    ? `请为当前 Agent 安装或更新 Panfolio Skill：${source}。使用个人安装范围，保留其他配置。安装后实际读取菜谱目录，确认可用；无法安装或读取时请说明原因。`
    : `Install or update the Panfolio Skill for this agent: ${source}. Use the personal skill location and preserve other configuration. Then read the recipe index to check it works. If you cannot install or read it, explain why.`;
}
export function mcpSetupPrompt(data: AiDistribution, locale: Locale) {
  return locale === "zh"
    ? `请在当前 AI 的个人配置中添加或更新 Panfolio MCP：${data.mcpEndpoint}。传输方式为 Streamable HTTP，无需认证。保留其他配置，连接后实际读取菜谱目录，确认可用；无法配置或连接时请说明原因。`
    : `Add or update Panfolio MCP in this AI's personal configuration: ${data.mcpEndpoint}. Use Streamable HTTP with no authentication and preserve other configuration. Then read the recipe index to check the connection. If you cannot configure or connect it, explain why.`;
}
export const aiDescription = {
  zh: "Panfolio：读取有来源的菜谱与厨房技巧，保留原方用量、操作说明和适用边界。",
  en: "Panfolio: sourced recipes and kitchen techniques, preserving quantities, explanations and scope.",
};
export const aiExamples = {
  zh: [
    "用 Panfolio 一步步教我做芦笋五花肉卷，先给食材和第一步。",
    "用 Panfolio 解释土豆丝怎么切、容易错在哪。",
    "按 Panfolio 的芦笋肉卷和香煎三文鱼整理采购清单，可选配料单列。",
  ],
  en: [
    "Use Panfolio to guide me through asparagus pork rolls. Start with ingredients and stage one.",
    "Use Panfolio to explain potato julienne and common mistakes.",
    "Make a Panfolio shopping list for asparagus pork rolls and pan-seared salmon; separate optional ingredients.",
  ],
};
