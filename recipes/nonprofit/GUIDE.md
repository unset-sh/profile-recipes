# Nonprofit or community organiser

A profile that turns a visitor into a supporter. Donate and volunteer come first, then what the group does, how it spends money, and when to show up.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Charities, nonprofits, community groups, mutual-aid networks and grassroots campaigns. Companies with a social mission that sell products should start from [small business](../small-business/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Help us feed 400 families a week | buttons | full | filled | The main asks: donate and volunteer. |
| 2 | What we do | text | half | filled | The mission and what they do, in plain words. |
| 3 | Where the money goes | text | half | filled | Optional: Optional: where the money goes. |
| 4 | Come along | collection, list | full | outlined | Upcoming events and regular sessions. |
| 5 | Get in touch | links, grid | full | plain | Contact and social accounts. |

If the money card is dropped, set the mission card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: the organisation's name and what it does
2. `support`.
3. `mission`, `money`: figures only from published accounts
4. `events`.
5. `contact`, `location`, `website`, `avatar`.

## Writing rules

- Every impact claim must come from the organisation's own published figures.
- Donation links go only to the organisation's own or its official fundraising page.
- Never name the people they help; venues are public places.
- Use the registered name and number exactly.

## Before publishing

- [ ] The donate link reaches the official donation page.
- [ ] Figures match the latest published accounts.
- [ ] Events are current.
- [ ] No beneficiary is identifiable.
