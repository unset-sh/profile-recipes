# Nonprofit or community organiser

A mission-led community profile: explain who you serve, pair participation with transparent evidence, and list useful activities.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Charities, nonprofits, community groups, mutual-aid networks and grassroots campaigns. Companies with a social mission that sell products should start from [small business](../small-business/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Our mission | text | full | plain | Explain the mission, who is served and how to participate. |
| 2 | Support the next collection | buttons | half | filled | Donate or volunteer through the group’s own destinations. |
| 3 | Where the money goes | text | half | outlined | Optional: Qualified, dated financial information and a link to the full report. |
| 4 | Come along | showcase, list | full | plain | Three or four recurring or confirmed community activities. |
| 5 | Get in touch | links, list | full | plain | Contact, transparency and public community channels. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Explain the mission before the ask, pair participation with qualified financial context, and make recurring community activities easy to find. References: [charity: water’s mission, proof and participation hierarchy](https://www.charitywater.org/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `mission`.
3. `supportText`, `support`, `supportHeading`.
4. `money`.
5. `events`.
6. `contact`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Every impact claim must come from the organisation's own published figures.
- Donation links go only to the organisation's own or its official fundraising page.
- Never name the people they help; venues are public places.
- Use the registered name and number exactly.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] The donate link reaches the official donation page.
- [ ] Figures match the latest published accounts.
- [ ] Events are current.
- [ ] No beneficiary is identifiable.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
