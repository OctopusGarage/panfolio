import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});

test("mobile filters discard cancel and browser Back drafts, then commit Apply", async ({
  page,
}) => {
  const filters = page.locator(".discovery-mobile-filter");
  const sheet = page.getByRole("dialog", { name: "筛选", exact: true });
  const first = sheet.getByRole("checkbox").first();
  await filters.click();
  await first.check();
  await sheet.getByRole("button", { name: "取消", exact: true }).click();
  await expect(sheet).not.toBeVisible();
  await filters.click();
  await expect(first).not.toBeChecked();
  await first.check();
  await page.goBack();
  await expect(sheet).not.toBeVisible();
  await filters.click();
  await expect(first).not.toBeChecked();
  await first.check();
  await sheet.getByRole("button", { name: /^显示结果/ }).click();
  await expect(sheet).not.toBeVisible();
  await expect(page.locator(".discovery-applied")).toBeVisible();
  await filters.click();
  await expect(first).toBeChecked();
});

test("ALL ingredients cannot combine separate preparations in a collection", async ({
  page,
}) => {
  await expect(
    page.locator('[data-recipe-id="awei-one-pot-rice"]'),
  ).toBeVisible();
  await page.locator(".discovery-mobile-filter").click();
  const sheet = page.getByRole("dialog");
  const ingredients = sheet.getByRole("group", {
    name: "主要食材",
    exact: true,
  });
  const search = ingredients.getByRole("textbox");
  await search.fill("鸡蛋");
  await ingredients.getByRole("checkbox").first().check();
  await search.fill("土豆");
  await ingredients.getByRole("checkbox").first().check();
  await ingredients.getByRole("combobox").selectOption("any");
  await sheet.getByRole("button", { name: /^显示结果/ }).click();
  await expect(
    page.locator('[data-recipe-id="awei-one-pot-rice"]'),
  ).toBeVisible();
  await page.locator(".discovery-mobile-filter").click();
  await ingredients.getByRole("combobox").selectOption("all");
  await sheet.getByRole("button", { name: /^显示结果/ }).click();
  await expect(
    page.locator('[data-recipe-id="awei-one-pot-rice"]'),
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

test("saved searches restore query and reference scope after reload", async ({
  page,
}) => {
  await page.getByRole("searchbox").fill("土豆");
  await page
    .locator(".discovery-scopes")
    .getByRole("button", { name: /^厨房基础/ })
    .click();
  await expect(page.locator(".discovery-results .card")).toHaveCount(0);
  await expect(page.locator(".essential-card").first()).toBeVisible();
  await page.getByRole("button", { name: "保存搜索", exact: true }).click();
  await page.locator('a[href="#saved"]').click();
  await page.getByRole("button", { name: "筛选", exact: true }).click();
  await page.reload();
  await page
    .locator(".my-kitchen")
    .getByRole("button", { name: "土豆", exact: true })
    .click();
  await expect(page.getByRole("searchbox")).toHaveValue("土豆");
  await expect(
    page
      .locator(".discovery-scopes")
      .getByRole("button", { name: /^厨房基础/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".discovery-results .card")).toHaveCount(0);
  await expect(page.locator(".essential-card").first()).toBeVisible();
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

test("private tags are locally searchable and remain outside public URLs", async ({
  page,
}) => {
  await page.locator(".card-top button").first().click();
  await page.locator('a[href="#saved"]').click();
  const tags = page.getByLabel("私人标签（逗号分隔）");
  await tags.fill("PRIVATE_FAMILY_FAVORITE, 周末");
  await tags.blur();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("panfolio-data") || ""),
    )
    .toContain("PRIVATE_FAMILY_FAVORITE");
  await page.reload();
  await expect(tags).toHaveValue("PRIVATE_FAMILY_FAVORITE, 周末");
  await page
    .getByRole("searchbox", { name: "搜索我的厨房" })
    .fill("PRIVATE_FAMILY_FAVORITE");
  await expect(page.locator(".my-kitchen .card")).toHaveCount(1);
  expect(page.url()).not.toContain("PRIVATE");
  await page.locator(".my-kitchen .card > button").click();
  await page.getByRole("button", { name: "分享应用", exact: true }).click();
  await expect(page.getByLabel("应用首页链接")).not.toHaveValue(/PRIVATE|周末/);
});
