# Aniimo Grind Companion

A production-first Homeland layout companion for **Aniimo**, built around the user's RV8 in-game screenshot rather than generic farm imagery.

## MVP scope

- English-only interface
- Dynamic RV selector from RV1 through RV20
- Functional RV1–RV20 selector with community-sourced progression counts
- Decoration-free and decorated layout variants
- Separate farmland, woodland, mines, production, and utilities zones
- Per-RV assigned Aniimo count and available production capacity kept as separate fields
- Dynamic Homeland ability priorities and the full facility personality map
- Production-first scoring and practical zone notes
- Editable JSON game-data schema
- Mobile and desktop layouts

## Data confidence

This project does not invent game mechanics. Every record has a `verification` field:

- `verified`: supported by the supplied in-game screenshot or multiple current references
- `community`: supported by current community references, but not an official Aniimo source
- `unverified`: placeholder awaiting in-game confirmation

The current maximum is set to **RV20** with `community` confidence as of 2026-10-10. Progression counts are community-sourced; facility inventories and exact tile footprints remain `null` until verified in game.

## Run locally

```bash
npm run build
npm run dev
```

Open `http://localhost:4173`.

## Edit game data

Update [`src/data/game-data.json`](src/data/game-data.json). The build copies the file to `dist/data/game-data.json`; the browser loads it at runtime, so adding future verified RV records does not require rewriting the UI.

Required fields for a complete level:

```json
{
  "rvLevel": 8,
  "verification": "community",
  "productionCrew": 18,
  "productionCapacity": 24,
  "workforceTier": "expanded",
  "zones": {
    "farmland": 18,
    "woodland": 9,
    "mines": 4,
    "production": null,
    "utilities": null
  }
}
```

Use `null` whenever a value is unknown. Do not guess.

## Repository structure

```text
dist/                    Deployable static site
src/data/game-data.json  Editable game-data source
scripts/build.mjs        Reproducible static build
scripts/check.mjs        Data and output validation
```

## Source notes

- Visual reference: user-provided RV8 Aniimo build-mode screenshot
- RV1–RV20 progression counts: community references cross-checked on 2026-10-10
- RV8 visual reference and counts: user screenshot plus current progression references
- RV8 production calculation and worker requirements: [Aniimax community optimizer](https://ae-bii.github.io/aniimax/) (community data, checked 2026-10-10)
- Community maximum: RV20, checked 2026-10-10

This is an independent fan-made planning tool and is not affiliated with Aniimo or Kingsglory.

