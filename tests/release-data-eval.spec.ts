import { test, expect } from "@playwright/test";

test("kitchen backup round trip includes new metadata and legacy imports preserve it", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  const id = (await page
    .locator(".card h3 a")
    .first()
    .getAttribute("href"))!.slice(1);
  await page.locator(".card h3 a").first().click();
  await page.getByLabel("这次的调整，下次的灵感").fill("keep my existing note");
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("panfolio-data") || ""),
    )
    .toContain("keep my existing note");
  const kitchen = {
    tried: [id],
    repeat: [id],
    tags: { [id]: ["PRIVATE_BACKUP_TAG"] },
    searches: [
      {
        id: "backup-search",
        name: "Chef search",
        collection: "japanese-chef",
        state: {
          query: "鸡",
          selected: {},
          ingredientMode: "any",
          scope: "recipes",
        },
      },
    ],
  };
  await page.locator("input[type=file]").setInputFiles({
    name: "kitchen.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        favorites: [id],
        notes: { [id]: "incoming note" },
        kitchen,
      }),
    ),
  });
  await expect(page.locator(".toast")).toContainText("备份已合并");
  await page.locator("input[type=file]").setInputFiles({
    name: "legacy.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ version: 1, favorites: [], notes: {} }),
    ),
  });
  await expect(page.locator(".toast")).toContainText("备份已合并");
  await page.goto("/#settings");
  const downloading = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "导出收藏与笔记", exact: true })
    .click();
  const stream = await (await downloading).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.notes[id]).toBe("keep my existing note");
  expect(exported.kitchen).toEqual(kitchen);
  const clean = await browser.newContext({ locale: "zh-CN" });
  try {
    const restored = await clean.newPage();
    await restored.goto("/#settings");
    await restored.locator("input[type=file]").setInputFiles({
      name: "restore.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(exported)),
    });
    await expect(restored.locator(".toast")).toContainText("备份已合并");
    const saved = await restored.evaluate(() =>
      JSON.parse(localStorage.getItem("panfolio-data") || "{}"),
    );
    expect(saved).toEqual(exported);
    await restored.locator("input[type=file]").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          ...exported,
          kitchen: { ...kitchen, tried: ["unknown-recipe"] },
        }),
      ),
    });
    await expect(restored.locator(".toast")).toContainText("无法导入");
    expect(
      await restored.evaluate(() =>
        JSON.parse(localStorage.getItem("panfolio-data") || "{}"),
      ),
    ).toEqual(exported);
  } finally {
    await clean.close();
  }
});

test("concurrent tabs preserve distinct cooking status edits", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const href = (await page.locator(".card h3 a").first().getAttribute("href"))!;
  await page.locator(".card h3 a").first().click();
  const other = await context.newPage();
  await other.goto(`/${href}`);
  await expect(
    other.getByRole("button", { name: "加入常做", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await Promise.all([
    page.getByRole("button", { name: "做过这道菜", exact: true }).click(),
    other.getByRole("button", { name: "加入常做", exact: true }).click(),
  ]);
  for (const tab of [page, other]) {
    await expect(
      tab.getByRole("button", { name: "做过这道菜", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      tab.getByRole("button", { name: "加入常做", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
});

test("kitchen storage failure reports recoverable unsaved state", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      configurable: true,
      value: undefined,
    });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "panfolio-data")
        throw new DOMException("Storage full", "QuotaExceededError");
      return original.call(this, key, value);
    };
  });
  await page.goto("/");
  await page.locator(".card h3 a").first().click();
  await page.getByRole("button", { name: "做过这道菜", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("保存未完成");
  await expect(
    page.getByRole("button", { name: "做过这道菜", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
