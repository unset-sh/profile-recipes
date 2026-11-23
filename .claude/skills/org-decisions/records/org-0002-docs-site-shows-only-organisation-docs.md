# org-0002. docs.unset.sh shows only the organisation's docs

Status: accepted (2026-11-22, Alex: "I want it to be from the organisation docs only", "meaning the
documentation from the app repo should not be there", "its going to be documentation coming from the repos
within the unset-sh"; his card choice at 02:49Z, "Keep it up until replaced"; and at 03:01Z, on the plan below,
"yes good that what we are going to do")

## Context

docs.unset.sh is built in `unset-sh/docs` from what other repositories push into it. Today the only thing
pushed there is the app repository's (`Undefined6799/unset`) documentation, together with the site's framework
(Hugo setup, theme, front page) and its Pages workflow, all copied from the app by the app's docs-mirror job.
The app will be largely rewritten, and the organisation's repositories are where its lasting documentation
will come from.

## Decision

1. docs.unset.sh shows documentation from `unset-sh` repositories only. The app repository's documentation
   does not belong on it, and it stops sending its docs there. Its docs stay readable in the app repository.
2. The site itself (its Hugo setup, theme, front page and Pages workflow) lives at the root of `unset-sh/docs`
   and is edited there. It holds no pages of its own.
3. Each organisation repository pushes only its own pages, into its own folder of `unset-sh/docs`, and each
   folder becomes one section of the site.
4. The switch happens once at least one organisation repository has pages ready. At that point the app
   repository stops sending and its folder comes off the site. Until then the current site stays up as it is,
   so the site is never taken offline in between.

## Consequences

- The app's ADRs, runbooks and settings pages leave the public site at the switch.
- `unset-sh/docs` is no longer only copies: its root is written by reviewed pull requests there, and only the
  source folders are pushed from other repositories.
- Planned by the docs pipeline thread, not decided by the owner, and open to change in review: each source
  repository pushes its folder with its own deploy key; at the switch the app's job is removed first and the
  `unset-sh/docs` change follows, after which the owner deletes the app's deploy key and its `docs-mirror`
  environment; the first candidates to send pages are `unset-sh/lexicons` and `unset-sh/profile-recipes`.
- Until the switch, docs.unset.sh keeps serving the app's docs, updated on every app docs merge.
