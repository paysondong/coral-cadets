# CoralCadets 🪸

**A living coral puzzle game.**

CoralCadets began as a small coral-themed match-3 web game. This repository starts by preserving the original playable version, then documents its evolution toward a more distinctive game built around visual art, mathematical patterns, and coral-reef conservation.

## v0.1.0 — Original Version

This first public release intentionally keeps the original game design intact. It is the baseline for future redesigns rather than the finished portfolio edition.

### Original game features

- 9 playable match-3 levels
- Coral and marine-life themed pieces
- Phaser 3 game scenes
- React + TypeScript interface
- Score, moves and level objectives
- Music and sound effects
- Ocean trivia / conservation content
- Local progress and eco-points features from the original prototype

## Run locally

Requirements: a recent Node.js + npm installation.

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

If you need the optional Google OAuth configuration, copy `.env.example` to `.env` and provide your own client ID. Never commit real credentials.

## Project direction

The goal is to keep CoralCadets a **small, relaxing web game** while making it more original through:

- stronger art direction and animation;
- mathematical ideas expressed through gameplay rather than lessons;
- coral restoration shown through the world becoming more alive;
- lightweight, optional coral-conservation knowledge;
- multilingual support;
- a public development history showing how the project changes through playtesting and iteration.

See [docs/ROADMAP.md](docs/ROADMAP.md) for the planned evolution.

## Technology

- React 18
- TypeScript
- Phaser 3
- Create React App

## Repository note

This repository begins with the original version on purpose. Future releases will make the progression visible through Git tags and GitHub Releases instead of replacing or hiding the earlier work.

## Licensing

No open-source license is attached to v0.1.0 yet. The code and media are publicly viewable, but reuse rights have not been granted. Before the project is formally opened for reuse, code licensing and artwork/audio licensing will be documented separately.
