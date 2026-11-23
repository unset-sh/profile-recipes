# org-0001. Decision records live in agent-kit

Status: accepted (2026-11-22, Alex: "I think decision can live in the agent kit.." and "the decision are mostly
for agent anyway so it is ai ressource no")

## Context

The organisation needed its own set of decision records, separate from the app's ADRs, which stay as they
are. Until now there was no home for them, and the rules told assistants to ask the owner where a decision
goes. The records are read mostly by assistants working in the organisation's repositories, which is what
`unset-sh/agent-kit` exists to serve.

## Decision

Organisation decision records live in `unset-sh/agent-kit`, under `skills/org-decisions/records/`, one
Markdown file per record, numbered org-0001 onwards so they never read as the app's ADR numbers. They ship
inside each kit release as the skill `org-decisions`, so every repository carries the records of the kit
version it pins, and an assistant reads them on demand rather than in every session.

## Consequences

- A new or superseding record reaches a repository only when that repository takes the next kit release,
  through a reviewed pull request. Which decisions a repository was working under is visible from its lock.
- Records are plain text a person can review in a diff, like everything else the kit ships, and they use no
  line of the always-loaded rule budget.
- Records follow the kit's licence (AGPL-3.0-only).
- The copy in each repository is checked like every kit file: `sync.mjs --check` in its CI fails on a local
  edit, so a repository cannot drift from the released records.
- A repository's own decisions stay in that repository. The map's entry for agent-kit names this folder as
  where the organisation's decisions are.
