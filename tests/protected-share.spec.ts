import { expect, test } from "@playwright/test";

test("recipe sharing generates an opaque link on click", async ({ page }) => {
  await page.goto("/#02.ajian-ban-dan-chao-fan");
  await page.getByRole("button", { name: "分享菜谱链接", exact: true }).click();
  const field = page.getByRole("textbox", { name: "菜谱链接", exact: true });
  await expect(field).toBeVisible();
  await expect(field).toHaveValue(
    /^https:\/\/octopusgarage\.github\.io\/s\/#[-\w]+$/,
  );
});

const recipeId = "02.ajian-ban-dan-chao-fan";
const shareLink =
  "https://octopusgarage.github.io/s/#AYTfYczYd4YVMCgoiWUzRv5rJvGSrFLt_kHnXN2Y_XCvtQF_82vf6n2IY557BSXfa8_M0NRq56WvBfT20qB1o28";

test("manual paste only opens the recipe after confirmation", async ({
  page,
}) => {
  await page.addInitScript((value) => {
    Object.defineProperty(navigator.clipboard, "readText", {
      value: async () => value,
    });
  }, shareLink);
  await page.goto("/");
  await page.getByRole("button", { name: "粘贴链接", exact: true }).click();
  const paste = page.getByRole("dialog", { name: "粘贴分享链接" });
  await expect(paste.getByRole("textbox")).toHaveCount(0);
  await paste
    .getByRole("button", { name: "从剪贴板读取", exact: true })
    .click();
  const confirmation = page.getByRole("dialog", { name: "打开分享的菜谱？" });
  await expect(confirmation).toContainText("阿见版蛋炒饭");
  expect(new URL(page.url()).hash).toBe("");
  await confirmation
    .getByRole("button", { name: "打开菜谱", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp("#" + recipeId + "$"));
});

test("standalone foreground detection deduplicates dismissed links", async ({
  page,
}) => {
  await page.addInitScript((value) => {
    Object.defineProperty(navigator, "standalone", { value: true });
    Object.defineProperty(navigator.permissions, "query", {
      value: async () => ({ state: "granted" }),
    });
    Object.defineProperty(navigator.clipboard, "readText", {
      value: async () => value,
    });
  }, shareLink);
  await page.goto("/");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  const confirmation = page.getByRole("dialog", { name: "打开分享的菜谱？" });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "取消", exact: true }).click();
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(confirmation).toBeHidden();
  expect(new URL(page.url()).hash).toBe("");
});
