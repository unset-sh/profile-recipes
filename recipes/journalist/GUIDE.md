# Journalist

An editorial profile: introduce your beat, show three or four selected reports, then offer approved tip and follow destinations.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Staff and freelance reporters, editors, and newsletter writers who report. If the person mostly writes opinion and has
no reporting to list, start from [creator](../creator/GUIDE.md) instead.

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Reporting focus | text | full | plain | Orient editors and sources with the beat, outlets, languages and corrections policy. |
| 2 | Selected reporting | showcase, list | full | plain | Three or four selected reports with publication, year and a one-line finding. |
| 3 | Have a story? | buttons | half | filled | An approved sensitive-tip channel first, followed by public email if offered. |
| 4 | Follow my work | links, list | half | plain | The complete reporting archive and places to follow the work. |
| 5 | Talks and appearances | showcase, list | full | plain | Optional: Selected talks, panels or podcasts, when relevant. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Use publication, date and finding to make each report useful at a glance; the selected set is a reading list rather than a wall of destinations. References: [Patrick Radden Keefe’s selected reporting](https://www.patrickraddenkeefe.com/articles-new-new).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `about`.
3. `reporting`.
4. `tipsChannelText`, `tipsChannel`, `tipsChannelHeading`, `tipsEmail`.
5. `elsewhere`.
6. `appearances`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Headlines are copied exactly as published. Never rewrite another outlet's headline.
- The description says what the story found, in one line of plain words: numbers, not adjectives.
- A secure channel, if they have one, is always the first button. Never present email as secure.
- Ask for their corrections policy; do not retain the demonstration promise if they have not approved it.
- No claims of awards or exclusives unless they give you the source.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every story link opens the right story.
- [ ] The person confirmed each published email address may be public.
- [ ] Nothing in the profile identifies a source or an unpublished story.
- [ ] The headline is one line, at most 120 characters.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
