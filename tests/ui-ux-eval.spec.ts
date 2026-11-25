import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Release scenarios complement feature tests with responsive, bilingual page checks.
for (const width of [320, 390, 768, 1280]) {
  for (const locale of ["zh", "en"] as const) {
    test(`UI release matrix: ${width}px ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript(
        (language) => localStorage.setItem("panfolio:locale", language),
        locale,
      );
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const route of [
        "library",
        "essentials",
        "saved",
        "settings",
        "guides",
        "japanese-chef",
        "samukichi-asparagus",
        "essentials/potato-julienne",
      ]) {
        await page.goto(`/#${route}`);
        await expect(page.locator("#content-heading")).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute(
          "lang",
          locale === "zh" ? "zh-CN" : "en",
        );
        const geometry = await page.evaluate(() => {
          const heading = document
            .querySelector("#content-heading")!
            .getBoundingClientRect();
          const actions = document.querySelector(
            ".app-header .connection",
          )?.parentElement;
          return {
            viewport: innerWidth,
            document: document.documentElement.scrollWidth,
            content: document.querySelector(".page-scroll")!.scrollWidth,
            main: document.querySelector(".page-scroll")!.clientWidth,
            headingRight: heading.right,
            headerRight: actions?.getBoundingClientRect().right ?? innerWidth,
          };
        });
        expect(geometry.document, route).toBeLessThanOrEqual(width);
        expect(geometry.content, route).toBeLessThanOrEqual(geometry.main + 1);
        const violations = (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .analyze()
        ).violations;
        expect(
          violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          route,
        ).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }
}

test("filter sheet keeps background controls inert, returns focus and supports both languages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const filter = page.locator(".discovery-mobile-filter");
  await filter.click();
  const sheet = page.getByRole("dialog", { name: "筛选", exact: true });
  await expect(sheet).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(
      () =>
        document.activeElement?.tagName +
        ":" +
        document.activeElement?.getAttribute("aria-label"),
    );
    expect(
      await sheet.evaluate(
        (element) =>
          element.contains(document.activeElement) ||
          document.activeElement === document.body,
      ),
      active,
    ).toBe(true);
  }
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(sheet).not.toBeVisible();
  await expect(filter).toBeFocused();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await filter.click();
  await expect(
    page.getByRole("dialog", { name: "Filters", exact: true }),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
});

test("mixed-search sheet counts all result types and Clear all restores destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("searchbox").fill("土豆");
  const count = Number(
    (await page.locator(".search-results-count").innerText()).match(/\d+/)![0],
  );
  await expect(page.locator(".essential-card").first()).toBeVisible();
  await page.locator(".discovery-mobile-filter").click();
  const sheet = page.getByRole("dialog", { name: "筛选", exact: true });
  await expect(sheet.getByRole("button", { name: /^显示结果/ })).toHaveText(
    `显示结果 (${count})`,
  );
  await sheet.getByRole("button", { name: "清除全部", exact: true }).click();
  await sheet.getByRole("button", { name: /^显示结果/ }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.locator(".essential-card")).toHaveCount(0);
  await expect(page.locator(".discovery-scopes")).toHaveCount(0);
});

test("My kitchen query and focused recipe survive a detail round trip", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".card-top button").first().click();
  await page.locator('a[href="#saved"]').click();
  const query = page.getByRole("searchbox", { name: "搜索我的厨房" });
  await query.fill("土豆");
  const card = page.locator(".my-kitchen .card > button");
  await card.click();
  await page.getByRole("button", { name: /返回菜谱/ }).click();
  await expect(query).toHaveValue("土豆");
  await expect(card).toBeFocused();
});

test("saved chef-series searches preserve their collection restriction", async ({
  page,
}) => {
  await page.goto("/#japanese-chef");
  await page.getByRole("searchbox").fill("鸡");
  const expected = await page
    .locator(".card[data-recipe-id]")
    .evaluateAll((cards) =>
      cards.map((card) => (card as HTMLElement).dataset.recipeId).sort(),
    );
  expect(expected.length).toBeGreaterThan(0);
  await page.getByRole("button", { name: "保存搜索", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("panfolio-data") || "{}").kitchen
            ?.searches.length,
      ),
    )
    .toBe(1);
  await page.locator('a[href="#saved"]').click();
  await page.getByRole("button", { name: "筛选", exact: true }).click();
  await page
    .locator(".my-kitchen")
    .getByRole("button", { name: "鸡", exact: true })
    .click();
  await expect(page.locator(".card[data-recipe-id]")).toHaveCount(
    expected.length,
  );
  expect(
    await page
      .locator(".card[data-recipe-id]")
      .evaluateAll((cards) =>
        cards.map((card) => (card as HTMLElement).dataset.recipeId).sort(),
      ),
  ).toEqual(expected);
  await expect(page).toHaveURL(/#japanese-chef$/);
});
