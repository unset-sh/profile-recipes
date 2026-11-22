# Small business or maker

A practical storefront: explain what you offer, make shopping easy, then show products, visit details and custom enquiries.

Read [AGENTS.md](../../AGENTS.md) first for the interview, public-email and upload rules. This guide adds the choices specific to this recipe.

## Who this is for

Makers, craft studios, independent shops, cafés and small online brands. Solo artists selling originals should start from [artist](../artist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Fern & Clay | text | half | plain | Say what the business makes or provides and where it operates. |
| 2 | Ceramics for everyday use | buttons | half | filled | The useful customer action: shop, order or book. |
| 3 | From the studio | showcase, grid | full | plain | Three or four representative products with checked prices and practical details. |
| 4 | Visit the studio | text | half | outlined | Confirmed opening hours, location and visit information. |
| 5 | Wholesale and custom orders | buttons | half | plain | Optional: Wholesale, custom work or service enquiries. |
| 6 | Shop and studio channels | links, list | full | plain | Optional: Other storefronts and public channels. |

The table and `recipe.json` give the same reading order; filenames are stable identifiers, not display order. Half-width neighbors share a row on wide screens and stack in this order on small screens. If an optional half-width card is omitted, make its remaining neighbor full width.

## Design notes

Put a useful customer action beside a clear business introduction, then separate product selection, visit logistics and custom enquiries. References: [Pophams’ shopping and visit destinations](https://pophamsbakery.com/).

Use only the existing full/half widths, filled/outlined/plain surfaces and list/grid/carousel layouts. The current app shows an avatar and name above the cards; headline, location and website are in the About popover. Images blocks and showcase artwork are schema-supported media, but the current app does not render that media yet: keep the introduction and text links complete, and treat any illustrated preview as a media study. On mobile, check the stacked reading order, long titles and button labels; do not depend on side-by-side comparison.

## Interview

Ask one or two questions at a time. The exact questions and unanswered-slot rules are in `recipe.json`. Ask card questions in this page order, including the pitch heading and text before retaining an action’s timing, price or other promise.

1. `displayName`, `headline`.
2. `introduction`.
3. `shopText`, `shop`, `shopHeading`.
4. `products`.
5. `visit`.
6. `contactText`, `contact`, `contactHeading`.
7. `elsewhere`.
8. `location`, `website`, `avatar`, if wanted.

Before filling any card, clear its demonstration fields and populate only answered slots. If a required answer is missing, ask once more and then omit that card; follow each optional slot’s `ifEmpty` rule. Never leave example URLs, sample quotes or invented availability in a personalized result.

## Writing rules

- Prices exactly as on their shop, with the currency.
- Product photos must be their own.
- A business address only; never a home address unless they confirm it is the shop.
- Mark seasonal or limited items as such.
- All names, claims, prices, quotations, dates and links in the sample are invented demonstration content. Replace or remove them; an unanswered slot never authorizes retaining a sample fact.
- The first text card must identify the work and audience; do not rely on the headline, location or website in the About popover.
- Feature three or four items per showcase where possible. Keep the remaining work in a linked archive; do not delete or silently rewrite the person’s history.

## Before publishing

- [ ] Prices match the shop today.
- [ ] Opening hours are current.
- [ ] Every product link opens the right product.
- [ ] The person confirmed each published email address may be public.
- [ ] Every retained sample field has been replaced or explicitly removed, including button pitches and headings.
- [ ] The first card explains the profile without opening About.
- [ ] Any upcoming dates, availability, prices and account links have been checked with the person.
- [ ] Optional-card removal leaves a sensible reading order on wide and narrow screens.
- [ ] Pictures are the person’s uploads with approved descriptions, and the page remains useful without media rendering.
