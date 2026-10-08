# CoralCadets

**A coral-themed match-3 game, started in seventh grade and still growing.**

## It started with an actual coral

In seventh grade, I joined a coral adoption program while visiting the St. Regis in the Maldives. I got to place my adopted coral underwater myself. After the trip, the nonprofit involved in the program sent regular updates, so I could keep following what happened to it.

It is surprisingly easy to get attached to something that does not text you back.

That experience got me interested in coral reefs, and I made a very simple game that same year. As I learned more about ecology, I kept wanting to improve it. Eventually, that little game grew into this repository.

## Why a game?

I'm Payson, and I'm now in tenth grade. I've loved art and nature since I was little, and I love math too. Architecture has become another way for me to explore how those interests fit together: shapes, patterns, living things, and the spaces around them.

CoralCadets is one place where I can play with those connections. What if a chain reaction followed the numbers 3, 5, and 8? What if matching a pattern made the reef behind the board grow? I like seeing what happens when a slightly odd idea becomes something you can actually click.

I want the game to be fun first. The math shows up in patterns and visual effects, and the reef gives it a world to belong to. The coral growth on screen is imaginary; this is a game inspired by my interest in reefs, not a model of how real reefs recover.

## What's in the game?

The current version builds on the original game, keeping its nine levels, ocean characters, debris tiles, fish animations, sounds, and board shapes.

- **Match 3:** make a regular match.
- **Match 4:** trigger `PULSE` to clear neighboring cells.
- **Match 5 or more:** trigger `φ BLOOM` for a larger local burst.
- **Make a cross or T:** trigger `SYMMETRY WAVE`.
- **Reach a chain depth of 3, 5, or 8:** activate `FIBONACCI FLOW`.
- **Fill the Bloom meter:** trigger `REEF BLOOM` for extra points and background coral growth.
- **Choose a reef skin:** change the visual theme.

Swap tiles by swiping or selecting two neighboring tiles. Invalid swaps do not cost a move, and completing the goal ends the level immediately. If the board has no available moves, `CURRENT SHIFT` reshuffles it.

## A growing project

The original game began in seventh grade. This repository is where I'm continuing to develop it as my interests and understanding grow.

I use AI tools to help develop the project. The code includes AI-assisted work, so it should not be read as code I wrote entirely on my own. The coral adoption experience and the interests behind the project are mine. As I keep working on it, I want to get better at understanding the code, testing changes, and explaining why a design works—or why it doesn't.

My next questions are about the experience of playing: do the patterns make sense to someone seeing them for the first time? Do the effects help players follow a chain reaction? How can the reef feel more alive without making the board harder to read?

## Run locally

Recommended: Node.js 18 or newer.

```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser. Desktop and mobile use the same responsive game entry point.

To create a production build:

```bash
npm run build
```

## Find your way around the code

```text
src/game/
├── Game.tsx              # Game entry screen
├── SceneLevel.ts         # HUD, visual effects, win/loss screens, and Bloom
├── Level.ts              # Level structure, color combinations, and goals
├── LevelUtils.ts         # Tile swapping and falling logic
├── PatternEngine.ts      # Match patterns and available-move checks
├── Layout.ts             # Shared portrait layout for mobile and desktop
├── theme/                # Reef skins and locally saved theme preference
├── Level1.ts ... Level9.ts
└── menu/                 # Game menu
```

The original image and audio assets remain in `public/images` and `public/audio`.

## Current version

**v0.2.0 — Reef Skins (Stage 1)** adds lightweight, player-selectable visual themes while preserving the existing gameplay and assets. See [release notes](RELEASE_NOTES_v0.2.0.md) and the [roadmap](STAGE_ROADMAP.md).
