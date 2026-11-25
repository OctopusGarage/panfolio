import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("AI setup has exactly three methods and host-specific plugin downloads", async ({
  page,
}) => {
  await page.goto("/#ai");
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "复制安装提示词", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "上传插件", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "下载插件包", exact: true }),
  ).toHaveAttribute("href", /downloads\/panfolio-plugin-chatgpt.zip$/);
  await page.getByRole("radio", { name: "Claude", exact: true }).check();
  await expect(
    page.getByRole("radio", { name: "Claude", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("link", { name: "下载插件包", exact: true }),
  ).toHaveAttribute("href", /downloads\/panfolio-plugin-claude.zip$/);
  await page.getByRole("tab", { name: "安装 Skill", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "下载 Skill 包", exact: true }),
  ).toHaveAttribute("href", /downloads\/panfolio-skill.zip$/);
  await page.getByRole("tab", { name: "连接 MCP", exact: true }).click();
  await expect(
    page.getByText("https://panfolio-mcp.octopusgarage.workers.dev/mcp", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/原生 Claude 清单|不是把|套餐|开发者说明/),
  ).toHaveCount(0);
  const tabs = page.getByRole("tab");
  await tabs.last().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.first()).toBeFocused();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
});

test("copy denial reveals selectable text and never claims connection", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    }),
  );
  await page.goto("/#ai");
  await page.getByRole("tab", { name: "连接 MCP", exact: true }).click();
  await page
    .getByRole("button", { name: "复制 MCP 地址", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "手动复制：复制 MCP 地址" }),
  ).toHaveValue("https://panfolio-mcp.octopusgarage.workers.dev/mcp");
  await expect(page.getByText("已连接", { exact: true })).toHaveCount(0);
});

