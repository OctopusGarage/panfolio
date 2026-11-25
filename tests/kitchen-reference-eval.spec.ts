import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const references: {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  steps: string[];
  stepsEn: string[];
  boundary: string;
  boundaryEn: string;
  recipeIds: string[];
}[] = JSON.parse(
  readFileSync(
    new URL("../src/kitchen-essentials.json", import.meta.url),
    "utf8",
  ),
);

for (const language of ["zh", "en"] as const) {
  for (let start = 0; start < references.length; start += 11) {
    test(`all kitchen references explain operations and limits: ${language} ${start + 1}-${Math.min(start + 11, references.length)}`, async ({
      page,
    }) => {
      await page.addInitScript(
        (locale) => localStorage.setItem("panfolio:locale", locale),
        language,
      );
      for (const entry of references.slice(start, start + 11)) {
        await page.goto(`/#essentials/${entry.id}`);
        const detail = page.locator(".essential-detail");
        await expect(detail.locator(":scope > h2")).toHaveText(
          language === "zh" ? entry.title : entry.titleEn,
        );
        await expect(detail.locator(".essential-lead")).toHaveText(
          language === "zh" ? entry.summary : entry.summaryEn,
        );
        await expect(detail.locator(".essential-sections section")).toHaveCount(
          5,
        );
        await expect(
          detail.locator(".essential-sections section").nth(1).locator("li"),
        ).toHaveText(language === "zh" ? entry.steps : entry.stepsEn);
        await expect(
          detail.locator(".essential-sections section").last(),
        ).toContainText(language === "zh" ? entry.boundary : entry.boundaryEn);
        if (entry.recipeIds.length)
          await expect(detail.locator(".essential-related h3")).toHaveText(
            language === "zh" ? "相关菜谱" : "Related recipes",
          );
        if (language === "en")
          expect(await detail.innerText()).not.toMatch(/[\u3400-\u9fff]/);
        await expect(detail.locator("iframe")).toHaveCount(0);
        expect(
          await detail.evaluate((node) => {
            const text = node.querySelector(".essential-sections")!;
            const video = node.querySelector(".source-video");
            return (
              !video ||
              !!(
                text.compareDocumentPosition(video) &
                Node.DOCUMENT_POSITION_FOLLOWING
              )
            );
          }),
        ).toBe(true);
      }
    });
  }
}

test("reference cards give a concrete starting point without category or tag controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#essentials");
  await expect(page.locator(".essential-card")).toHaveCount(references.length);
  await expect(page.locator(".essential-card-preview")).toHaveCount(
    references.length,
  );
  await expect(page.locator(".essential-read")).toHaveCount(references.length);
  await expect(
    page.locator(
      ".filters, .discovery-sidebar, .discovery-mobile-filter, .discovery-card-tags",
    ),
  ).toHaveCount(0);
  await page.locator(".essential-read").first().click();
  await expect(page.locator(".essential-sections")).toBeVisible();
});

test("soy sauce reference clearly marks the salmon comparison", async ({
  page,
}) => {
  await page.goto("/#essentials/soy-sauce-pan");
  await expect(page.locator(".essential-related h3")).toHaveText("相关菜谱");
  await expect(page.locator(".essential-related")).toContainText(
    "三文鱼用于对照",
  );
  await expect(page.locator(".essential-related")).toContainText(
    "不采用热锅边增香",
  );
});
