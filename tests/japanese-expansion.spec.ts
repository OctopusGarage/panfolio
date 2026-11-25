import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const videos: { recipeId: string; videos: { id: string }[] }[] = JSON.parse(
  readFileSync(new URL("../src/recipe-videos.json", import.meta.url), "utf8"),
);

const additions = [
  "mushrooms",
  "cauliflower",
  "yakisoba",
  "garlic-shrimp",
  "caramelized-onions",
  "tuna",
  "chicken-breast",
  "steak",
  "fried-rice",
].map((slug) => `samukichi-${slug}`);
test("all nine additions expose covers, translated methods, techniques and both video providers", async ({
  page,
}) => {
  await page.route(/youtube-nocookie\.com|player\.bilibili\.com/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html>Provider stub</html>",
    }),
  );
  expect(additions).toHaveLength(9);
  for (const id of additions) {
    await page.goto(`/#${id}`);
    const cover = page.locator(".recipe-cover img");
    await expect(cover).toBeVisible();
    await expect
      .poll(() =>
        cover.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(page.locator(".recipe-techniques a").first()).toBeVisible();
    await expect(page.locator(".recipe-body")).toContainText("小贴士");
    await page.getByRole("button", { name: "观看视频", exact: true }).click();
    const metadata = videos.find((entry) => entry.recipeId === id)!;
    await expect(page.locator(".source-video iframe")).toHaveAttribute(
      "src",
      new RegExp(metadata.videos[0].id),
    );
    await page.getByRole("button", { name: "B 站", exact: true }).click();
    await expect(page.locator(".source-video iframe")).toHaveAttribute(
      "src",
      new RegExp(metadata.videos[1].id),
    );
    await page.getByRole("button", { name: "English", exact: true }).click();
    expect(await page.locator(".recipe-body").innerText()).not.toMatch(
      /[\u3400-\u9fff]/,
    );
    await page.getByRole("button", { name: "中文", exact: true }).click();
  }
  await page.goto("/#essentials");
  await page.getByRole("button", { name: "保存与备餐", exact: true }).click();
  await expect(page.locator(".essential-card")).toHaveCount(1);
  await page.locator(".essential-card a").first().click();
  await expect(page.locator(".essential-detail")).toContainText("3～4");
});
