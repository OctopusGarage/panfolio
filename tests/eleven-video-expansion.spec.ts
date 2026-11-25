import { test, expect } from "@playwright/test";

const recipes = [
  ["awei-one-pot-rice", "vq3_Clzyg2E"],
  ["rosalina-tomato-beef", "QttPBfho4_Q"],
  ["magic-lamb-pilaf", "2VRRTq7FhEA"],
  ["ali-scallion-meat-pancakes", "Qz9Z0L8hHE4"],
  ["ali-sauced-noodles", "Plhq-Asxfg4"],
  ["liuyi-stir-fried-noodles", "gN1QkOQuT7E"],
  ["feng-night-market-vermicelli", "Dv160Sma57w"],
  ["ting-soy-sauce-noodles", "kOI8NGf8K6c"],
  ["remus-shrimp-eggs", "MzPWOE45YcQ"],
  ["ajian-scallion-pork-chops", "0hDfXBQhiZg"],
];

test("all ten dish entries load full illustrations, bilingual methods and the correct original video", async ({
  page,
  browserName,
}) => {
  await page.route(/youtube-nocookie\.com/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html>Provider stub</html>",
    }),
  );
  for (const [id, video] of recipes) {
    await page.goto(`/#${id}`);
    await expect(page.locator(".detail-title .eyebrow")).toHaveText("中餐");
    await expect(page.locator(".recipe-body")).toContainText("小贴士");
    await expect
      .poll(() =>
        page
          .locator(".recipe-cover img")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await page.getByRole("button", { name: "观看视频", exact: true }).click();
    await expect(page.locator(".source-video iframe")).toHaveAttribute(
      "src",
      new RegExp(`/embed/${video}`),
    );
    await page.getByRole("button", { name: "English", exact: true }).click();
    expect(await page.locator(".recipe-body").innerText()).not.toMatch(
      /[\u3400-\u9fff]/,
    );
    await page.getByRole("button", { name: "中文", exact: true }).click();
  }
  await page.goto("/#awei-one-pot-rice");
  await expect(page.locator(".method-panel h4")).toHaveCount(6);
  await page.goto("/#ali-scallion-meat-pancakes");
  await page.locator(".recipe-body").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `/tmp/panfolio-pancakes-${browserName}.png`,
    animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("vegetable techniques play their own source and show applicable related recipes", async ({
  page,
}) => {
  await page.route(/youtube-nocookie\.com/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html>Provider stub</html>",
    }),
  );
  for (const [id, video] of [
    ["onion-along-fibers", "W5GM33NabB0"],
    ["carrot-fine-julienne", "W5GM33NabB0"],
    ["peppers-fine-slices", "W5GM33NabB0"],
    ["potato-julienne", "EhyQom5jiTE"],
  ]) {
    await page.goto(`/#essentials/${id}`);
    await expect(page.locator(".essential-detail")).toBeVisible();
    if (id === "potato-julienne") {
      await expect(page.locator(".essential-related")).toContainText(
        "家常鸡蛋薄饼卷",
      );
    } else {
      await expect(page.locator(".essential-related")).toHaveCount(0);
    }
    await expect(
      page.locator(
        `.essential-detail a[href='https://www.youtube.com/watch?v=${video}']`,
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "观看视频", exact: true }).click();
    await expect(page.locator(".source-video iframe")).toHaveAttribute(
      "src",
      new RegExp(`/embed/${video}`),
    );
    await page.getByRole("button", { name: "English", exact: true }).click();
    expect(await page.locator(".essential-detail").innerText()).not.toMatch(
      /[\u3400-\u9fff]/,
    );
    await page.getByRole("button", { name: "中文", exact: true }).click();
  }
});
