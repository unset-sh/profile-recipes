# Speaker

An organizer-focused profile: establish topics and audience fit, offer an enquiry route, then support it with practical details and recordings.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Keynote and conference speakers, workshop facilitators, and experts who speak alongside their main work. Researchers whose talks are part of academic work should start from [researcher](../researcher/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Topics and audience | text | full | plain | Introduce the speaker’s audience, useful outcome and signature subjects. |
| 2 | Plan a talk for your team | buttons | half | filled | An organizer’s route to a speaking enquiry. |
| 3 | For organisers | text | half | outlined | Formats, speaker kit and practical planning information. |
| 4 | Recent talks | showcase, grid | full | plain | Three or four recordings or appearances that demonstrate the work. |
| 5 | Professional channels | links, list | full | plain | Optional: The press kit and selected professional channels. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Establish audience relevance before the enquiry; practical organizer information and recordings provide different kinds of evidence. References: [Brené Brown’s organizer information](https://brenebrown.com/speaking/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `topics`.
3. `bookText`, `book`, `bookHeading`.
4. `organisers`.
5. `talks`.
6. `elsewhere`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Credentials in the headline must be accurate and current or marked "former".
- Talk titles as delivered; audience sizes only as the event published them.
- Fees: say "on request" unless they ask to publish a figure.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every video link plays the right talk.
- [ ] The booking page works.
- [ ] Credentials are accurate.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
