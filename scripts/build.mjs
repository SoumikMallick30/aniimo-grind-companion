import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await mkdir("dist/data", { recursive: true });
await cp("src/site", "dist", { recursive: true });
await cp("src/data/game-data.json", "dist/data/game-data.json");
await cp("src/assets", "dist/assets", { recursive: true });
console.log("Built dist/");

