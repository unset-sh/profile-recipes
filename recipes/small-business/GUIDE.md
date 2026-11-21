# Small business or maker

A profile that sells. The shop button leads, bestsellers show with photos and prices, and visitors find hours and an address without hunting.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Makers, craft studios, independent shops, cafés and small online brands. Solo artists selling originals should start from [artist](../artist/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | The spring collection is in | buttons | full | filled | The main ask: shop. |
| 2 | Bestsellers | collection, grid | full | plain | Three to nine products with photos and prices. |
| 3 | Visit the studio | text | half | filled | Opening hours and address. |
| 4 | Wholesale and custom orders | buttons | half | filled | Optional: Wholesale and custom orders. |
| 5 | links | links, grid | full | outlined | Optional: Social accounts and marketplaces. |

If the contact card is dropped, set the visit card's `width` to `full`. An online-only business drops the visit card.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: the business name and what it makes or sells
2. `shop`.
3. `products`: they upload the photos
4. `visit`, `contact`.
5. `elsewhere`, `location`, `website`, `avatar`.

## Writing rules

- Prices exactly as on their shop, with the currency.
- Product photos must be their own.
- A business address only; never a home address unless they confirm it is the shop.
- Mark seasonal or limited items as such.

## Before publishing

- [ ] Prices match the shop today.
- [ ] Opening hours are current.
- [ ] Every product link opens the right product.
- [ ] The person confirmed each published email address may be public.
