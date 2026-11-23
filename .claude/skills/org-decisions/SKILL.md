---
name: org-decisions
description: The unset.sh organisation's decision records, and how to add one. Read before deciding anything that may already be settled for every repository (licences, repository layout, releases, keys and tokens, commit identity, how repositories meet), before proposing a new organisation-wide rule, or when asked to record a decision the owner made.
---

# Organisation decisions

The organisation's decision records live in `unset-sh/agent-kit`, in this skill's `records/` folder, and every
repository carries the records of the kit version it pins. They are for organisation-wide decisions. A
repository's own decisions stay in that repository, and the app's ADRs (`Undefined6799/unset`) are never used
for organisation work.

## Records

| Record | Decision |
| --- | --- |
| [org-0001](records/org-0001-decision-records-live-in-agent-kit.md) | Decision records live in agent-kit and ship with each kit release |
| [org-0002](records/org-0002-docs-site-shows-only-organisation-docs.md) | docs.unset.sh shows only docs from `unset-sh` repositories; the current site stays up until replaced |
| [org-0003](records/org-0003-shared-workflows-live-in-workflows.md) | Superseded by org-0004; originally placed shared workflows in `unset-sh/workflows` |
| [org-0004](records/org-0004-workflows-live-in-github.md) | Superseded by org-0006; originally placed organisation workflow implementations in `unset-sh/.github` |
| [org-0005](records/org-0005-ai-working-material-lives-in-agent-kit.md) | AI working notes and artifacts live in agent-kit, grouped by task and excluded from the kit |
| [org-0006](records/org-0006-developer-tooling-lives-in-tooling.md) | Shared developer tooling lives in public `unset-sh/tooling`; `.github` retains organisation metadata and community defaults |
| [org-0007](records/org-0007-backend-web-and-deployment-boundaries.md) | Backend, web and deployment have separate ownership; capability contracts and runtime-appropriate adapters replace the server-kit and standalone messaging proposals |
| [org-0008](records/org-0008-brand-requests-use-issues.md) | Brand requests use issues; shared handoff instructions and AI working material live in agent-kit |
| [org-0009](records/org-0009-maps-refresh-through-shared-tooling.md) | Maintained maps refresh automatically through shared tooling; human meaning remains reviewed |
| [org-0010](records/org-0010-staged-delivery-on-main.md) | Work enters `staging` and only a person promotes it to `main`, which then releases on its own; tooling, agent-kit, `.github` and docs work on `main` alone, with no releases |
| [org-0011](records/org-0011-presentation-is-rendering-and-workflows-retired.md) | `presentation` is renamed `rendering`; `unset-sh/tooling` replaces `unset-sh/workflows` |
| [org-0012](records/org-0012-release-approvals-and-lexicon-drafts.md) | Agents may press Approve for brand and rendering; never for a production deploy or lexicon publication unless Alex authorised it; lexicon drafts stay on lexicons `staging`, off the network |
| [org-0013](records/org-0013-agents-manage-agent-kit.md) | Agents merge agent-kit pull requests into `main` after a separate review; every other repository keeps org-0010 |

## Before you decide something

1. Read the table above. If a record covers the question, follow it. If it looks wrong, say so with the
   evidence, as the working rules ask, and leave the record as it is until the owner decides.
2. A record that is superseded names the record that replaced it. Follow the newest one.

## Adding a record

1. Only the owner decides. A record states a decision the owner made, with the owner's own words and the
   date, or it is a proposal waiting for the owner. Never record your own judgment as a decision.
2. Open a pull request on `unset-sh/agent-kit` that adds `records/org-NNNN-<short-title>.md`, with the next
   free number, and adds its row to the table above. Copy the layout of an existing record:
   - a title line `# org-NNNN. <decision in a few words>`;
   - a `Status:` line: `proposed`, `accepted (date, the owner's words)` or `superseded by org-NNNN`;
   - **Context**: what forced a choice; **Decision**: what was decided; **Consequences**: what follows,
     including what it costs.
3. An accepted record is never edited. A later record supersedes it, and the only change to the old one is
   its status line.
4. The decision reaches repositories with the next kit release. Note it in `CHANGELOG.md` under "Unreleased".
