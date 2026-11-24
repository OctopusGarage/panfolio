import { test, expect } from "@playwright/test";
test("a failed application script shows a working recovery screen instead of white", async ({
  page,
}) => {
  await page.route("**/assets/*.js", (route) => route.abort("failed"));
  await page.goto("/");
  await expect(page.locator("#boot-fallback")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "重新加载", exact: true }),
  ).toBeVisible();
  await page.unroute("**/assets/*.js");
  await page.getByRole("button", { name: "重新加载", exact: true }).click();
  await expect(page.locator(".card")).toHaveCount(20);
  await expect(page.locator("#boot-fallback")).toBeHidden();
});

test("standalone recovery preserves favorites and unrelated site caches", async ({
  page,
}) => {
  await page.goto("/recover.html");
  await page.evaluate(async () => {
    localStorage.setItem(
      "panfolio-data",
      JSON.stringify({
        version: 1,
        favorites: ["01.-ri-shi-ma-ling-shu-dun-rou"],
        notes: {},
      }),
    );
    await caches.open("unrelated-project");
    // The pre-scope cache has ambiguous ownership and must survive migration.
    await caches.open("panfolio-obsolete");
    await caches.open(
      "panfolio-scope-" +
        encodeURIComponent(new URL("./", location.href).href) +
        "-obsolete",
    );
    await caches.open(
      "panfolio-scope-" +
        encodeURIComponent(new URL("./other/", location.href).href) +
        "-obsolete",
    );
  });
  await page.getByRole("button", { name: "重新打开", exact: true }).click();
  await expect(page.locator(".card")).toHaveCount(20);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("panfolio-data") || "{}").favorites,
    ),
  ).toContain("01.-ri-shi-ma-ling-shu-dun-rou");
  expect(await page.evaluate(() => caches.has("unrelated-project"))).toBe(true);
  expect(await page.evaluate(() => caches.has("panfolio-obsolete"))).toBe(true);
  expect(
    await page.evaluate(() =>
      caches.has(
        "panfolio-scope-" +
          encodeURIComponent(new URL("./", location.href).href) +
          "-obsolete",
      ),
    ),
  ).toBe(false);
  expect(
    await page.evaluate(() =>
      caches.has(
        "panfolio-scope-" +
          encodeURIComponent(new URL("./other/", location.href).href) +
          "-obsolete",
      ),
    ),
  ).toBe(true);
});
