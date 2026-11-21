# Musician or band

A profile that gets people listening. The newest release leads, the catalogue shows as cover art, and tour dates sit where fans look for them.

Read [AGENTS.md](../../AGENTS.md) first: it holds the rules for every recipe. This guide adds what is specific here.

## Who this is for

Solo artists, bands, DJs, producers and composers. Music podcasts should start from [podcaster](../podcaster/GUIDE.md).

## The layout

| # | Card | Kind | Width | Surface | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | “Undertow” is out now | buttons | full | filled | The newest release and where to hear it. |
| 2 | Releases | collection, carousel | full | plain | Albums, EPs and singles with cover art, newest first. |
| 3 | On tour | collection, list | full | outlined | Optional: Upcoming shows with ticket links. |
| 4 | Listen | links, list | half | filled | Every place to listen and follow. |
| 5 | Booking and press | buttons | half | filled | Booking and press contacts. |

Drop the tour card between tours rather than leaving it empty. If the booking card is dropped, set the listen card's `width` to `full`.

## Interview

Ask in this order, one or two questions at a time. Each name is a slot in `recipe.json`, which holds the exact question.

1. `displayName`, `headline`: the artist or band name and their newest news
2. `latest`.
3. `releases`: they upload the cover art
4. `tour`: upcoming shows only
5. `listen`, `booking`, `location`, `website`, `avatar`.

## Writing rules

- Titles exactly as released, including capitalisation and punctuation.
- Tour dates in one format throughout (day month year), with the city.
- Say sold out when it is; never invent a support act or venue.
- Cover art must be theirs to publish.

## Before publishing

- [ ] Every ticket link opens the right show.
- [ ] No past dates are listed.
- [ ] Cover art is uploaded and has alt text.
- [ ] The person confirmed each published email address may be public.
