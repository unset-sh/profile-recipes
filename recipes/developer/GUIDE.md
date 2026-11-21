# Developer

An engineering profile: explain your focus, show selected projects with your contribution, and connect code, writing and contact.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Software engineers, open-source maintainers, data and ML engineers. If they are job hunting right now, start from [job seeker](../job-seeker/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Engineering focus | text | full | plain | Explain the engineering focus, current work and technical interests in ordinary words. |
| 2 | Projects | showcase, list | full | outlined | Selected projects with the problem solved, contribution and source or demo. |
| 3 | Open to contract work | buttons | half | filled | Optional: How to discuss relevant work, without a stale availability promise. |
| 4 | Find me | links, list | half | plain | Source code and professional profiles. |
| 5 | Talks and writing | showcase, list | full | plain | Optional: Selected technical writing and talks as supporting evidence. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Explain the engineering practice before the project names; list descriptions state the problem and contribution, with source links nearby. References: [Brittany Chiang’s professional portfolio](https://brittanychiang.com/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `stack`.
3. `projects`.
4. `contactText`, `contact`, `contactHeading`.
5. `code`.
6. `writing`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Copy project names exactly; describe what a project does, not how clever it is.
- List only projects they own or meaningfully contributed to, and say which.
- No skill bars, ratings or years-per-language.
- Keep the stack card short: a reader scans it in five seconds.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every project link opens the right repository.
- [ ] Licences in tags match the repositories.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
