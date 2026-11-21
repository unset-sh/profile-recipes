# Contributing a recipe

Thanks for helping. A good recipe is opinionated: it says what a profile for this kind of person should do, in which
order, and why, and it teaches an assistant to ask the right questions.

## Before you start

Open a [recipe idea](../../issues/new?template=recipe-idea.yml) issue first, so two people don't build the same one.
One recipe per pull request.

## Make one

1. Copy the closest recipe: `cp -r recipes/journalist recipes/<your-id>`. The id is lowercase with hyphens.
2. Edit `profile.json` and the files in `cards/`. Use only the card kinds and fields in [`lexicons/`](lexicons/).
   List the cards in `recipe.json` in page order, each with a one-line `purpose`.
3. Use invented sample data only: names you made up, links on `example.com`, `example.org` or `example.net`, or a
   platform listed in `limits.json` with "example" in the path or query. Never a real person's account.
4. Sample pictures go in `assets/` as JPEG with no metadata, your own work or generated, released under CC0. Get the
   reference to paste into a record with `npm run blob-ref -- recipes/<id>/assets/<file>.jpg`.
5. Write a slot in `recipe.json` for every field a person fills in: `ask` is the question, `write` is how to word
   the answer, `ifEmpty` says what to drop when they have nothing.
6. Write `GUIDE.md` with these sections: Who this is for, The layout, Interview, Writing rules, Before publishing.
7. Run `npm run previews`, then `npm run check`, and open a pull request.

## Versions

Each recipe has its own `version`. Bump the patch for wording, the minor for a new card or slot, the major when a
card or slot is removed or its meaning changes.

## When the app changes

`lexicons/` and `limits.json` are copied from the unset.sh app at the commit in `lexicons/source.json`. To update
them, copy the files from that repository's `shared/lexicons/schemas/`, update `source.json` and every recipe's
`lexicon.commit`, and run the checks.
