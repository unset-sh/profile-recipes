# Coach or teacher

A profile that makes the first step easy. A free intro leads, offers show what they cost, and the schedule answers "when can I come?".

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Coaches, tutors, language teachers, and yoga or movement teachers working with individuals. Consultants selling to companies should start from [freelancer](../freelancer/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Not sure where to start? | buttons | full | filled | The main ask: a free intro. |
| 2 | Ways to work with me | collection, list | full | outlined | Ways to work with them, each with a format and price. |
| 3 | This term | text | half | filled | The regular schedule. |
| 4 | What runners say | text | half | filled | Optional: Optional: what students say. |
| 5 | links | links, grid | full | plain | Optional: Where to follow them. |

If the quotes card is dropped, set the schedule card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name, what they teach and for whom
2. `offers`.
3. `start`.
4. `schedule`, `voices`.
5. `elsewhere`, `location`, `website`, `avatar`.

## Writing rules

- Describe offers by what the student gets.
- Avoid health, income or outcome promises; describe the work, not guaranteed results.
- Student quotes are verbatim and approved; first names are fine.
- Meeting places are public venues only.

## Before publishing

- [ ] Prices and schedule are current.
- [ ] Every quote is approved by the student.
- [ ] No outcome is promised.
- [ ] The person confirmed each published email address may be public.
