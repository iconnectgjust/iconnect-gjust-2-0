// Resolves image filenames from data/*.json to bundled asset URLs.
// Lets content live in JSON (CMS-editable) while Vite still fingerprints images.
const modules = import.meta.glob("./assets/*", { eager: true, import: "default" });

const byName = {};
for (const path in modules) {
  byName[path.split("/").pop()] = modules[path];
}

export function assetUrl(filename) {
  return byName[filename] || "";
}
