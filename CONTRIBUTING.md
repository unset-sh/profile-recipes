# Contributing a recipe

Thanks for helping. A good recipe is opinionated: it says what a profile for this kind of person should do, in which
order, and why, and it teaches an assistant to ask the right questions.

## Sign off your commits

Recipes are released under [CC0](LICENSE-CONTENT), so anyone can copy them freely. Each commit you add carries a
sign-off line, `Signed-off-by: Your Name <you@example.com>`. With it you certify the
[Developer Certificate of Origin](https://developercertificate.org): the work is yours to give under that licence.
There is nothing else to sign.

- In GitHub's web editor the line is added for you.
- On your computer, commit with `git commit -s`. Forgot? `git commit --amend --no-edit -s` fixes the last commit,
  `git rebase --signoff origin/main` fixes them all; then push again with `--force-with-lease`.

The DCO check on your pull request says which commits still need it.

Validation runs for pull requests and pushes to `staging` and `main`. The separate
`policy / Validate branch policy` check calls pinned organisation tooling to validate PR branch relationships,
including retargets. It does not publish recipes or documentation. Repository settings adopt required checks
separately; the documentation publisher retains its existing `main` restriction and environment gate.

Recipes are what this repository takes from outside. The tooling (scripts, site, workflows) is
[AGPL-3.0-only](LICENSE) and takes no outside pull requests for now: open an issue and we will make the change. The
rules for every unset-sh repository, security reports included, are in the
[organisation's contributing guide](https://github.com/unset-sh/.github/blob/main/CONTRIBUTING.md).

## Before you start

Open a [recipe idea](../../issues/new?template=recipe-idea.yml) issue first, so two people don't build the same one.
For new contributions, keep one recipe per pull request. A shared schema or preview-tooling update may migrate all affected recipes together; explain that scope in the pull request.

## Make one

1. Copy the closest recipe: `cp -r recipes/journalist recipes/<your-id>`. The id is lowercase with hyphens.
2. Edit `profile.json`, `page.json` and the files in `cards/`. Use only fields in the vendored upstream definitions under
   [`schemas/upstream/`](schemas/upstream/): `sh.unset.profile`, `sh.unset.page`, `sh.unset.card` and `sh.unset.block.*`.
   These schema files are copied dependencies, not examples. The recipe JSON files are the examples.
   Keep identity on the profile and visibility on the page. Leave page card references absent until real
   record keys are assigned. List the cards in `recipe.json` in page order, each with a one-line `purpose`.
3. Use invented sample data only: names you made up, links on `example.com`, `example.org` or `example.net`, or a
   platform listed in `limits.json` with "example" in the path or query. Never a real person's account.
4. Sample pictures go in `assets/` as JPEG with no metadata, at most 2560 px on the longest side, your own work or
   generated, released under CC0. This JPEG policy is stricter than the upstream schemas' `image/*`. Get the
   reference to paste into a record with `bun run blob-ref -- recipes/<id>/assets/<file>.jpg`.
5. Write a slot in `recipe.json` for every field a person fills in: `ask` is the question, `write` is how to word
   the answer, `required` is a boolean, and optional slots need `ifEmpty` (`drop-field`, `drop-item` or `drop-card`).
   Links use HTTPS without credentials. Check the README's app support notes before choosing a block or image field:
   a valid schema record alone does not mean the app shows it.
6. Write `GUIDE.md` with these sections: Who this is for, The layout, Interview, Writing rules, Before publishing.
7. Run `bun run previews`, then `bun run check`, and open a pull request.

## Versions

Each recipe has its own `version`. Bump the patch for wording, the minor for a new card or slot, the major when a
card or slot is removed or its meaning changes. During 0.x, a minor bump also marks a draft upstream contract migration;
0.2 migrated examples from sections to cards/blocks; 0.3 separates profile identity from page visibility and ordering.
These are recipe-format versions, not permission to make breaking changes to an existing NSID.

## When the app changes

`schemas/upstream/` contains unmodified documents from [unset-sh/lexicons](https://github.com/unset-sh/lexicons)
at the full commit in [`source.json`](schemas/upstream/source.json). That contract is the target: update recipes and
tools to it, never edit copied schemas to make a sample pass. The recipe snapshot needs the profile, page, card and
six block definitions; the OAuth permission set is not a recipe record dependency.

Copy every required schema and its referenced definitions byte for byte, retaining the MIT notice. Update the
source manifest's commit, paths and hashes and every recipe's `lexicon` pin. Migrate records and slot pointers to the
new contract, regenerate previews and run `bun run check`. A matching hash proves the copy matches its manifest;
review it against the actual source commit too.

The app's editor limits and display support are a separate dependency. Derive `limits.json` from `APP_LIMITS`,
`CARD_EDIT_LIMITS` and `TEXT_EDIT_BYTES`; `sampleHosts` remains repository policy. Review the actual editor and
reader at a named app commit. Exercise recipe loading and both preview modes, including omitted or empty optional
content. A schema-valid record can still be hidden by an app that does not support its block type.

For future changes to an existing NSID, follow the
[Lexicon evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution): added fields must be optional, and
existing names, types, required fields, closed unions and size or length limits must stay compatible. Retaining
field names alone is insufficient. Breaking changes require a new NSID. This migration updates consumers of an
already-selected contract; it does not change that contract or establish a new schema authority.

The checks deliberately reject unknown fields and block types in samples to catch typos. AT Protocol itself allows
extensions; do not describe this stricter template policy as an upstream write rule.
