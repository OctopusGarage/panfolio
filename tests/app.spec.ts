import { test, expect } from "@playwright/test";
test("search, favorites, notes, cooking and offline navigation", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "菜谱一览" })).toBeVisible();
  await page.getByRole("searchbox").fill("Nikujaga");
  await expect(page.locator(".card")).toHaveCount(1);
  await page.locator(".card-top button").click();
  await page.locator(".card h3 a").click();
  await page.getByLabel("这次的调整，下次的灵感").fill("下次少放盐");
  await page.reload();
  await expect(page.getByLabel("这次的调整，下次的灵感")).toHaveValue(
    "下次少放盐",
  );
  await page.getByRole("button", { name: "开始做这道菜 →" }).click();
  await expect(page.locator(".cooking")).toBeVisible();
  await page.getByRole("button", { name: "下一段 →" }).click();
  await expect(page.locator(".cooking .eyebrow")).toContainText("2 /");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    await new Promise<void>((resolve) => {
      if (navigator.serviceWorker.controller) resolve();
      else
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        );
    });
  });
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "我的厨房笔记" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "我的收藏", exact: true }).click();
  await expect(page.locator(".card")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("invalid backup does not overwrite notes", async ({ page }) => {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1,"favorites":[2],"notes":{}}'),
  });
  await expect(page.getByRole("status")).toContainText("无法导入");
});
