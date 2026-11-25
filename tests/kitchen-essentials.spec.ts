import { test, expect } from "@playwright/test";

test("kitchen essentials supports lookup, translation and recipe round trips", async ({
  page,
  browserName,
}) => {
  await page.goto("/#essentials");
  await expect(page.locator(".essential-card")).toHaveCount(12);
  await page.getByRole("searchbox", { name: "搜索厨房基础" }).fill("酱油");
  await page
    .getByRole("link", { name: "酱油接触热锅面增香", exact: true })
    .click();
  await expect(page.locator(".essential-detail")).toContainText(
    "并非所有酱油调味",
  );
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".essential-detail > h2")).toHaveText(
    "Soy sauce aroma from a hot pan",
  );
  expect(await page.locator(".essential-detail").innerText()).not.toMatch(
    /[\u3400-\u9fff]/,
  );
  await page.locator(".essential-related a").first().click();
  await expect(page.locator(".recipe-body")).toBeVisible();
  await page
    .locator(".recipe-techniques a")
    .filter({ hasText: "Soy sauce" })
    .click();
  await expect(page.locator(".essential-detail")).toBeVisible();
  await page.goto("/#essentials");
  await page.getByRole("searchbox").fill("");
  await page
    .getByRole("button", { name: "Ingredient preparation", exact: true })
    .click();
  await expect(page.locator(".essential-card")).toHaveCount(5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `/tmp/panfolio-essentials-${browserName}.png`,
  });
  await page.getByRole("searchbox").fill("zzzzzz");
  await expect(page.getByRole("status")).toContainText("No matching");
});
