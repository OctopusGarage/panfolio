import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const essentials: { category: string }[] = JSON.parse(
  readFileSync(
    new URL("../src/kitchen-essentials.json", import.meta.url),
    "utf8",
  ),
);

test("kitchen essentials supports lookup, translation and recipe round trips", async ({
  page,
  browserName,
}) => {
  await page.goto("/#essentials");
  await expect(page.locator(".essential-card")).toHaveCount(essentials.length);
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
  const mobile = (page.viewportSize()?.width || 0) <= 760;
  if (mobile)
    await page.getByRole("button", { name: "Filters", exact: true }).click();
  await (mobile ? page.getByRole("dialog") : page.locator(".discovery-sidebar"))
    .getByRole("checkbox", { name: /^Prep / })
    .check();
  if (mobile) await page.getByRole("button", { name: /^Show results/ }).click();
  await expect(page.locator(".essential-card")).toHaveCount(
    essentials.filter((entry) => entry.category === "prep").length,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `/tmp/panfolio-essentials-${browserName}.png`,
  });
  await page.getByRole("searchbox").fill("zzzzzz");
  await expect(
    page.getByText(
      "No results match. Remove a filter or clear all to try again.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("all kitchen cards fill aligned grid tracks without inherited article margins", async ({
  page,
}) => {
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#essentials");
    for (const locale of ["zh", "en"]) {
      if (locale === "en")
        await page
          .getByRole("button", { name: "English", exact: true })
          .click();
      const boxes = await page.locator(".essential-card").evaluateAll((cards) =>
        cards.map((card) => {
          const rect = card.getBoundingClientRect();
          const css = getComputedStyle(card);
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            align: css.textAlign,
            bottom: rect.bottom,
            margin: css.margin,
          };
        }),
      );
      const grid = await page.locator(".essential-grid").boundingBox();
      const columns = width > 760 ? 2 : 1;
      for (let i = 0; i < boxes.length; i++) {
        expect(boxes[i].margin).toBe("0px");
        expect(Math.abs(boxes[i].height - boxes[0].height)).toBeLessThan(1);
        expect(boxes[i].align).toBe("left");
        expect(Math.abs(boxes[i].width - boxes[0].width)).toBeLessThan(1);
        expect(Math.abs(boxes[i].x - boxes[i % columns].x)).toBeLessThan(1);
        if (i >= columns)
          expect(boxes[i].y - boxes[i - columns].bottom).toBeLessThanOrEqual(
            19,
          );
      }
      expect(Math.abs(boxes[0].x - grid!.x)).toBeLessThan(1);
      if (locale === "en")
        await page.getByRole("button", { name: "中文", exact: true }).click();
    }
  }
});
