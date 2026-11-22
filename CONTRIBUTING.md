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

Recipes are what this repository takes from outside. The tooling (scripts, site, workflows) is
[AGPL-3.0-only](LICENSE) and takes no outside pull requests for now: open an issue and we will make the change. The
rules for every unset-sh repository, security reports included, are in the
[organisation's contributing guide](https://github.com/unset-sh/.github/blob/main/CONTRIBUTING.md).

## Before you start

Open a [recipe idea](../../issues/new?template=recipe-idea.yml) issue first, so two people don't build the same one.
For new contributions, keep one recipe per pull request. A shared schema or preview-tooling update may migrate all affected recipes together; explain that scope in the pull request.

## Make one

1. Copy the closest recipe: `cp -r recipes/journalist recipes/<your-id>`. The id is lowercase with hyphens.
2. Edit `profile.json` and the files in `cards/`. Use only fields in the vendored upstream definitions under
   [`schemas/upstream/`](schemas/upstream/): `sh.unset.profile`, `sh.unset.card` and `sh.unset.block.*`.
   These schema files are copied dependencies, not examples. The recipe JSON files are the examples.
   List the cards in `recipe.json` in page order, each with a one-line `purpose`.
3. Use invented sample data only: names you made up, links on `example.com`, `example.org` or `example.net`, or a
   platform listed in `limits.json` with "example" in the path or query. Never a real person's account.
4. Sample pictures go in `assets/` as JPEG with no metadata, at most 2560 px on the longest side, your own work or
   generated, released under CC0. This JPEG policy is stricter than the upstream schemas' `image/*`. Get the
   reference to paste into a record with `npm run blob-ref -- recipes/<id>/assets/<file>.jpg`.
5. Write a slot in `recipe.json` for every field a person fills in: `ask` is the question, `write` is how to word
   the answer, `required` is a boolean, and optional slots need `ifEmpty` (`drop-field`, `drop-item` or `drop-card`).
   Links use HTTPS without credentials. Check the README's app support notes before choosing a block or image field:
   a valid schema record alone does not mean the app shows it.
6. Write `GUIDE.md` with these sections: Who this is for, The layout, Interview, Writing rules, Before publishing.
7. Run `npm run previews`, then `npm run check`, and open a pull request.

## Versions

Each recipe has its own `version`. Bump the patch for wording, the minor for a new card or slot, the major when a
card or slot is removed or its meaning changes. During 0.x, a minor bump also marks a draft upstream contract migration;
0.2 migrates all examples to card/block records and is incompatible with the old section format.

## When the app changes

`schemas/upstream/` contains unmodified Lexicon documents from the unset.sh app at the full commit in
[`source.json`](schemas/upstream/source.json). The definitions and NSIDs belong to upstream; this repository does
not publish or redefine them. Their publication status is recorded at that commit, not inferred from schema validity.

To update the snapshot, copy the relevant files and all referenced definitions from upstream's
`shared/lexicons/schemas/`, preserving their bytes, together with its license. Update `source.json` and every recipe's
`lexicon.commit`; migrate records and slot pointers if the format changed. Derive the editor limits in
`limits.json` from `APP_LIMITS`, `CARD_EDIT_LIMITS` and `TEXT_EDIT_BYTES`. The `sampleHosts` list is repository
policy, not copied app configuration. Review the actual editor and renderer before updating support claims, then
regenerate previews and run `npm run check`.

The checks deliberately reject unknown fields and block types in samples to catch typos. AT Protocol itself allows
extensions; do not describe this stricter template policy as an upstream write rule.
