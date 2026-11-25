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
        "ai",
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

test("chef category search stays within its category and survives a detail round trip", async ({
  page,
}) => {
  await page.goto("/#japanese-chef");
  await expect(page.locator(".grid .card")).toHaveCount(14);
  await page.getByRole("searchbox").fill("鸡");
  const cards = page.locator(".card[data-recipe-id]");
  const ids = await cards.evaluateAll((items) =>
    items.map((item) => (item as HTMLElement).dataset.recipeId).sort(),
  );
  expect(ids.length).toBeGreaterThan(0);
  await cards.locator("h3 a").first().click();
  await page.getByRole("button", { name: /返回菜谱/ }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("鸡");
  expect(
    await cards.evaluateAll((items) =>
      items.map((item) => (item as HTMLElement).dataset.recipeId).sort(),
    ),
  ).toEqual(ids);
});
