import { test, expect } from "@playwright/test";
test("search focuses without losing the input and browser Back leaves search mode", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const input = page.getByRole("searchbox");
  await input.click();
  await expect(page.locator(".app-shell")).toHaveClass(/search-active/);
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((element) => getComputedStyle(element).fontSize),
  ).toBe("16px");
  await input.fill("虾仁");
  await expect(page.locator(".search-results-count")).toContainText("找到");
  await page.goBack();
  await expect(page.locator(".app-shell")).not.toHaveClass(/search-active/);
  await expect(page.locator(".discovery-page-heading")).toBeVisible();
});
test("long pages expose a working floating back-to-top control", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".page-scroll")
    .evaluate((element) => (element.scrollTop = 1200));
  const top = page.getByRole("button", { name: "回到顶部", exact: true });
  await expect(top).toBeVisible();
  await top.click();
  await expect
    .poll(() =>
      page.locator(".page-scroll").evaluate((element) => element.scrollTop),
    )
    .toBeLessThan(10);
  await expect(top).toBeHidden();
});
test("standalone prevents page pinch gestures", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "standalone", {
      configurable: true,
      value: true,
    }),
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-standalone", "true");
  await expect(page.locator("meta[name=viewport]")).toHaveAttribute(
    "content",
    /maximum-scale=1/,
  );
  expect(
    await page.evaluate(() => {
      const event = new Event("gesturestart", { cancelable: true });
      document.dispatchEvent(event);
      return event.defaultPrevented;
    }),
  ).toBe(true);
});

test("ordinary browser tabs retain zoom controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-standalone",
    "true",
  );
  await expect(page.locator("meta[name=viewport]")).not.toHaveAttribute(
    "content",
    /user-scalable=no/,
  );
});
