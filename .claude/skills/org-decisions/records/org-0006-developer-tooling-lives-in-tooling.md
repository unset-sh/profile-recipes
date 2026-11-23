# org-0006. Shared developer tooling lives in unset-sh/tooling

Status: accepted (2026-11-22, Alex: "I would put the maintained CI implementations there and keep `.github`
focused on organization metadata and community defaults"; after a public `unset-sh/tooling` repository was
recommended and the destination was checked, "Create unset-sh/tooling (recommended)")

## Context

Org-0004 put shared workflow implementations in `unset-sh/.github`. That implementation and the organisation
defaults are still under review in [pull request 6](https://github.com/unset-sh/.github/pull/6); no central
release or consumer adoption has taken place. The previous `unset-sh/workflows` repository is archived and
retains its original implementation proposal and review history.

Alex chose a dedicated developer-tooling repository so maintained automation can have its own ownership and
release lifecycle while `.github` remains the home of organisation metadata and community defaults. The
destination must be settled before relocating the proposed work or installing consumer references.

GitHub permits reusable workflows in a suitable repository, directly under `.github/workflows/`, with
`workflow_call`. Nested workflow directories are unsupported, and public consumers need a public source.
These constraints were checked against GitHub's [reuse guide](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
and [reuse reference](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations)
on 2026-11-22.

## Decision

1. Create the public `unset-sh/tooling` repository. It owns maintained shared CI, release and deployment
   workflow implementations, their supporting scripts and their tests. This supersedes org-0004's placement
   of those implementations in `.github`.
2. `unset-sh/.github` retains the organisation profile, repository map, community policies and forms,
   workflow-picker templates, and local checks for the metadata it owns. It does not become the shared
   tooling release repository. A template offered there calls tooling at a reviewed full commit.
3. Each consumer retains small caller files specifying events, permissions and inputs. Its product code,
   check/build logic, dependency locks and configuration stay in the repository that owns them. Reusable
   calls use pinned tooling revisions and run in the consumer's context with its permitted access.
4. The purpose-based workflow catalogue may remain in tooling, with generation producing committed flat
   entry points in tooling's `.github/workflows/`. Supporting scripts can be organised by shared purpose
   or consumer outside that reserved directory. Generation must remain deterministic and checked.
5. Automatic adoption is an explicit pipeline: tooling release, consumer pin-update pull request, required
   checks and approvals, eligible automatic merge, and downstream delivery. Dependabot can update reusable
   workflow references; a release-triggered updater can shorten propagation time. Those capabilities must
   be configured and verified, not inferred from moving the code. Existing owner approvals for publishing
   a release remain required.
6. Maintained human documentation stays with its owner under `docs/`, using the documentation standard and
   its export to `unset-sh/docs`. Tooling documentation exports to the `tooling/` section; `.github`'s own
   documentation retains the `github/` section-name exception. AI working notes and artifacts remain in
   agent-kit under org-0005 and outside the distributed kit.

## Consequences

- Split the pending `.github` proposal along these responsibilities, preserving its useful community setup
  and the tested automation implementation. Update the organisation map, ownership rules, docs exports,
  starter templates and the expected release signer path together.
- No source release or consumer migration is implied by repository creation. Keep consumers' working
  automation until each reviewed migration verifies its checks and outputs. Update attestation verification
  with adoption of the actual tooling release; do not broaden it to accept any signer.
- The archived workflows repository remains historical provenance. This decision chooses a new repository;
  it does not authorise deletion of that history or reuse of old release tags.
- Automatic updates, merging and delivery are separate controls. Required checks, repository rules and
  release approval gates still apply. A custom updater also needs verified credentials and event propagation;
  a successful dependency-update pull request does not prove a downstream deployment occurred.
- Exact filenames, script grouping, generation details and rollout order are implementation choices to
  review in the migration. No new writable credential or change to protected release settings is authorised
  by the repository-location choice alone.
- Preserve accepted history: org-0004 changes only its status; org-0005 remains in force. The new decision
  reaches installed consumers through a later approved kit release.

The update and merge distinction follows GitHub's [Dependabot automation guide](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/automate-dependabot-with-actions),
checked 2026-11-22. This record does not claim that automatic adoption or downstream delivery is already running.
