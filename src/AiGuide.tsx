import { useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { ClipboardWriter } from "./clipboard-writer";
import type { Locale } from "./types";
import { AiCopy } from "./AiCopy";
import {
  aiDescription,
  aiExamples,
  aiLinks,
  mcpSetupPrompt,
  skillInstallPrompt,
} from "./ai-onboarding";
import { Icon } from "./Icon";
import aiIcon from "../public/branding/panfolio-mcp-icon-128.png";
import "./ai-guide.css";

type Method = "skill" | "plugin" | "mcp";
const data = __AI_DISTRIBUTION__;
const links = aiLinks(data);
const download = (name: string) =>
  import.meta.env.BASE_URL + "downloads/" + name;

export default function AiGuide({
  locale,
  writer,
  copying,
  online,
}: {
  locale: Locale;
  writer: ClipboardWriter;
  copying: boolean;
  online: boolean;
}) {
  const s = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const id = useId();
  const [method, setMethod] = useState<Method>("skill");
  const [host, setHost] = useState("chatgpt");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useLayoutEffect(() => {
    writer.invalidate();
  }, [method, host, locale, writer]);
  const choices: { id: Method; label: string }[] = [
    { id: "skill", label: s("安装 Skill", "Install Skill") },
    { id: "plugin", label: s("上传插件", "Upload plugin") },
    { id: "mcp", label: s("连接 MCP", "Connect MCP") },
  ];
  function tabKey(event: KeyboardEvent, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    setMethod(choices[next].id);
    tabs.current[next]?.focus();
  }
  const copy = (
    text: string,
    label: string,
    primary = false,
    compact = false,
  ) => (
    <AiCopy
      text={text}
      label={label}
      primary={primary}
      compact={compact}
      locale={locale}
      writer={writer}
      busy={copying}
    />
  );
  const prompt =
    method === "skill"
      ? skillInstallPrompt(data, locale)
      : mcpSetupPrompt(data, locale);
  const pluginName =
    host === "claude" ? data.packages.claudePlugin : data.packages.plugin;
  return (
    <section className="ai-guide">
      <header className="ai-intro">
        <img src={aiIcon} width="48" height="48" alt="" />
        <div>
          <h2>
            {s("把菜谱带到你常用的 AI", "Bring your cookbook to your AI")}
          </h2>
          <p>
            {s(
              "复制提示词，让你的 Agent 安装 Panfolio，陪你查菜谱、学技巧、做饭。",
              "Give your agent the setup prompt, then find recipes, learn techniques and cook together.",
            )}
          </p>
        </div>
      </header>
      <div
        className="ai-methods"
        role="tablist"
        aria-label={s("接入方式", "Setup method")}
      >
        {choices.map((choice, index) => (
          <button
            type="button"
            key={choice.id}
            ref={(el) => {
              tabs.current[index] = el;
            }}
            id={`${id}-${choice.id}`}
            role="tab"
            aria-selected={method === choice.id}
            aria-controls={`${id}-panel`}
            tabIndex={method === choice.id ? 0 : -1}
            onKeyDown={(event) => tabKey(event, index)}
            onClick={() => setMethod(choice.id)}
          >
            {choice.label}
          </button>
        ))}
      </div>
      {!online && (
        <p className="ai-offline" role="status">
          {s(
            "当前离线，下载和连接 AI 需要联网。",
            "You are offline. Downloads and AI connections need a network.",
          )}
        </p>
      )}
      <section
        className="ai-setup"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${method}`}
      >
        {method === "skill" && (
          <>
            <h3>{s("让 Agent 帮你安装", "Let your agent install it")}</h3>
            <p className="ai-description">
              {s(
                "把提示词发给支持 Skill 的 Agent，让它安装并确认可以读取菜谱。",
                "Send the prompt to a skill-capable agent to install Panfolio and check recipe access.",
              )}
            </p>
            <div className="ai-actions">
              {copy(
                prompt,
                s("复制安装提示词", "Copy installation prompt"),
                true,
              )}
              <a
                className="ai-secondary"
                href={download(data.packages.skill)}
                download={data.packages.skill}
              >
                {s("下载 Skill 包", "Download Skill package")}
              </a>
            </div>
            <p className="ai-note">
              {s(
                "也可以在 AI 的 Skills 设置中上传 Skill 包并启用。",
                "You can also upload the Skill package in your AI’s Skills settings and enable it.",
              )}
            </p>
          </>
        )}
        {method === "plugin" && (
          <>
            <h3>{s("上传到你的 AI", "Upload to your AI")}</h3>
            <fieldset className="ai-host">
              <legend>{s("使用的 AI", "Your AI")}</legend>
              <div className="ai-host-options">
                {(["chatgpt", "claude"] as const).map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={`${id}-host`}
                      value={value}
                      checked={host === value}
                      onChange={() => setHost(value)}
                    />
                    <span>
                      {value === "chatgpt" ? "ChatGPT" : "Claude"}
                      <Icon name="check" />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <ol className="ai-instructions">
              <li>
                {s(
                  "下载对应的插件包。",
                  "Download the plugin package for your AI.",
                )}
              </li>
              <li>
                {host === "claude"
                  ? s(
                      "打开 Claude 的 Customize → Plugins，上传并启用 Panfolio。",
                      "Open Customize → Plugins in Claude, upload the package and enable Panfolio.",
                    )
                  : s(
                      "打开 ChatGPT 管理后台的 Plugins，选择 Add → Upload plugin，上传并启用 Panfolio。",
                      "In the ChatGPT admin console, open Plugins → Add → Upload plugin, upload the package and enable Panfolio.",
                    )}
              </li>
            </ol>
            <div className="ai-actions">
              <a
                className="ai-primary"
                href={download(pluginName)}
                download={pluginName}
              >
                <Icon name="download" />
                {s("下载插件包", "Download plugin package")}
              </a>
              <a
                className="ai-secondary"
                href={
                  host === "claude"
                    ? "https://claude.ai/"
                    : "https://admin.openai.com/"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {host === "claude"
                  ? s("打开 Claude", "Open Claude")
                  : s("打开 ChatGPT 管理后台", "Open ChatGPT admin console")}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </>
        )}
        {method === "mcp" && (
          <>
            <h3>{s("连接菜谱库", "Connect the cookbook")}</h3>
            <p className="ai-description">
              {s(
                "把配置提示词发给 Agent，或在 AI 的远程 MCP 设置中填写下方地址。",
                "Send the setup prompt to your agent, or enter this URL in your AI’s remote MCP settings.",
              )}
            </p>
            <code className="ai-endpoint" dir="ltr">
              {data.mcpEndpoint}
            </code>
            <p className="ai-note">
              {s(
                "名称 Panfolio · Streamable HTTP · 无需认证",
                "Name: Panfolio · Streamable HTTP · No authentication",
              )}
            </p>
            <div className="ai-actions">
              {copy(prompt, s("复制配置提示词", "Copy setup prompt"), true)}
              {copy(data.mcpEndpoint, s("复制 MCP 地址", "Copy MCP URL"))}
            </div>
            <details>
              <summary>{s("描述与图标", "Description and icon")}</summary>
              <p>{aiDescription[locale]}</p>
              <div className="ai-actions">
                {copy(aiDescription[locale], s("复制描述", "Copy description"))}
                <a
                  className="ai-secondary"
                  href={
                    import.meta.env.BASE_URL + "branding/panfolio-mcp-icon.png"
                  }
                  download="panfolio-mcp-icon.png"
                >
                  {s("下载图标", "Download icon")}
                </a>
              </div>
            </details>
          </>
        )}
        {method !== "plugin" && (
          <details className="ai-prompt">
            <summary>{s("查看提示词", "View prompt")}</summary>
            <textarea
              readOnly
              value={prompt}
              rows={7}
              aria-label={s("完整设置提示词", "Full setup prompt")}
            />
          </details>
        )}
      </section>
      <section className="ai-examples" aria-labelledby={`${id}-examples`}>
        <h3 id={`${id}-examples`}>
          {s("安装后，试着这样问", "Once set up, try asking")}
        </h3>
        <ul>
          {aiExamples[locale].map((example) => (
            <li key={example}>{copy(example, example, false, true)}</li>
          ))}
        </ul>
      </section>
      <footer className="ai-footer">
        <p>
          {s("公开菜谱与厨房技巧", "Public recipes and kitchen techniques")}
        </p>
        <a href={links.release} target="_blank" rel="noopener noreferrer">
          {s(
            `全部安装包 · v${data.version}`,
            `All packages · v${data.version}`,
          )}
          <span aria-hidden="true"> ↗</span>
        </a>
      </footer>
    </section>
  );
}