test("return from AI retains library search and active navigation", async ({
  page,
}) => {
  await page.goto("/#library");
  await page.getByRole("searchbox").fill("鸡");
  await page.locator(".page-scroll").evaluate((element) => {
    element.scrollTop = 180;
  });
  await page.getByRole("link", { name: "AI", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("link", { name: "AI", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.goBack();
  await expect(page).toHaveURL(/#library$/);
  await expect(page.getByRole("searchbox")).toHaveValue("鸡");
  await expect(
    page.getByRole("link", { name: "AI", exact: true }),
  ).toBeFocused();
  await page.goto("/#settings");
  await page.getByRole("link", { name: "在 AI 中使用 Panfolio" }).click();
  await expect(page).toHaveURL(/#ai$/);
});

for (const locale of ["zh", "en"] as const) {
  test(`AI guide responsive and accessible: ${locale}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (l) => localStorage.setItem("panfolio:locale", l),
      locale,
    );
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/#ai");
      await expect(page.locator(".ai-guide")).toBeVisible();
      for (let index = 0; index < 3; index++) {
        await page.getByRole("tab").nth(index).click();
        const geometry = await page.evaluate(() => ({
          width: innerWidth,
          doc: document.documentElement.scrollWidth,
          scroll: document.querySelector(".page-scroll")!.scrollWidth,
          client: document.querySelector(".page-scroll")!.clientWidth,
        }));
        expect(geometry.doc).toBeLessThanOrEqual(geometry.width);
        expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa"])
              .analyze()
          ).violations,
        ).toEqual([]);
        for (const tab of await page.getByRole("tab").all()) {
          expect((await tab.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        }
        if (width === 390 && locale === "zh")
          await page.screenshot({
            path: testInfo.outputPath(`ai-method-${index}.png`),
          });
      }
    }
  });
}

test("setup prompts copy public release data and suppress stale feedback after selection changes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as Window & {
      aiCopied?: string;
      aiResolve?: () => void;
    };
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          state.aiCopied = text;
          return new Promise<void>((resolve) => {
            state.aiResolve = resolve;
          });
        },
      },
      configurable: true,
    });
    localStorage.setItem("private-ai-test", "PRIVATE_NOTE_SHOULD_NOT_COPY");
  });
  await page.goto("/#ai");
  await page.getByRole("tab", { name: "安装 Skill", exact: true }).click();
  await page
    .getByRole("button", { name: "复制安装提示词", exact: true })
    .click();
  const copied = await page.evaluate(
    () => (window as Window & { aiCopied?: string }).aiCopied,
  );
  expect(copied).not.toMatch(/三文鱼|酱油|get_guide|read_document/);
  expect(copied).toContain("/tree/");
  expect(copied).not.toContain("PRIVATE_NOTE_SHOULD_NOT_COPY");
  await page.getByRole("tab", { name: "连接 MCP", exact: true }).click();
  await page.evaluate(() =>
    (window as Window & { aiResolve?: () => void }).aiResolve?.(),
  );
  await expect(page.getByText("已复制", { exact: true })).toHaveCount(0);
});

test("AI guide remains readable offline without endpoint probes", async ({
  page,
  context,
}) => {
  const remote: string[] = [];
  page.on("request", (request) => {
    if (/workers\.dev|api\.github\.com/.test(request.url()))
      remote.push(request.url());
  });
  await page.goto("/#library");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.goto("/#ai");
  await expect(
    page.getByRole("heading", { name: "把菜谱带到你常用的 AI" }),
  ).toBeVisible();
  await expect(
    page.getByText("当前离线，下载和连接 AI 需要联网。"),
  ).toBeVisible();
  await page.getByRole("tab", { name: "连接 MCP", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "复制 MCP 地址", exact: true }),
  ).toBeEnabled();
  expect(remote).toEqual([]);
});

test("pointer return from AI does not restore a keyboard focus ring", async ({
  page,
}) => {
  await page.goto("/#library");
  await page.getByRole("searchbox").fill("鸡");
  await page.getByRole("link", { name: "AI", exact: true }).click();
  await page.goBack();
  await expect(page.getByRole("searchbox")).toHaveValue("鸡");
  await expect(
    page.locator('.app-nav a[href="#ai"]:focus-visible'),
  ).toHaveCount(0);
});

test("keyboard navigation uses a contained rounded focus ring", async ({
  page,
}) => {
  await page.goto("/#library");
  await page.getByRole("searchbox").focus();
  await page.keyboard.press("Shift+Tab");
  const link = page.locator('.app-nav a[href="#ai"]');
  await link.focus();
  const style = await link.evaluate((el) => {
    const css = getComputedStyle(el);
    return {
      visible: el.matches(":focus-visible"),
      offset: parseFloat(css.outlineOffset),
      radius: parseFloat(css.borderRadius),
    };
  });
  expect(style.visible).toBe(true);
  expect(style.offset).toBeLessThan(0);
  expect(style.radius).toBeGreaterThan(0);
});

test("touch return from AI leaves the bottom navigation without a focus frame", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  try {
    const page = await context.newPage();
    await page.goto("/#library");
    await page.getByRole("searchbox").fill("鸡");
    await page.getByRole("link", { name: "AI", exact: true }).tap();
    await page.goBack();
    await expect(page.getByRole("searchbox")).toHaveValue("鸡");
    await expect(page.locator(".app-nav a:focus-visible")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "全部菜谱", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  } finally {
    await context.close();
  }
});

test("plugin host selector supports keyboard selection and retains the chosen package", async ({
  page,
}) => {
  await page.goto("/#ai");
  await page.getByRole("tab", { name: "上传插件", exact: true }).click();
  const chatgpt = page.getByRole("radio", { name: "ChatGPT", exact: true });
  await chatgpt.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "Claude", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("link", { name: "下载插件包", exact: true }),
  ).toHaveAttribute("href", /panfolio-plugin-claude.zip$/);
  await page.getByRole("tab", { name: "安装 Skill", exact: true }).click();
  await page.getByRole("tab", { name: "上传插件", exact: true }).click();
  await expect(
    page.getByRole("radio", { name: "Claude", exact: true }),
  ).toBeChecked();
});

for (const locale of ["zh", "en"] as const) {
  test(`setup prompt preview matches copied text without stale success: ${locale}`, async ({
    page,
  }) => {
    await page.addInitScript((language) => {
      localStorage.setItem("panfolio:locale", language);
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text: string) => {
            (window as Window & { aiCopied?: string }).aiCopied = text;
          },
        },
        configurable: true,
      });
    }, locale);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#ai");
    const labels =
      locale === "zh"
        ? {
            preview: "查看提示词",
            prompt: "完整设置提示词",
            install: "复制安装提示词",
            mcp: "连接 MCP",
            setup: "复制配置提示词",
            copied: "已复制",
          }
        : {
            preview: "View prompt",
            prompt: "Full setup prompt",
            install: "Copy installation prompt",
            mcp: "Connect MCP",
            setup: "Copy setup prompt",
            copied: "Copied",
          };
    await page.getByText(labels.preview, { exact: true }).click();
    const skill = await page
      .getByRole("textbox", { name: labels.prompt })
      .inputValue();
    expect(skill).not.toMatch(
      /salmon|soy sauce|三文鱼|酱油|get_guide|read_document/i,
    );
    expect(
      await page
        .getByRole("textbox", { name: labels.prompt })
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(16);
    await page
      .getByRole("button", { name: labels.install, exact: true })
      .click();
    await expect(page.getByText(labels.copied, { exact: true })).toBeVisible();
    expect(
      await page.evaluate(
        () => (window as Window & { aiCopied?: string }).aiCopied,
      ),
    ).toBe(skill);
    await page.getByRole("tab", { name: labels.mcp, exact: true }).click();
    await expect(page.getByText(labels.copied, { exact: true })).toHaveCount(0);
    const details = page.locator("details.ai-prompt");
    if (!(await details.evaluate((el) => (el as HTMLDetailsElement).open)))
      await page.getByText(labels.preview, { exact: true }).click();
    const mcp = await page
      .getByRole("textbox", { name: labels.prompt })
      .inputValue();
    await page.getByRole("button", { name: labels.setup, exact: true }).click();
    await expect(page.getByText(labels.copied, { exact: true })).toBeVisible();
    expect(
      await page.evaluate(
        () => (window as Window & { aiCopied?: string }).aiCopied,
      ),
    ).toBe(mcp);
    expect(mcp).toContain("https://panfolio-mcp.octopusgarage.workers.dev/mcp");
  });
}
