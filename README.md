# Aniimo Grind Companion

A production-first optimizer and calculated Homeland layout planner for **Aniimo**.

**Live site:** https://soumikmallick30.github.io/aniimo-grind-companion/

## What it does

- Simple setup from RV level or Advanced per-facility configuration
- Level-up and ranked-priority strategies
- Exact whole-facility production planning in the browser
- Best, Minimum, and custom **My Aniimo** team planning
- Ability level, personality, and job assignments
- Facility-by-facility production instructions
- Crop, seed, profit, opportunity, and goal breakdowns
- Calculated top-down Homeland layout using the player's actual unlocked plot count and one or more unlocked Storage Units
- Environment coverage and optional production simulation
- English-first responsive interface with user-supplied production-zone references

Unknown or not-yet-confirmed game data remains visibly marked. The tool is fan-made and is not affiliated with Aniimo or Kingsglory.

## Architecture

- `src/` — Rust production model and WebAssembly bindings
- `data/` — editable facility and recipe CSV data
- `web/` — static frontend, Web Worker, layout renderer, and HiGHS solver
- `tests/` — Rust and browser-module test suites
- `.github/workflows/deploy-pages.yml` — reproducible WASM build and GitHub Pages deployment

## Test and build

```bash
node --test tests/*.test.mjs
cargo test --locked
wasm-pack build --target web --out-dir web/pkg
```

Serve the `web/` directory over HTTP after building the WebAssembly package.

## License and attribution

The optimizer engine and core game-data model are adapted from [Aniimax](https://github.com/ae-bii/aniimax), Copyright 2026-Present aebii, under the MIT License. The full license text is retained in [`LICENSE`](LICENSE).

The Grind Companion interface, production-reference presentation, and layout usability additions are maintained in this repository.
