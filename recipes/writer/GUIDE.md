# Writer or author

A profile that sells books and grows a readership. Covers come first, the newsletter is the main ask, and events and representation follow.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Novelists, non-fiction authors, poets and essayists with published books. Reporters should start from [journalist](../journalist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Books | collection, grid | full | filled | Their books with covers and buy links, newest first. |
| 2 | Letters from the desk | buttons | half | filled | The main ask: the newsletter. |
| 3 | Events | collection, list | half | filled | Optional: Optional: readings, festivals, signings. |
| 4 | About | text | full | plain | Short bio and representation. |
| 5 | links | links, grid | full | outlined | Optional: Social and reader platforms. |

If the events card is dropped, set the newsletter card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name and their newest book
2. `books`: they upload the covers
3. `newsletter`.
4. `events`.
5. `about`, `elsewhere`, `location`, `website`, `avatar`.

## Writing rules

- Titles, dates and prize wording exactly as the publisher has them.
- A pre-order book says so in its description.
- The bio may be in the third person; keep it under 60 words.
- Covers are the publisher's; check they may be shown (publishers usually allow it).

## Before publishing

- [ ] Every buy link opens the right edition.
- [ ] Publication dates are correct.
- [ ] Past events are removed.
- [ ] Representation details match the agency's own listing.
