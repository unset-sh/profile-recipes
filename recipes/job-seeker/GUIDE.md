# Job seeker

A résumé a recruiter reads in ten seconds: the role they want, the experience that earns it, proof, and how to get in touch.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

People looking for a new role, graduates and career changers. Freelancers selling services should start from [freelancer](../freelancer/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | What I'm looking for: | text | full | filled | What role they want, where, and from when. |
| 2 | Experience | collection, list | full | outlined | Roles as a timeline, newest first. |
| 3 | Selected work | collection, grid | full | filled | Two to four case studies with a picture. |
| 4 | Let's talk | buttons | half | filled | How a recruiter gets in touch. |
| 5 | links | links, list | half | filled | Professional profiles. |

Remind them to switch the headline back, or pick another recipe, once they've found a job.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: their name, the role they want, and availability
2. `looking`.
3. `experience`.
4. `work`: only what is cleared for public sharing
5. `contact`, `profiles`, `location`, `website`, `avatar`.

## Writing rules

- Lead with what they want next, not their whole history.
- One result per role; numbers only as they give them.
- Never publish salary, age, health, family or immigration details.
- A public profile is visible to their current employer; check they are fine with that, or suggest the signedIn visibility.

## Before publishing

- [ ] Dates and titles match their CV.
- [ ] Case studies are cleared for public sharing.
- [ ] They are happy for their current employer to see the page.
- [ ] The person confirmed each published email address may be public.
