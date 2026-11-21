# Developer

A profile that shows work before words. Projects come first as a grid, then a short note on the stack, then talks and writing.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Software engineers, open-source maintainers, data and ML engineers. If they are job hunting right now, start from [job seeker](../job-seeker/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | Projects | collection, grid | full | filled | Three to six projects they want to be known for. |
| 2 | Day to day: | text | half | filled | What they work in and what they are learning. |
| 3 | Open to contract work | buttons | half | filled | Optional: Optional: how to reach them for work. |
| 4 | Talks and writing | collection, list | full | outlined | Optional: Talks and posts. |
| 5 | Find me | links, grid | full | plain | Code hosts and social accounts. |

If the contact card is dropped, set the stack card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name and the kind of engineering they do
2. `projects`: projects they want to be known for
3. `stack`.
4. `contact`: whether they take work
5. `writing`, `code`, `location`, `website`, `avatar`.

## Writing rules

- Copy project names exactly; describe what a project does, not how clever it is.
- List only projects they own or meaningfully contributed to, and say which.
- No skill bars, ratings or years-per-language.
- Keep the stack card short: a reader scans it in five seconds.

## Before publishing

- [ ] Every project link opens the right repository.
- [ ] Licences in tags match the repositories.
- [ ] The person confirmed each published email address may be public.
