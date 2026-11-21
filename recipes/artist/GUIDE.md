# Artist or illustrator

A gallery profile: introduce your practice, give one body of work space, then separate commissions from editions and the full portfolio.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Illustrators, painters, printmakers, concept and comic artists. Photographers should start from [photographer](../photographer/GUIDE.md); studios selling many products from [small business](../small-business/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Practice and commissions | text | full | plain | Introduce the medium, practice and commission scope before the work. |
| 2 | Imagined places — selected illustrations | images | full | plain | A named body of work with titles, captions and uncropped proportions. |
| 3 | Commissions open | buttons | half | filled | A clear commission enquiry, with availability only when confirmed. |
| 4 | Prints and shop | links, list | half | plain | Optional: Editions and the complete portfolio, separate from commissioning. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Give a named body of work a quiet, full-width setting, with commissions and editions as separate next steps. References: [Malika Favre’s themed bodies of work](https://www.malikafavre.com/pages/the-work).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `about`.
3. `seriesTitle`, `work`.
4. `commissionsText`, `commissions`, `commissionsHeading`.
5. `shop`.
6. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Alt text describes what is in each piece, from the artist's own words.
- Captions give title, medium, and client or year; nothing more.
- Show only work they have the right to publish, including client work.
- Prices only as "from" figures they already use.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.
- Titles and medium belong in captions; alt text describes the actual work from the person’s own account. Keep the artwork’s original proportions.

## Before publishing

- [ ] Every piece has alt text.
- [ ] Client work is cleared for portfolio use.
- [ ] The commission status is current.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
