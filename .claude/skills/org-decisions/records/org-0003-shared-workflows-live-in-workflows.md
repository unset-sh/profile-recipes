# org-0003. The CI check and the release workflow live in unset-sh/workflows

Status: superseded by org-0004 (2026-11-22)

## Context

`unset-sh/brand`, `unset-sh/presentation` and `unset-sh/agent-kit` each carried their own copy of the same
check job and the same release steps. The review of agent-kit before its first release (2026-11-22) found
three serious gaps in the release path, and the same file sat in the other two repositories, so each fix had
to be made and reviewed once per repository. The review also found that a release can only be checked from
outside, by verifying its attestation against the workflow that signed it, and that workflow was a file any
branch of the same repository could edit.

## Decision

1. The organisation has one repository, `unset-sh/workflows`, for the workflows several repositories run the
   same way: the check on pull requests and `main`, and the release.
2. Each repository calls those workflows at a pinned version, as it pins an action: by full commit, with the
   version in a comment. Its own workflow file keeps only when to run and what to pass in.

## Consequences

- A fix to the check or the release path is made and reviewed once, and reaches a repository when it takes
  the next version through a reviewed pull request. It does not reach it sooner.
- Whoever can change `main` of `unset-sh/workflows` can publish from every repository that calls it. That
  repository needs the same protection as any that releases: the `release` environment, release immutability
  and a ruleset on `main`, set up by the owner.
- A workflow only one repository runs stays in that repository.
- Planned by the thread that built the repository, not decided by the owner, and open to change in review:
  the release keeps the design agent-kit settled on (a raised version on `main` starts it, the workflow
  checks the `release` environment, the owner's one step is Approve, the workflow creates the tag); a
  release's attestation then names `unset-sh/workflows/.github/workflows/release.yml` as its signer, which a
  branch of the calling repository cannot edit, and the verify command in the skills changes to name it;
  repositories move one pull request each, brand and presentation first and agent-kit after its first
  release; the skills `org-release` and `org-new-repo` point to the shared workflows once a first release has
  proved them.
- Until a repository moves, it keeps its own workflow files, and what the review found applies to them.
