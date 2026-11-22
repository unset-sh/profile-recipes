# CLAUDE.md: unset-sh/profile-recipes

## Where this repository fits

This is `unset-sh/profile-recipes`: ready-made unset.sh profile layouts (recipes), each with a guide an AI assistant
follows to build someone's profile.

- **Belongs here:** recipes (`recipe.json`, `GUIDE.md`, sample records, assets, preview), the rules for applying
  them, and the validator that checks them.
- **Does not belong here:** the lexicon schemas (`lexicons/` is a copy; the source is `Undefined6799/unset`), and the
  profile editor and its limits (`limits.json` mirrors the app).
- **Uses:** `Undefined6799/unset`, whose lexicon schemas and editor limits are copied here at a pinned commit.
- **Licence:** recipes and sample content are CC0-1.0. The tooling is MIT today and moves to AGPL-3.0-only (the
  owner's decision of 2026-11-21, made in its own change).
- **Outside contributions:** recipes only, and only when every commit is signed off under the DCO and the DCO check
  is green. The tooling takes none for now.

The map of every unset.sh repository is <https://github.com/unset-sh/.github/blob/main/MAP.md>. Read it before
moving work between repositories or starting work that might belong elsewhere.

**Keep the map current.** When a change here adds, removes or moves a responsibility, changes what this repository
uses or ships, or renames or archives it, open a pull request on `unset-sh/.github` that updates `repos.json` (run
`npm run map` there) and update this section to match. Ask the owner before creating any new repository in the
organisation, and before changing the licence of anything already published.

## Working here

- To add or change a recipe, follow [`CONTRIBUTING.md`](CONTRIBUTING.md); `npm run check` must pass.
- [`AGENTS.md`](AGENTS.md) is for an assistant applying a recipe for a member, not for work on this repository. Keep
  its rules intact when you change it.
- Changes reach `main` only through a pull request.
