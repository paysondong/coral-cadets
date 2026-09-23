# CoralCadets v0.2.0 — Reef Skins

Stage 1 of the six-step CoralCadets evolution plan.

## Baseline sync from the version currently being played

The public GitHub repository started with `v0.1.0`, the earliest original game. Development continued locally in `CoralCadet_Original_Upgrade_v2`, which became the version used for playtesting.

This release brings that current playtest baseline into the public history, including its existing improvements such as improved match feedback, invalid-swap rollback, immediate level completion, Pulse / φ Bloom / Symmetry feedback, Fibonacci chain feedback, and responsive game entry.

## Stage 1 — new in this release

- Added a lightweight reef skin selector to the landing screen.
- Added three skins:
  - **Classic Reef** — the existing aqua/coral look.
  - **Sunset Reef** — coral orange, violet dusk, warm gold.
  - **Moon Reef** — indigo water, pearl light, quiet gold.
- Skin choice is stored in `localStorage` and restored on the next visit.
- Phaser environment colors, HUD accents, result cards, Bloom effects, and procedural coral colors follow the selected skin.
- Existing image and audio assets are reused; no duplicate skin texture packs are downloaded.
- Standardized the visible project name to **CoralCadets**.

## Intentionally unchanged in Stage 1

- the 9 level layouts and difficulty curve;
- reef knowledge cards after levels;
- species progression;
- leaderboard behavior;
- GitHub contribution prompts.

Those are reserved for Stages 2–6 so the project history stays easy to follow.

## Local preference

The selected skin is stored under:

`coralcadets_theme`

No account is required.
