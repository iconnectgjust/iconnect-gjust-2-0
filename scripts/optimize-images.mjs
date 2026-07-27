// One-off image optimizer: recompresses src/assets images in place.
// Keeps filenames and formats so no imports change. Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, stat, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ASSETS_DIR = fileURLToPath(new URL("../src/assets", import.meta.url));
const MAX_WIDTH = 1600;

const files = (await readdir(ASSETS_DIR)).filter(f => /\.(png|jpe?g)$/i.test(f));
let before = 0, after = 0;

for (const file of files) {
  const full = path.join(ASSETS_DIR, file);
  const orig = (await stat(full)).size;
  before += orig;

  const isPng = /\.png$/i.test(file);
  const tmp = full + ".tmp";
  try {
    let img = sharp(full).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
    img = isPng
      ? img.png({ compressionLevel: 9, palette: true, quality: 90 })
      : img.jpeg({ quality: 78, mozjpeg: true });
    await img.toFile(tmp);

    const optimized = (await stat(tmp)).size;
    if (optimized < orig) {
      await rename(tmp, full);
      after += optimized;
      console.log(`${file}: ${(orig / 1024).toFixed(0)}KB -> ${(optimized / 1024).toFixed(0)}KB`);
    } else {
      const { unlink } = await import("node:fs/promises");
      await unlink(tmp);
      after += orig;
      console.log(`${file}: kept original (${(orig / 1024).toFixed(0)}KB)`);
    }
  } catch (err) {
    after += orig;
    console.error(`${file}: FAILED — ${err.message}`);
  }
}

console.log(`\nTotal: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
