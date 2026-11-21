# Job seeker

A compact résumé: state the role you want, pair relevant experience with contact, and support it with public work.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

People looking for a new role, graduates and career changers. Freelancers selling services should start from [freelancer](../freelancer/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | The role I’m looking for | text | full | plain | State the target role, strongest capability and current availability. |
| 2 | Experience | showcase, list | half | outlined | Three or four relevant roles with a concrete contribution, newest first. |
| 3 | Let's talk | buttons | half | filled | Résumé and an approved contact destination near the experience. |
| 4 | Selected work | showcase, list | full | plain | A few public projects that demonstrate the target role. |
| 5 | Professional profiles | links, list | full | plain | Professional profiles that support the application. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Put target-role fit first, then bring contact beside relevant experience; public projects substantiate the application. References: [Brittany Chiang’s experience and project hierarchy](https://brittanychiang.com/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `looking`.
3. `experience`.
4. `contactText`, `contact`, `contactHeading`.
5. `work`.
6. `profiles`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Lead with what they want next, not their whole history.
- One result per role; numbers only as they give them.
- Never publish salary, age, health, family or immigration details.
- A public profile can be read by the current employer. Signed-in visibility is not a private job search: any signed-in viewer may qualify, and repository data can remain accessible. Publish only material they are comfortable sharing.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Dates and titles match their CV.
- [ ] Case studies are cleared for public sharing.
- [ ] They are happy for their current employer to see the page.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
