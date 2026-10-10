import { readFile, access } from "node:fs/promises";

const data = JSON.parse(await readFile("src/data/game-data.json", "utf8"));
if (data.meta.currentMaxRv !== 20) throw new Error("Expected configured max RV20");
if (data.levels.length !== 20) throw new Error("Expected records for RV1–RV20");
for (let level = 1; level <= 20; level++) {
  if (data.levels[level - 1]?.rvLevel !== level) throw new Error(`Missing RV${level}`);
}
const expectedCaps = [0,8,11,14,17,20,22,24,26,28,30,32,34,36,38,40,42,43,44,45];
if (data.levels.some((item, index) => item.aniimoCap !== expectedCaps[index])) {
  throw new Error("Aniimo capacity ladder is invalid");
}
const rv8 = data.levels.find((item) => item.rvLevel === 8);
const rv20 = data.levels.find((item) => item.rvLevel === 20);
if (!rv8 || rv8.zones.farmland !== 16 || rv8.zones.woodland !== 8 || rv8.zones.mines !== 4) {
  throw new Error("RV8 reference counts are invalid");
}
if (!rv20 || rv20.zones.farmland !== 40 || rv20.zones.woodland !== 20 || rv20.zones.mines !== 10) {
  throw new Error("RV20 community progression counts are invalid");
}
await access("dist/index.html");
await access("dist/assets/rv8-reference.png");
console.log("Checks passed: schema, RV1–20 coverage, worker caps, RV8/RV20 references, build output");

