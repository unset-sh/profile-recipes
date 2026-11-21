# Freelancer or consultant

A profile that turns a visitor into a call. It says what they sell and roughly what it costs, backs it with proof, and puts the booking link first.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Independent consultants, freelancers and fractional executives selling their time or a defined service. Agencies with a team should start from [small business](../small-business/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Have a product decision to make? | buttons | full | filled | The one action a prospect should take. |
| 2 | How I can help | collection, list | full | outlined | What they sell, each with a format and a starting price. |
| 3 | What clients say | text | half | filled | Short testimonials, each attributed. |
| 4 | Case studies | collection, list | half | filled | Optional: Case studies, if they can share any. |
| 5 | Elsewhere | links, list | full | plain | Optional: Professional profiles. |

If the case studies card is dropped, set the testimonials card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name and who they help with what
2. `services`: what they sell; prices only if they publish them
3. `booking`: how a new client starts
4. `testimonials`, `cases`: proof they may publish
5. `elsewhere`, `location`, `website`, `avatar`.

## Writing rules

- Describe each service by the outcome for the client, not the activity.
- Publish prices only if they already publish them; "from" prices are fine.
- Testimonials are verbatim and approved by the client. Never write, merge or improve a quote.
- Name a client only if that client is named publicly elsewhere.

## Before publishing

- [ ] The booking link opens their real booking page.
- [ ] Every quote is approved by the person quoted.
- [ ] Prices match what they charge today.
- [ ] The person confirmed each published email address may be public.
