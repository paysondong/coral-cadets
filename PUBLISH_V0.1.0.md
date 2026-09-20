# Publish v0.1.0

Repository: `https://github.com/paysondong/coral-cadets`

This folder is prepared as the first public baseline release.

## Terminal method

From this project folder:

```bash
git init -b main
git add .
git commit -m "Initial release: original CoralCadets game"
git remote add origin https://github.com/paysondong/coral-cadets.git
git push -u origin main
git tag -a v0.1.0 -m "CoralCadets v0.1.0 — Original Version"
git push origin v0.1.0
```

If the repository already contains an automatically generated README or another commit, do not force-push it. Pull/reconcile that commit first, or clear the empty setup commit from GitHub before using these commands.

## Suggested GitHub Release

Tag: `v0.1.0`

Title: `v0.1.0 — Original Version`

Description:

> The original CoralCadets prototype, preserved as the public starting point of the project. Future releases will document the evolution of its visual design, mathematical gameplay, and coral-conservation storytelling.
