import { test, expect } from "@playwright/test";
async function protect(
  page: import("@playwright/test").Page,
  top: number,
  left: number,
  right: number,
) {
  await page.evaluate(
    ({ top, left, right }) => {
      const style = document.documentElement.style;
      style.setProperty("--safe-area-top", top + "px");
      style.setProperty("--safe-area-left", left + "px");
      style.setProperty("--safe-area-right", right + "px");
    },
    { top, left, right },
  );
}
async function headingBounds(page: import("@playwright/test").Page) {
  return page.locator("#content-heading").evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const text = range.getBoundingClientRect(),
      header = element.closest("header")!.getBoundingClientRect();
    return {
      top: text.top,
      left: text.left,
      right: text.right,
      bottom: text.bottom,
      headerTop: header.top,
      headerBottom: header.bottom,
      width: innerWidth,
    };
  });
}
test("top-left header text clears portrait safe area in browse and search", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await protect(page, 59, 0, 0);
  let bounds = await headingBounds(page);
  expect(bounds.top).toBeGreaterThanOrEqual(59);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.headerBottom);
  await page.getByRole("searchbox").focus();
  bounds = await headingBounds(page);
  expect(bounds.top).toBeGreaterThanOrEqual(59);
  await page.getByRole("button", { name: "取消", exact: true }).click();
  await expect
    .poll(async () => (await headingBounds(page)).top)
    .toBeGreaterThanOrEqual(59);
});
test("landscape sidebar and header actions clear asymmetric safe areas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  await protect(page, 0, 47, 32);
  const brand = await page.locator(".brand").boundingBox();
  expect(brand!.x).toBeGreaterThanOrEqual(47);
  const language = await page
    .getByRole("button", { name: "English", exact: true })
    .boundingBox();
  expect(language!.x + language!.width).toBeLessThanOrEqual(844 - 32);
});
test("long title wraps inside the safe header without overlapping actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await protect(page, 44, 0, 0);
  await page.locator(".card h3 a").first().click();
  await page.locator("#content-heading").evaluate((element) => {
    element.textContent = "一道名字比较长的家常菜和清晰完整的烹饪步骤";
    (element as HTMLElement).style.fontSize = "24px";
  });
  const bounds = await headingBounds(page);
  expect(bounds.top).toBeGreaterThanOrEqual(44);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.headerBottom);
  const share = await page
    .getByRole("button", { name: "分享应用", exact: true })
    .boundingBox();
  expect(bounds.right).toBeLessThanOrEqual(share!.x);
});
