import { test, expect } from "@playwright/test";
test("English switches recipe ingredients, methods, tips and cooking reader", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.locator(".card h3 a").first().click();
  await expect(page.locator(".ingredients-panel .section-title")).toHaveText(
    "Ingredients",
  );
  await expect(page.locator(".method-panel .section-title")).toHaveText(
    "Method",
  );
  await expect(page.locator(".recipe-body")).toContainText("25 minutes");
  expect(await page.locator(".recipe-body").innerText()).not.toMatch(
    /[\u3400-\u9fff]/,
  );
  await page.getByRole("button", { name: "Start cooking →" }).click();
  await expect(page.locator(".cooking")).toContainText("Ingredients");
  await page.getByRole("button", { name: "Next section →" }).click();
  await expect(page.locator(".cooking")).toContainText("Brown the onion");
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await expect(page.locator(".cooking")).toContainText("炒香洋葱");
});
test("English instant-noodle collection preserves all preparations", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("searchbox").fill("instant");
  await page.locator(".card h3 a").click();
  await expect(page.locator(".method-panel h4")).toHaveCount(10);
  await expect(page.locator(".method-panel")).toContainText(
    "1 minute 30 seconds",
  );
});
