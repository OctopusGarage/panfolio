import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});

test("mobile discovery offers exactly four exclusive categories without advanced filters", async ({
  page,
}) => {
  const categories = page.locator(".discovery-presets button");
  await expect(categories).toHaveText(["中餐", "日厨系列", "甜品", "饮品"]);
  await expect(page.locator(".grid .card")).toHaveCount(46);
  for (const [index, count] of [
    [0, 30],
    [1, 14],
    [2, 1],
    [3, 1],
  ]) {
    await categories.nth(index).click();
    await expect(page.locator(".grid .card")).toHaveCount(count);
    await expect(
      page.locator('.discovery-presets [aria-pressed="true"]'),
    ).toHaveCount(1);
  }
  await categories.nth(3).click();
  await expect(page.locator(".grid .card")).toHaveCount(46);
  await expect(
    page.locator(
      ".discovery-sidebar, .discovery-mobile-filter, .discovery-scopes, .discovery-applied",
    ),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "保存搜索", exact: true }),
  ).toHaveCount(0);
});

test("child preparation opens a specific reader while parent requires a cooking choice", async ({
  page,
}) => {
  const card = page.locator('[data-recipe-id="awei-one-pot-rice"]');
  const child = card.locator(".discovery-preparations a").first();
  const childName = await child.textContent();
  await child.click();
  await expect(page.locator("#preparation-choice option:checked")).toHaveText(
    childName!,
  );
  await page.goBack();
  await card.locator("h3 a").click();
  await expect(page.locator("#preparation-choice")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "选择做法后开始" }),
  ).toBeDisabled();
  const value = await page
    .locator("#preparation-choice option")
    .nth(1)
    .getAttribute("value");
  await page.locator("#preparation-choice").selectOption(value!);
  await expect(page.locator("#preparation-choice")).toHaveValue(value!);
});

test("tried and repeat are explicit persistent decisions", async ({ page }) => {
  await page.locator(".card h3 a").first().click();
  const tried = page.getByRole("button", { name: "做过这道菜", exact: true });
  const repeat = page.getByRole("button", { name: "加入常做", exact: true });
  await expect(tried).toHaveAttribute("aria-pressed", "false");
  await expect(repeat).toHaveAttribute("aria-pressed", "false");
  await tried.click();
  await repeat.click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("panfolio-data") || "{}").kitchen
            ?.repeat.length,
      ),
    )
    .toBe(1);
  await page.reload();
  await expect(tried).toHaveAttribute("aria-pressed", "true");
  await expect(repeat).toHaveAttribute("aria-pressed", "true");
  await tried.click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("panfolio-data") || "{}").kitchen
            ?.tried.length,
      ),
    )
    .toBe(0);
  await page.reload();
  await expect(tried).toHaveAttribute("aria-pressed", "false");
  await expect(repeat).toHaveAttribute("aria-pressed", "true");
});

test("a preparation survives a kitchen-reference round trip with its reading position", async ({
  page,
}) => {
  await page.goto("/#samukichi-asparagus");
  const chooser = page.locator("#preparation-choice");
  const choice = await chooser.locator("option").last().getAttribute("value");
  await chooser.selectOption(choice!);
  const technique = page.locator(".recipe-techniques a").first();
  await technique.scrollIntoViewIfNeeded();
  const scroll = await page
    .locator(".page-scroll")
    .evaluate((element) => element.scrollTop);
  await technique.click();
  await expect(page.locator(".essential-detail")).toBeVisible();
  await page.goBack();
  await expect(chooser).toHaveValue(choice!);
  await expect
    .poll(() =>
      page.locator(".page-scroll").evaluate((element) => element.scrollTop),
    )
    .toBeGreaterThan(scroll - 80);
});

test("My kitchen has no private tag or saved-filter controls", async ({
  page,
}) => {
  await page.locator(".card-top button").first().click();
  await page.locator('a[href="#saved"]').click();
  await expect(page.getByLabel("私人标签（逗号分隔）")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "筛选", exact: true }),
  ).toHaveCount(0);
  expect(page.url()).not.toContain("PRIVATE");
});
