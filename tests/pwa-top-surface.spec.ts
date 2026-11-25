import { test, expect } from "@playwright/test";

test("top-edge compatibility surface survives navigation without covering browser controls", async ({
  page,
}) => {
  await page.goto("/");
  const surface = page.locator("body > .pwa-status-bar-surface");
  await expect(surface).toHaveCount(1);
  await expect(surface).toHaveAttribute("aria-hidden", "true");
  await expect(surface).toBeEmpty();
  // Ordinary browser tabs must not activate the standalone workaround.
  await expect(surface).toBeHidden();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("#content-heading")).toHaveText("Recipes");
  await page.getByRole("link", { name: "My kitchen", exact: true }).click();
  await page.getByRole("link", { name: "Preferences", exact: true }).click();
  await expect(surface).toHaveCount(1);
  await expect(surface).toBeHidden();
});
