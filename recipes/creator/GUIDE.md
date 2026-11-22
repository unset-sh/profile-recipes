# Creator

A channel hub: explain what you make, pair it with one subscribe action, and give selected work more room than platform links.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Video creators, streamers, influencers and podcasters. People who mainly want to show written or reported work
should start from [journalist](../journalist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Cooking for ordinary weeks | text | half | filled | Explain the subject and audience so a new visitor understands the channel. |
| 2 | A new recipe every Thursday | buttons | half | plain | One primary subscribe destination and a complementary newsletter. |
| 3 | Latest videos | showcase, grid | full | plain | Three or four selected videos with a useful topic, duration and description. |
| 4 | Brand partnerships | buttons | half | outlined | Optional: Partnership fit and an approved business contact. |
| 5 | Where I post | links, list | half | plain | Other channels, without competing with the main subscription. |
| 6 | Behind the recipes | text | full | plain | The making process and disclosure policy, if the creator wants to share them. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Give the audience promise and primary subscription equal prominence, then let a short current-work grid carry the evidence. References: [MKBHD’s channel and selected-video hierarchy](https://mkbhd.com/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `introduction`.
3. `mainActionText`, `mainAction`, `mainActionHeading`.
4. `latest`.
5. `partnershipsText`, `partnerships`, `partnershipsHeading`.
6. `platforms`.
7. `about`.
8. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- One main action. A page that asks for five things gets none of them.
- Titles are copied exactly as published.
- Use the account URL for platform links. Without a label, the current app shows its host and path, with a generic external-link mark; it does not resolve platform icons or display names.
- Keep the sponsorship disclosure line, in their words. Many countries require creators to disclose paid content.
- No follower counts or view numbers: they go stale and the page cannot update them.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] The first button goes where they most want visitors to go.
- [ ] Every platform link opens their own account.
- [ ] The person confirmed each published email address may be public.
- [ ] Thumbnails are their own images.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
