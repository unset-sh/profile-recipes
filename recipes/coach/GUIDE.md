# Coach or teacher

A clear coaching offer: who it helps, how to start, what each format includes, and when recurring sessions take place.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Coaches, tutors, language teachers, and yoga or movement teachers working with individuals. Consultants selling to companies should start from [freelancer](../freelancer/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Running, at your pace | text | half | plain | Explain who the coaching is for and how the work is approached. |
| 2 | Not sure where to start? | buttons | half | filled | A first conversation with its real format and price, if any. |
| 3 | Ways to work with me | showcase, list | full | outlined | Three or four engagement formats with what the participant receives. |
| 4 | Weekly sessions | text | half | plain | Confirmed recurring sessions and public meeting places. |
| 5 | What runners say | text | half | outlined | Optional: Verbatim participant quotes with permission. |
| 6 | Resources and channels | links, list | full | plain | Optional: Resources and professional channels. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Explain fit and format before the booking action; offers describe the work and practical commitments without guaranteeing results. References: [Ness Labs’ explanation of a consultation](https://nesslabs.com/consulting).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `introduction`.
3. `startText`, `start`, `startHeading`.
4. `offers`.
5. `schedule`.
6. `voices`.
7. `elsewhere`.
8. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Describe offers by what the student gets.
- Avoid health, income or outcome promises; describe the work, not guaranteed results.
- Student quotes are verbatim and approved; first names are fine.
- Meeting places are public venues only.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Prices and schedule are current.
- [ ] Every quote is approved by the student.
- [ ] No outcome is promised.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
