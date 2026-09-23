# Update the GitHub repository to CoralCadets v0.2.0

This patch is designed for the existing `paysondong/coral-cadets` v0.1.0 repository.

It contains all files that differ between the public v0.1.0 starting point and the new v0.2.0 Reef Skins release. It therefore also brings the repository up to the `Original_Upgrade_v2` playtest baseline before adding the Stage 1 theme system.

## Web upload

1. Open: `https://github.com/paysondong/coral-cadets`
2. Make sure the branch is `main`.
3. Choose **Add file → Upload files**.
4. Unzip this patch on your computer.
5. From Finder, drag **all contents inside this patch folder** into the GitHub upload area.
   - Do not upload the ZIP itself.
   - Keep the folder structure (`src/...`, `public/...`).
   - This patch is under GitHub's 100-file web-upload limit.
6. Commit directly to `main`.

Recommended commit message:

`Release v0.2.0: add Reef Skins`

## Create the release after the commit

- Tag: `v0.2.0`
- Title: `CoralCadets v0.2.0 — Reef Skins`
- Use the contents of `RELEASE_NOTES_v0.2.0.md` as the release description.

## What Stage 1 adds

- Classic Reef
- Sunset Reef
- Moon Reef
- local skin preference
- matching Phaser environment/HUD accent colors
- no duplicate image packs
