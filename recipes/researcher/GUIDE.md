# Researcher or academic

A compact research index: explain the question, show selected publications with context, and link to the complete scholarly record.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Academics, postdocs, PhD students and industry researchers. Science journalists should start from [journalist](../journalist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Research focus | text | full | plain | Explain the research question and affiliation before the specialist record. |
| 2 | Selected publications | showcase, list | full | plain | Three or four selected papers with authors, venue, year and contribution. |
| 3 | Join the lab | buttons | half | outlined | Optional: Official openings and collaboration enquiries, if current. |
| 4 | Profiles | links, list | half | plain | The complete scholarly record and identifiers. |
| 5 | Talks and teaching | showcase, list | full | outlined | Optional: Selected talks and teaching. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Lead with the research question, then selected papers with proper metadata; complete records belong behind clear scholarly links. References: [Kayvon Fatahalian’s research index](https://graphics.stanford.edu/~kayvonf/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `research`.
3. `publications`.
4. `joinText`, `join`, `joinHeading`.
5. `ids`.
6. `talks`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Explain the research in plain words first; jargon only after.
- Publication details exactly as the venue lists them; never reorder authors.
- No citation counts or h-index: they go stale.
- Positions only as the official advert describes them.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every DOI resolves to the right paper.
- [ ] Affiliation matches the institution's own page.
- [ ] Openings are still open.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
