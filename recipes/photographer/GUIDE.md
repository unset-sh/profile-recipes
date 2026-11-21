# Photographer

Introduce your photographic practice, present a coherent picture series and named projects, then explain how to commission you.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Documentary, editorial, wedding and portrait photographers; illustrators and other visual artists whose work is still
images. Videographers whose work lives on a video platform should start from [creator](../creator/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Practice and commissions | text | full | plain | Identify the photographic practice, working area and commission scope before any media. |
| 2 | Coastlines and working lives — selected photographs | images | full | plain | A coherent selection of photographs, shown whole with descriptive alt text and captions. |
| 3 | Projects | showcase, grid | full | plain | Three or four named series or commissions with context and portfolio destinations. |
| 4 | Available for commissions | buttons | half | filled | The next step for a commission, using only confirmed availability. |
| 5 | Elsewhere | links, list | half | plain | Optional: The complete portfolio and selected professional channels. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Organize photographs into a coherent series and named projects; orientation and commission details keep the page useful when images are unavailable. References: [Nadav Kander’s series-led portfolio](https://www.nadavkander.com/); [Adobe Portfolio’s collection guidance](https://help.myportfolio.com/hc/en-us/articles/50072031736731-Anatomy-of-an-Adobe-Portfolio-website).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `about`.
3. `seriesTitle`, `gallery`.
4. `projects`.
5. `hireButtonsText`, `hireButtons`, `hireButtonsHeading`.
6. `elsewhere`.
7. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Alt text describes what is in the picture for someone who cannot see it: subject, setting, light. One or two
  sentences. It is not the caption and not a title.
- Captions are short: a place and year, or the title they use for the picture.
- Name only clients they say they may name.
- Six pictures is the floor for a gallery that reads as a body of work; twelve is the most the card holds.
- If they have fewer than three projects, drop the Projects card rather than padding it.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Every picture has alt text written from the person's own description.
- [ ] The person has the right to publish every picture (their own work, and model releases where needed).
- [ ] Pictures are JPEG, with no location or camera metadata; the editor removes it on upload.
- [ ] The main button is the one they most want people to press.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
