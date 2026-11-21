# Journalist

A profile for reporters and editors. An editor should see your beat and best work in ten seconds; a source should
see how to reach you safely without scrolling.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Staff and freelance reporters, editors, and newsletter writers who report. If the person mostly writes opinion and has
no reporting to list, start from [creator](../creator/GUIDE.md) instead.

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | About | readme | full | filled | Beat, outlets, languages, corrections policy |
| 2 | Selected reporting | collection, list | full | outlined | Their strongest stories, newest first |
| 3 | Have a story? | buttons | half | filled | The secure tip channel, then email |
| 4 | Follow my work | links, list | half | plain | Where to follow them |
| 5 | Talks and appearances | collection, list | full | plain | Optional |

Cards 3 and 4 sit side by side on wide screens. If either is dropped, set the other's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each question is a slot in `recipe.json`.

1. `displayName`, `headline`: their byline name and their beat in one line.
2. `about`: outlets, beat, languages.
3. `reporting`: links to three to six stories. Read each linked page only to copy its headline, outlet and year; if
   you cannot read it, ask them.
4. `tipsChannel`, then `tipsEmail`: say plainly that an email address on the profile is visible to everyone.
5. `elsewhere`, `appearances`, `location`, `website`, `avatar`.

## Writing rules

- Headlines are copied exactly as published. Never rewrite another outlet's headline.
- The description says what the story found, in one line of plain words: numbers, not adjectives.
- A secure channel, if they have one, is always the first button. Never present email as secure.
- Keep the corrections line unless they ask to remove it; it is part of what makes the page trustworthy.
- No claims of awards or exclusives unless they give you the source.

## Before publishing

- [ ] Every story link opens the right story.
- [ ] The person confirmed each published email address may be public.
- [ ] Nothing in the profile identifies a source or an unpublished story.
- [ ] The headline is one line, at most 120 characters.
