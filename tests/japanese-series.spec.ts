import { test, expect } from "@playwright/test";

test("Japanese chef collection supports discovery, translation and cooking", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "中餐", exact: true }).click();
  await page.getByRole("button", { name: "日厨系列", exact: true }).click();
  await expect(page.locator(".grid .card")).toHaveCount(14);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.locator(".card h3 a").filter({ hasText: "脆皮鸡腿" }).click();
  await expect(page.locator(".recipe-body")).toContainText("74°C");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".recipe-body")).toContainText("20 g");
  expect(await page.locator(".recipe-body").innerText()).not.toMatch(
    /[\u3400-\u9fff]/,
  );
  await page.getByRole("button", { name: "Start cooking →" }).click();
  await expect(page.locator(".cooking")).toContainText("Ingredients");
  await page.goto("/#japanese-chef");
  await expect(page.locator(".grid .card")).toHaveCount(14);
  await expect(page.locator(".discovery-page-heading")).toContainText(
    "Japanese chef series",
  );
});
