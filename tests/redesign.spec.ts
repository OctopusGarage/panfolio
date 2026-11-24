import { test, expect } from "@playwright/test";
test("recipe reading has clear ingredients and steps without duplicate titles", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await expect(page.locator(".card-image").first()).toBeVisible();
  await page.screenshot({ path: `/tmp/panfolio-home-${browserName}.png` });
  await page.locator(".card h3 a").first().click();
  await expect(page.locator(".ingredients-panel .section-title")).toHaveText(
    "食材",
  );
  await expect(page.locator(".method-panel .section-title")).toHaveText("做法");
  await expect(page.locator(".method-panel h4")).toHaveCount(5);
  await expect(page.locator(".recipe-body h1")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: `/tmp/panfolio-detail-${browserName}.png` });
});
