# Artist or illustrator

A profile where the work does the talking. The gallery has no frame around it; text comes after and ends with how to commission a piece.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Illustrators, painters, printmakers, concept and comic artists. Photographers should start from [photographer](../photographer/GUIDE.md); studios selling many products from [small business](../small-business/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Work | gallery | full | plain | Six to twelve pieces that show their range. |
| 2 | Commissions open | buttons | half | filled | How commissions work and how to start one. |
| 3 | Prints and shop | links, list | half | filled | Optional: Optional: where to buy prints or originals. |
| 4 | About | text | full | filled | Process, clients and what a commission costs. |

If the shop card is dropped, set the commissions card's `width` to `full`. If they are closed to commissions, keep the card with heading "Commissions closed" and a mailing-list link, or drop it.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name and what they make
2. `work`: they upload the pieces
3. `commissions`.
4. `shop`.
5. `about`, `location`, `website`, `avatar`.

## Writing rules

- Alt text describes what is in each piece, from the artist's own words.
- Captions give title, medium, and client or year; nothing more.
- Show only work they have the right to publish, including client work.
- Prices only as "from" figures they already use.

## Before publishing

- [ ] Every piece has alt text.
- [ ] Client work is cleared for portfolio use.
- [ ] The commission status is current.
- [ ] The person confirmed each published email address may be public.
