import { test, expect } from "@playwright/test";
test.use({ deviceScaleFactor: 3 });
test("mobile loads small illustrations without precaching desktop originals", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requested: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/recipes/")) requested.push(request.url());
  });
  await page.goto("/");
  const first = page.locator(".card-image img").first();
  await expect
    .poll(() => first.evaluate((img: HTMLImageElement) => img.currentSrc))
    .toMatch(/\.(480|768)\.jpg$/);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  const firstUrl = await first.evaluate(
    (img: HTMLImageElement) => img.currentSrc,
  );
  await expect
    .poll(() =>
      page.evaluate(async (url) => {
        for (const key of await caches.keys()) {
          if (
            key.startsWith("panfolio-scope-") &&
            (await (await caches.open(key)).match(url))
          )
            return true;
        }
        return false;
      }, firstUrl),
    )
    .toBe(true);
  expect(
    requested.some((url) => /\/recipes\/[^/]+(?<!\.(480|768))\.jpg$/.test(url)),
  ).toBe(false);
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const urls: string[] = [];
    for (const key of keys.filter((key) => key.startsWith("panfolio-scope-"))) {
      const cache = await caches.open(key);
      urls.push(...(await cache.keys()).map((request) => request.url));
    }
    return urls.filter((url) => url.includes("/recipes/"));
  });
  expect(cached.length).toBeGreaterThan(0);
  expect(cached.every((url) => /\.(480|768)\.jpg$/.test(url))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect
    .poll(() =>
      first.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
});
test("desktop can select a larger image for a high-density cover", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    locale: "zh-CN",
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator(".card h3 a").first().click();
  await expect(page.locator(".recipe-cover picture source")).toHaveCount(1);
  await expect
    .poll(() =>
      page
        .locator(".recipe-cover img")
        .evaluate((img: HTMLImageElement) => img.currentSrc),
    )
    .toMatch(/\.(768|1200)\.jpg$/);
  await context.close();
});
