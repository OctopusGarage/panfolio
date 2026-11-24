import { test, expect } from "@playwright/test";
import sharp from "sharp";
import jsQR from "jsqr";
test.use({ serviceWorkers: "block" });
for (const language of ["zh", "en"] as const) {
  test(`QR invitation includes the app icon and remains decodable (${language})`, async ({
    page,
  }) => {
    await page.route(
      "https://octopusgarage.github.io/panfolio/**",
      async (route) => {
        const path = new URL(route.request().url()).pathname.replace(
          /^\/panfolio\//,
          "",
        );
        await route.fulfill({
          response: await route.fetch({ url: "http://127.0.0.1:4173/" + path }),
        });
      },
    );
    await page.goto("https://octopusgarage.github.io/panfolio/");
    if (language === "en")
      await page.getByRole("button", { name: "English", exact: true }).click();
    await page
      .getByRole("button", {
        name: language === "en" ? "Share app" : "分享应用",
        exact: true,
      })
      .click();
    const preview = page.locator(".app-share-preview");
    await expect(preview).toBeVisible();
    const bytes = await preview.evaluate(async (img: HTMLImageElement) =>
      Array.from(new Uint8Array(await (await fetch(img.src)).arrayBuffer())),
    );
    const { data, info } = await sharp(Buffer.from(bytes))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    expect(code?.data).toBe("https://octopusgarage.github.io/panfolio/");
    const reduced = await sharp(Buffer.from(bytes))
      .resize({ width: 360 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(
      jsQR(
        new Uint8ClampedArray(reduced.data),
        reduced.info.width,
        reduced.info.height,
      )?.data,
    ).toBe("https://octopusgarage.github.io/panfolio/");
    const points = code!.location;
    const centerX = (points.topLeftCorner.x + points.bottomRightCorner.x) / 2;
    const centerY = (points.topLeftCorner.y + points.bottomRightCorner.y) / 2;
    // The icon's sage pan/body colors must be embedded, not just black QR modules.
    let colored = 0;
    for (let y = Math.round(centerY) - 25; y < Math.round(centerY) + 25; y++)
      for (
        let x = Math.round(centerX) - 25;
        x < Math.round(centerX) + 25;
        x++
      ) {
        const i = (y * info.width + x) * 4;
        if (
          Math.max(data[i], data[i + 1], data[i + 2]) -
            Math.min(data[i], data[i + 1], data[i + 2]) >
          12
        )
          colored++;
      }
    expect(colored).toBeGreaterThan(300);
  });
}
