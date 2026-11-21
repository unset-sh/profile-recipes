# Writer or author

An author profile with a clear writing voice, a short publication shelf, an ongoing newsletter and confirmed events.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Novelists, non-fiction authors, poets and essayists with published books. Reporters should start from [journalist](../journalist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Writing and enquiries | text | full | plain | Introduce the writing practice and route professional enquiries. |
| 2 | Books | showcase, carousel | full | plain | A short publication shelf with reading context and original cover proportions. |
| 3 | Letters from the desk | buttons | half | filled | A distinct invitation to read the ongoing newsletter. |
| 4 | Events | showcase, list | half | outlined | Optional: Confirmed forthcoming readings and conversations. |
| 5 | Elsewhere | links, list | full | plain | Optional: A full writing archive and selected reader communities. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Let the writing practice orient the visitor, then distinguish the publication shelf, ongoing letters and public appearances. References: [Austin Kleon’s books, writing and newsletter](https://austinkleon.com/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `about`.
3. `books`.
4. `newsletterText`, `newsletter`, `newsletterHeading`.
5. `events`.
6. `elsewhere`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Titles, dates and prize wording exactly as the publisher has them.
- A pre-order book says so in its description.
- The bio may be in the third person; keep it under 60 words.
- Covers are the publisher's; check they may be shown (publishers usually allow it).
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every buy link opens the right edition.
- [ ] Publication dates are correct.
- [ ] Past events are removed.
- [ ] Representation details match the agency's own listing.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
