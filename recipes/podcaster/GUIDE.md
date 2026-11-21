# Podcaster

A profile that turns a visitor into a listener. Follow buttons first, then episodes worth starting with, then the doors for guests and sponsors.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Independent podcasters, interview hosts and audio documentary makers. If their work is mainly video, start from [creator](../creator/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | New episodes every Tuesday | buttons | full | filled | The main ask: follow the show. |
| 2 | Latest episodes | collection, list | full | outlined | The three to six latest or best episodes. |
| 3 | Listen anywhere | links, list | half | filled | Every platform the show is on. |
| 4 | Be a guest or sponsor | buttons | half | filled | How guests and sponsors get in touch. |
| 5 | About the host. | text | full | plain | Optional: Optional: about the host. |

The profile can be the show or the host. Use the show's name and artwork when the show is the brand.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: the show (or host) name and what the show is about
2. `follow`.
3. `episodes`: good starting points, not only the newest
4. `listen`.
5. `guests`, `host`, `website`, `avatar`.

## Writing rules

- Episode titles and numbers exactly as published.
- Credit guests the way the episode credits them.
- Say how the show is funded if it takes sponsors.
- No download numbers or chart positions: they go stale.

## Before publishing

- [ ] Every follow link opens the show, not an episode.
- [ ] Episode links are current.
- [ ] The person confirmed each published email address may be public.
