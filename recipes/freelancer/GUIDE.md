# Freelancer or consultant

A focused service profile: who you help, selected case studies, comparable offers and a clear first conversation.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Independent consultants, freelancers and fractional executives selling their time or a defined service. Agencies with a team should start from [small business](../small-business/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Product decisions, made together | text | half | plain | State the specialty, intended client and useful result before asking for a call. |
| 2 | Have a product decision to make? | buttons | half | filled | A clear way to discuss a potential project. |
| 3 | Case studies | showcase, list | full | plain | Optional: Selected case studies with the freelancer’s contribution and an approved result. |
| 4 | How I can help | showcase, grid | full | outlined | Up to four comparable offers, with format and published pricing when relevant. |
| 5 | What clients say | text | half | plain | Optional: Approved client words; never retain the demonstration quotes. |
| 6 | Elsewhere | links, list | half | plain | Optional: Professional profiles and a longer work or writing archive. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

State the client outcome before the call, then place concrete work before comparable offers; approved quotes support the story rather than substitute for it. References: [Dan Mall’s outcome-first introduction](https://danmall.com/); [Adobe Portfolio’s project context guidance](https://help.myportfolio.com/hc/en-us/articles/50072031736731-Anatomy-of-an-Adobe-Portfolio-website).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `introduction`.
3. `bookingText`, `booking`, `bookingHeading`.
4. `cases`.
5. `services`.
6. `testimonials`.
7. `elsewhere`.
8. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Describe each service by the outcome for the client, not the activity.
- Publish prices only if they already publish them; "from" prices are fine.
- Testimonials are verbatim and approved by the client. Never write, merge or improve a quote.
- Name a client only if that client is named publicly elsewhere.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] The booking link opens their real booking page.
- [ ] Every quote is approved by the person quoted.
- [ ] Prices match what they charge today.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
