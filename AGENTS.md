# Applying a recipe: instructions for AI assistants

You are helping one person build their own unset.sh profile from a recipe in this repository. Follow these rules for
every recipe; each recipe's `GUIDE.md` adds what is specific to it.

These instructions govern applying a recipe to a person's profile. For work on the invented samples, schemas or
tools in this repository, follow [CONTRIBUTING.md](CONTRIBUTING.md); that work does not publish a person's profile.

## 1. Choose the recipe

Read each `recipes/*/recipe.json` (`title`, `summary`, `persona.for`, `persona.notFor`). Pick the closest one, tell
the person which you picked and why in one sentence, and offer the runner-up. If none fits, use the closest and drop
cards that do not apply; never invent a card kind.

## 2. Interview

Ask the questions in the recipe's `slots`, in the order its `GUIDE.md` gives, one or two at a time.

- Use only what the person tells you or links you to. **Never invent facts**: no employers, clients, awards, numbers
  or quotes they did not give you. If a slot has no answer, apply its `ifEmpty` rule (`drop-field`, `drop-item`,
  `drop-card`); a `required` slot with no answer means asking once more, then leaving the card out.
- You may read pages the person links to only to copy a published title, outlet or date. Ask if you cannot read one.
- An email address on a profile is public. Before using one, say so and get a clear yes.
- Pictures are uploaded by the person in the unset.sh editor. Never fetch, generate or suggest pictures of them.
- Alt text describes what is in a picture for someone who cannot see it. Write it from the person's own description;
  never guess what a picture shows.

## 3. Write

Fill each slot following its `write` note and the guide's writing rules, in the person's voice and language. Keep
within the editor's limits in [`limits.json`](limits.json) and the lexicon's (`maxGraphemes` in
[`schemas/upstream/`](schemas/upstream/)). These are vendored upstream definitions, not sample records or schemas
authored by this repository. Links must be `https://` URLs without credentials.

Show the result as one block per card, in page order: card kind, width, surface, then each field ready to paste.
Then show the guide's "Before publishing" checklist and go through it with the person.

## 4. Hand over

The person enters the cards in the unset.sh profile editor themselves. You do not publish, and:

- **never ask for a password, app password, token or recovery code**, and refuse one if it is offered;
- never write to the person's repository or any account on their behalf;
- never put personal details from this conversation anywhere but the profile text the person approves.

## Records, for tools

The sample records in each recipe are `sh.unset.profile`, `sh.unset.page` and `sh.unset.card` records.
`profile.json` holds identity details only. `page.json` is the main page template, written under record key `self`;
its `visibility` controls the requested audience. Each card's `content.$type` names a `sh.unset.block.*` definition.

A tool preparing new records must replace sample timestamps with creation times and every blob with one the person
uploaded. Leave `cards` out of the page template until card record keys are assigned. Then fill the page's `cards`
with `{ "uri": "at://<did>/sh.unset.card/<rkey>" }` entries in the retained manifest order, using the same person's
DID and repository. Never put `cards` or `visibility` on the profile. Unlisted cards do not appear on the page.

For existing profile, page and card records, merge only the intended changes; preserve unknown fields, including
those inside blocks, and existing creation times. Preserve the page's visibility and references unless the person
explicitly changes them. The sample's public visibility is not permission to replace their choice. Preparing records
does not authorize publishing them.

Use only fields and block types defined in the vendored snapshot. This is a template rule: the protocol permits
extensions, and readers may ignore them. Schema support also does not guarantee the current app editor or renderer
supports a feature; follow the recipe guide and the limitations in the README.

Visibility is a request to apps. Even `signed-in` and `owner-only` records remain public on the AT Protocol network;
never use these values to promise confidentiality.
