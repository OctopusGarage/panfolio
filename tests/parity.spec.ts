import { test, expect } from "@playwright/test";
test("bilingual settings, persistent choice and clean sharing link", async ({
  page,
}) => {
  await page.goto("/?private=value");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Check for updates", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Share app", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("App home link")).toHaveValue(
    /^https:\/\/octopusgarage\.github\.io\/s\/#[-\w]+$/,
  );
  await expect(
    page.getByRole("link", { name: "Download share card" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("saved state synchronizes between tabs", async ({ page, context }) => {
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/");
  await page.locator(".card-top button").first().click();
  await expect(other.locator(".card-top button").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
test("English shelves, guides, install help and accessibility", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/");
  await page.getByRole("button", { name: "English", exact: true }).click();
  for (const name of [
    "Recipes",
    "Saved recipes",
    "Kitchen guides",
    "Settings",
  ]) {
    await page.getByRole("link", { name, exact: true }).click();
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Install app", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Add to Home Screen");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Check for updates", exact: true })
    .click();
  await expect(page.locator(".toast")).toContainText("Check complete.");
});
test("offline sharing and export exclude private notes from app links", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.locator(".card h3 a").first().click();
  await page.getByLabel("这次的调整，下次的灵感").fill("PRIVATE_COOKING_NOTE");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Share app", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Download share card" }),
  ).toBeVisible();
  await expect(page.getByLabel("App home link")).not.toHaveValue(
    /PRIVATE|private=value/,
  );
  await page.keyboard.press("Escape");
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "Share app", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Download share card" }),
  ).toBeVisible();
});
test("concurrent windows preserve distinct favorites", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/");
  await Promise.all([
    page.locator(".card-top button").nth(0).click(),
    other.locator(".card-top button").nth(1).click(),
  ]);
  for (const tab of [page, other]) {
    await expect(tab.locator(".card-top button").nth(0)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(tab.locator(".card-top button").nth(1)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
});
test("valid import merges and downloaded backup retains personal notes", async ({
  page,
}) => {
  await page.goto("/");
  const id = await page.locator(".card h3 a").first().getAttribute("href");
  const recipeId = decodeURIComponent(id!.slice(1));
  await page.locator("input[type=file]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        favorites: [recipeId],
        notes: { [recipeId]: "imported note" },
      }),
    ),
  });
  await expect(page.locator(".toast")).toContainText("备份已合并");
  await page.locator(".card h3 a").first().click();
  await expect(page.getByLabel("这次的调整，下次的灵感")).toHaveValue(
    "imported note",
  );
  await page.getByRole("link", { name: "设置", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出收藏与笔记" }).click();
  const downloaded = await download;
  const stream = await downloaded.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const backup = JSON.parse(Buffer.concat(chunks).toString());
  expect(backup.favorites).toContain(recipeId);
  expect(backup.notes[recipeId]).toBe("imported note");
});
test("recipe close restores shelf filters, position and focus", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("Nikujaga");
  const link = page.locator(".card h3 a");
  await link.click();
  await expect(
    page.getByRole("button", { name: "开始做这道菜 →" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("searchbox")).toHaveValue("Nikujaga");
  await expect(link).toBeFocused();
  await page.getByRole("link", { name: "我的收藏", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
});
