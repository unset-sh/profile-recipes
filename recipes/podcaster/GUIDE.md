# Podcaster

A listening hub: explain the show, make following easy, and separate selected episodes from guest and sponsor enquiries.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Independent podcasters, interview hosts and audio documentary makers. If their work is mainly video, start from [creator](../creator/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Signal & Noise | text | half | plain | Explain the show’s subject, host and audience before the subscription request. |
| 2 | New episodes every Tuesday | buttons | half | filled | One primary follow action, plus other listening formats. |
| 3 | Latest episodes | showcase, list | full | plain | Three or four episodes with number, duration and a concrete topic. |
| 4 | Listen anywhere | links, list | half | plain | Other listening platforms and the complete episode archive. |
| 5 | Be a guest or sponsor | buttons | half | outlined | Guest and sponsorship enquiries, separate from listener actions. |
| 6 | About the host | text | full | plain | Optional: Host background and editorial policy. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Make the show understandable before asking for a follow; a chronological episode list supports listening without inventing an embedded player. References: [99% Invisible’s episode archive](https://99percentinvisible.org/episodes/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `introduction`.
3. `followText`, `follow`, `followHeading`.
4. `episodes`.
5. `listen`.
6. `guestsText`, `guests`, `guestsHeading`.
7. `host`.
8. `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Episode titles and numbers exactly as published.
- Credit guests the way the episode credits them.
- Say how the show is funded if it takes sponsors.
- No download numbers or chart positions: they go stale.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every follow link opens the show, not an episode.
- [ ] Episode links are current.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
