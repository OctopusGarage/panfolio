import { test, expect } from "@playwright/test";

test("source video loads only on request and tears down on switch, close and navigation", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (/youtube-nocookie\.com|player\.bilibili\.com/.test(request.url()))
      requests.push(request.url());
  });
  await page.route(/youtube-nocookie\.com|player\.bilibili\.com/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Mock provider player</body></html>",
    }),
  );
  await page.goto("/#samukichi-chicken");
  await expect(page.locator(".source-video iframe")).toHaveCount(0);
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "观看视频", exact: true }).click();
  const frame = page.locator(".source-video iframe");
  await expect(frame).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/QG_bnywZR5w/,
  );
  await expect(frame).toHaveAttribute(
    "referrerpolicy",
    "strict-origin-when-cross-origin",
  );
  const rect = await frame.boundingBox();
  expect(rect!.height).toBeGreaterThanOrEqual(200);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "B 站", exact: true }).click();
  await expect(frame).toHaveAttribute("src", /bvid=BV1wUyGzNEV7/);
  await expect(frame).toHaveCount(1);
  await page.getByRole("button", { name: "关闭视频", exact: true }).click();
  await expect(frame).toHaveCount(0);
  await page.getByRole("button", { name: "观看视频", exact: true }).click();
  await page.locator(".recipe-techniques a").first().click();
  await expect(page.locator(".essential-detail")).toBeVisible();
  await expect(frame).toHaveCount(0);
  await page.getByRole("button", { name: "观看视频", exact: true }).click();
  await expect(frame).toHaveCount(1);
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Close video", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close video", exact: true }).click();
  await page.context().setOffline(true);
  await expect(
    page.getByRole("button", { name: "Watch video", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".source-video")).toContainText(
    "Connect to the internet",
  );
  await page.context().setOffline(false);
  await expect(
    page.getByRole("button", { name: "Watch video", exact: true }),
  ).toBeEnabled();
});
