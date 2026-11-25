import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const recipes: { category: string }[] = JSON.parse(
  readFileSync(new URL("../src/recipes.json", import.meta.url), "utf8"),
);
const metadata = JSON.parse(
  readFileSync(
    new URL("../src/recipe-discovery.json", import.meta.url),
    "utf8",
  ),
) as {
  preparations: { facets: { style?: string[]; occasion?: string[] } }[];
}[];
const count = (category: string) =>
  metadata.filter((record) =>
    record.preparations.some((prep) =>
      prep.facets.style?.includes(`style:${category}`),
    ),
  ).length;

test("three explicit categories filter independently of source collections and survive recipe round trips", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await expect(page.locator(".discovery-presets button")).toHaveText([
    "中餐",
    "日式",
    "甜品",
    "早餐",
  ]);
  await expect(page.locator(".grid .card")).toHaveCount(recipes.length);
  await page.getByRole("button", { name: "中餐", exact: true }).click();
  await expect(page.locator(".grid .card")).toHaveCount(count("chinese"));
  await expect(page.locator(".grid")).not.toContainText("日式土豆炖肉");
  await page.getByRole("button", { name: "中餐", exact: true }).click();
  await page.getByRole("button", { name: "日式", exact: true }).click();
  await expect(page.locator(".grid .card")).toHaveCount(count("japanese"));
  await expect(page.locator(".grid")).toContainText("日式土豆炖肉");
  await page.getByRole("button", { name: "日式", exact: true }).click();
  await page.getByRole("button", { name: "甜品", exact: true }).click();
  await expect(page.locator(".grid .card")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "甜品", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".grid .card").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `/tmp/panfolio-dessert-shelf-${browserName}.png`,
    animations: "disabled",
  });
  await page.locator(".card h3 a").click();
  await expect(page.locator(".detail-title .eyebrow")).toHaveText("甜品");
  await expect(page.locator(".recipe-body")).toContainText("30、60、90");
  await expect
    .poll(() =>
      page
        .locator(".recipe-cover img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.screenshot({
    path: `/tmp/panfolio-sago-detail-${browserName}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "返回菜谱", exact: false }).click();
  await expect(
    page.getByRole("button", { name: "甜品", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".grid .card")).toHaveCount(1);
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".discovery-presets button")).toHaveText([
    "Chinese",
    "Japanese",
    "Desserts",
    "Breakfast",
  ]);
  await page.getByRole("link", { name: "Explore the chef series" }).click();
  await expect(page.locator(".grid .card")).toHaveCount(13);
});

test("coconut sago supports translated cooking, source video and correctly attributed kitchen references", async ({
  page,
}) => {
  await page.route(/youtube-nocookie\.com/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html>Provider stub</html>",
    }),
  );
  await page.goto("/#ali-coconut-sago");
  await page.getByRole("button", { name: "观看视频", exact: true }).click();
  await expect(page.locator(".source-video iframe")).toHaveAttribute(
    "src",
    /embed\/rY3lcAk2Ne8/,
  );
  await page.getByRole("button", { name: "English", exact: true }).click();
  expect(await page.locator(".recipe-body").innerText()).not.toMatch(
    /[\u3400-\u9fff]/,
  );
  await page.getByRole("button", { name: "Start cooking →" }).click();
  await expect(page.locator(".cooking")).toContainText("Ingredients");
  await page.goto("/#essentials/store-cooked-sago");
  await expect(page.locator(".essential-detail")).toContainText("3 days");
  await expect(page.locator(".essential-detail")).not.toContainText(
    "SAMUKICHI",
  );
  await page.locator(".essential-related a").click();
  await expect(page.locator(".recipe-body")).toContainText("Coconut");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
