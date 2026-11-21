# Musician or band

A release-led profile: introduce your sound, feature the current release, then separate the catalogue, live shows and industry enquiries.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Solo artists, bands, DJs, producers and composers. Music podcasts should start from [podcaster](../podcaster/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | The Low Tides | text | half | plain | Introduce the artist or band, sound and current release. |
| 2 | “Undertow” is out now | buttons | half | filled | Listen to the featured release or join the mailing list. |
| 3 | Releases | showcase, carousel | full | plain | A short release catalogue with format, year and original artwork proportions. |
| 4 | On tour | showcase, list | full | outlined | Optional: Three or four confirmed forthcoming shows with ticket destinations. |
| 5 | Listen | links, list | half | plain | Other listening destinations. |
| 6 | Booking and press | buttons | half | outlined | Booking and press enquiries, separate from fan actions. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Use release format and year to give the catalogue structure, while keeping tickets and professional enquiries separate from listening. References: [Nils Frahm’s release archive](https://www.nilsfrahm.com/works/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `introduction`.
3. `latestText`, `latest`, `latestHeading`.
4. `releases`.
5. `tour`.
6. `listen`.
7. `bookingText`, `booking`, `bookingHeading`.
8. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Titles exactly as released, including capitalisation and punctuation.
- Tour dates in one format throughout (day month year), with the city.
- Say sold out when it is; never invent a support act or venue.
- Cover art must be theirs to publish.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every ticket link opens the right show.
- [ ] No past dates are listed.
- [ ] Cover art is uploaded and has alt text.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
