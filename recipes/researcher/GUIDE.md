# Researcher or academic

A profile that explains the research to anyone, then gives specialists what they look for: publications, identifiers and openings.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Academics, postdocs, PhD students and industry researchers. Science journalists should start from [journalist](../journalist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | About | text | full | filled | What they work on, in words a non-specialist understands. |
| 2 | Selected publications | collection, list | full | outlined | Five to ten selected publications. |
| 3 | Join the lab | buttons | half | filled | Optional: Optional: openings and supervision. |
| 4 | Profiles | links, list | half | filled | Scholarly identifiers and profiles. |
| 5 | Talks and teaching | collection, list | full | plain | Optional: Optional: talks and teaching. |

If the join card is dropped, set the profiles card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: name with title as they use it, and the field in plain words
2. `research`.
3. `publications`: copy details from the DOI landing page
4. `ids`.
5. `join`, `talks`, `location`, `website`, `avatar`.

## Writing rules

- Explain the research in plain words first; jargon only after.
- Publication details exactly as the venue lists them; never reorder authors.
- No citation counts or h-index: they go stale.
- Positions only as the official advert describes them.

## Before publishing

- [ ] Every DOI resolves to the right paper.
- [ ] Affiliation matches the institution's own page.
- [ ] Openings are still open.
- [ ] The person confirmed each published email address may be public.
