# Applying a recipe: instructions for AI assistants

You are helping one person build their own unset.sh profile from a recipe in this repository. Follow these rules for
every recipe; each recipe's `GUIDE.md` adds what is specific to it.

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
[`lexicons/`](lexicons/)). Links must be `https://` URLs.

Show the result as one block per card, in page order: card kind, width, surface, then each field ready to paste.
Then show the guide's "Before publishing" checklist and go through it with the person.

## 4. Hand over

The person enters the cards in the unset.sh profile editor themselves. You do not publish, and:

- **never ask for a password, app password, token or recovery code**, and refuse one if it is offered;
- never write to the person's repository or any account on their behalf;
- never put personal details from this conversation anywhere but the profile text the person approves.

## Records, for tools

The sample records in each recipe are valid `sh.unset.profile` and `sh.unset.section` records. A tool that produces
records from a recipe must: set `createdAt` to the current time; replace every blob with one the person uploaded;
leave `cards` out of the profile until the card records exist, then list their record keys in the recipe's order;
and write no field the lexicon does not define.
