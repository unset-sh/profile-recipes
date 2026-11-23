# unset.sh organisation rules

These rules hold in every unset.sh repository. They are a copy of `rules/org.md` in `unset-sh/agent-kit`: change
them there, never in this copy. A repository's own `CLAUDE.md` adds its own rules and names any exception.

## Licence

- The owner sets each repository's licence and decides any change to a published one; where none is set, ask.
  Product repositories are AGPL-3.0-only and take no outside code for now. Others' work keeps its own licence.
- Work made to be copied stays permissive (`profile-recipes` recipes CC0-1.0, lexicon schemas MIT) and takes
  outside work with a DCO sign-off only. Propose no contributor licence agreement or other signing step.
- The copyright line is `Copyright (c) 2026 Alex (Undefined6799)`.

## The owner

- The owner is named only as "Alex" or by the GitHub login `Undefined6799`. Their surname never appears: not in
  code, docs, commits, licence lines or package metadata.

## Repositories

- One job per repository. Read <https://github.com/unset-sh/.github/blob/main/MAP.md>
  before moving work between repositories or starting work that might belong elsewhere.
- What one repository takes from another comes pinned: an exact package version, a release asset, or a full
  commit (a reusable workflow, or anything with no release yet). A copy of another repository's files needs a pin
  and a check that it still matches; the pushes the map records (the docs push, the lexicon mirror) are exceptions.
- Generate maps from authoritative sources and refresh them automatically through shared tooling. Follow
  `org-map-maintenance` for registration, source evidence, freshness, failure handling and meaning review.
- For missing shared design tokens or brand assets, follow `org-brand-request`: open or update a concrete
  request in `unset-sh/brand` issues. The requester/provider handoff instructions live in agent-kit.
- Never create, rename, archive or change the visibility of an org repository without the owner's approval for it.
- When a change adds, removes or moves a responsibility, or changes what a repository uses or ships, update
  `repos.json` in `unset-sh/.github` in the same piece of work.
- Do not design a new repository around the current app (`Undefined6799/unset`). The app will be largely
  rewritten and connected to the organisation's repositories afterwards.

## Decisions

- Organisation decisions live in agent-kit, in the skill `org-decisions`; read it before changing an
  organisation-wide decision. Never add or edit an ADR in the app repository for organisation work.
- An accepted decision record is never edited, only superseded by a new one.
- Store all AI working plans, drafts, task notes and review reports only in `unset-sh/agent-kit:notes/<task>/`,
  and supporting artifacts only in `artifacts/<task>/` there, outside the kit (org-0005), never across repos.
- Maintain human docs in their owner's `docs/` and export them to `unset-sh/docs`. A docs folder is not storage
  for AI working material. This rule does not authorise bulk moves or deletions.

## Releases

- Production is `main`; the owner's merge into it decides a release (org-0010). Never bypass, remove or weaken a
  `release` approval without his decision. After his merge, agents may approve brand or rendering; never a
  production deploy or lexicon publication unless he authorised it (org-0012). Never move or reuse a release tag.
- Pin dependencies to exact versions and GitHub Actions to full commit SHAs.
- A new version of an `@unset-sh` package may be taken at once. Third-party packages keep the 7-day wait.

## Keys, tokens and secrets

- Assistants never create, read, copy, place or rotate a deploy key, a private key or a token that can write.
  The owner does that by hand. A read-only token used only to pull packages is fine.
- Secrets and users' personal data never appear in code, logs, commits, pull requests or chat.
