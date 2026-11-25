import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
const directory = "public/recipes";
const widths = [480, 768, 1200];
const originals = (await readdir(directory)).filter(
  (name) => name.endsWith(".jpg") && !/\.(480|768|1200)\.jpg$/.test(name),
);
for (const name of originals) {
  for (const width of widths) {
    await sharp(join(directory, name))
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 76, progressive: true })
      .toFile(join(directory, name.replace(/\.jpg$/, `.${width}.jpg`)));
  }
}
console.log(
  `Prepared responsive sizes for ${originals.length} recipe illustrations.`,
);
