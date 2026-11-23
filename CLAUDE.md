# CLAUDE.md: unset-sh/profile-recipes

## Where this repository fits

This is `unset-sh/profile-recipes`: ready-made unset.sh profile layouts (recipes), each with a guide an AI assistant
follows to build someone's profile.

- **Belongs here:** recipes (`recipe.json`, `GUIDE.md`, sample records, assets, preview), the rules for applying
  them, the validator that checks them, and human documentation in `docs/`. The guarded exporter ships only
  `profile-recipes/` to `unset-sh/docs`; that repository owns site rendering and deployment.
- **Does not belong here:** the lexicon schemas (`schemas/upstream/` is a copy; the consumed source is `unset-sh/lexicons`), and the
  profile editor and its limits (`limits.json` mirrors the app).
- **Uses:** `unset-sh/lexicons` for schema copies at an exact commit; `Undefined6799/unset` for separately pinned
  editor limits and checked consumer behavior. Recipes follow the schema repository’s current contract.
  `unset-sh/tooling` for the branch policy check at a full commit; `unset-sh/agent-kit` as the copy under `.claude/`.
- **Licence:** recipes and sample content are CC0-1.0. Tooling and documentation are AGPL-3.0-only. Copied schemas
  retain their upstream MIT notice; the export preserves the notices for its own content.
- **Outside contributions:** recipes only, and only when every commit is signed off under the DCO and the DCO check
  is green. The tooling takes none for now.

The map of every unset.sh repository is <https://github.com/unset-sh/.github/blob/main/MAP.md>. Read it before
moving work between repositories or starting work that might belong elsewhere.

**Keep the map current.** When a change here adds, removes or moves a responsibility, changes what this repository
uses or ships, or renames or archives it, open a pull request on `unset-sh/.github` that updates `repos.json` (run
`bun run map` there) and update this section to match. Ask the owner before creating any new repository in the
organisation, and before changing the licence of anything already published.

## Working here

- To add or change a recipe, follow [`CONTRIBUTING.md`](CONTRIBUTING.md); `bun run check` must pass.
- [`AGENTS.md`](AGENTS.md) is for an assistant applying a recipe for a member, not for work on this repository. Keep
  its rules intact when you change it.
- Changes reach `main` only through a pull request.
- When behavior changes, review `docs/` with the source change. Check the publishing boundary and recovery steps in
  [`.github/DOCS-PUBLISHING.md`](.github/DOCS-PUBLISHING.md); Alex manages keys and environment settings.

## Commands

```sh
bun install --frozen-lockfile
bun run check      # types, tests, all recipes, and the agent-kit copy check
bun run previews   # rebuild dist/ and the preview PNGs (needs Playwright's Chromium)
```
