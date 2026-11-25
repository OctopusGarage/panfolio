import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const source = "distribution/branding/panfolio-mcp/icon-source.png";
await mkdir("public/branding", { recursive: true });
for (const size of [512, 128]) {
  const target =
    size === 512
      ? "public/branding/panfolio-mcp-icon.png"
      : `public/branding/panfolio-mcp-icon-${size}.png`;
  await sharp(source)
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(target);
  console.log(`Exported ${target} (${size}×${size}).`);
}

const digest = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");
const exports: Record<string, string> = {};
for (const path of [
  "public/branding/panfolio-mcp-icon.png",
  "public/branding/panfolio-mcp-icon-128.png",
])
  exports[path] = digest(await readFile(path));
await writeFile(
  "distribution/branding/panfolio-mcp/exports.json",
  JSON.stringify(
    { sourceSha256: digest(await readFile(source)), exports },
    null,
    2,
  ) + "\n",
);
