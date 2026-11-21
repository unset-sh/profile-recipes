# Speaker

A profile organisers can book from. The booking button leads; topics, formats and past talks answer the questions an organiser asks before they write.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Keynote and conference speakers, workshop facilitators, and experts who speak alongside their main work. Researchers whose talks are part of academic work should start from [researcher](../researcher/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Book me to speak | buttons | full | filled | The main ask: book them. |
| 2 | Topics | text | half | filled | Two to four topics, one line each. |
| 3 | For organisers | text | half | filled | What organisers need: bio, photo, formats. |
| 4 | Recent talks | collection, list | full | outlined | Recent talks, with video where it exists. |
| 5 | links | links, grid | full | plain | Optional: Optional: where to follow them. |

If the organisers card is dropped, set the topics card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name and what they speak about, with the credential that earns the stage
2. `topics`.
3. `talks`: video links where possible
4. `book`, `organisers`.
5. `elsewhere`, `location`, `website`, `avatar`.

## Writing rules

- Credentials in the headline must be accurate and current or marked "former".
- Talk titles as delivered; audience sizes only as the event published them.
- Fees: say "on request" unless they ask to publish a figure.

## Before publishing

- [ ] Every video link plays the right talk.
- [ ] The booking page works.
- [ ] Credentials are accurate.
- [ ] The person confirmed each published email address may be public.
