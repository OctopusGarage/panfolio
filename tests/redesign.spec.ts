import { test, expect } from "@playwright/test";
test("recipe reading has clear ingredients and steps without duplicate titles", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await expect(page.locator(".card-image").first()).toBeVisible();
  await page.screenshot({ path: `/tmp/panfolio-home-${browserName}.png` });
  await page.locator(".card h3 a").first().click();
  await expect(page.locator(".ingredients-panel .section-title")).toHaveText(
    "食材",
  );
  await expect(page.locator(".method-panel .section-title")).toHaveText("做法");
  await expect(page.locator(".method-panel h4")).toHaveCount(5);
  await expect(page.locator(".recipe-body h1")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: `/tmp/panfolio-detail-${browserName}.png` });
});

test("all recipe illustrations have uniform natural size and display ratio", async ({
  page,
}) => {
  await page.goto("/");
  const dimensions = await page.evaluate(async () => {
    const urls = Array.from(
      document.querySelectorAll<HTMLImageElement>(".card-image img"),
    ).map((image) => image.src.replace(/\.(480|768|1200)\.jpg$/, ".jpg"));
    return Promise.all(
      urls.map(
        (src) =>
          new Promise<{ width: number; height: number }>((resolve, reject) => {
            const image = new Image();
            image.onload = () =>
              resolve({
                width: image.naturalWidth,
                height: image.naturalHeight,
              });
            image.onerror = () =>
              reject(new Error("Recipe image failed to load"));
            image.src = src;
          }),
      ),
    );
  });
  expect(dimensions.length).toBeGreaterThan(0);
  for (const size of dimensions)
    expect(size).toEqual({ width: 1536, height: 1024 });
  const card = await page.locator(".card-image").first().boundingBox();
  expect(card!.width / card!.height).toBeCloseTo(1.5, 1);
  await page.locator(".card h3 a").first().click();
  const cover = await page.locator(".recipe-cover").boundingBox();
  expect(cover!.width / cover!.height).toBeCloseTo(1.5, 1);
});
