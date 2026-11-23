# org-0004. Organisation workflows live in unset-sh/.github

Status: superseded by org-0006; originally accepted (2026-11-22, Alex: "yes but its makes sense that workflows live in the .github", then
"WHY DONT WE USE a folder layout similar to this inside .github?", referring to actions/starter-workflows;
after the category-source and generated-entry-point layout was explained, "yes ok well lets build this
then, we are going to get rid of the workflows repo")

## Context

Org-0003 placed reusable checks and releases in a separate `unset-sh/workflows` repository. Alex chose to
keep organisation automation in `unset-sh/.github` instead, organised by purpose like
[actions/starter-workflows](https://github.com/actions/starter-workflows). At the time of this decision, the
separate repository's main branch contains only its README; its implementation is still in
[pull request 1](https://github.com/unset-sh/workflows/pull/1). Existing organisation repositories have not
adopted those workflows.

The repository name `.github` and its inner `.github/` directory have different roles. GitHub requires
executable workflow files directly in the inner `.github/workflows/` directory, while organisation starter
templates go in the repository-root `workflow-templates/` directory. These constraints were checked in
[GitHub's reusable workflow guide](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
and [template guide](https://docs.github.com/en/actions/how-tos/reuse-automations/create-workflow-templates)
on 2026-11-22.

## Decision

1. `unset-sh/.github` owns the organisation's workflow implementations and their supporting scripts,
   checks and documentation, including implementations used by only one repository. It continues to own
   the organisation profile, repository map and community files. This supersedes org-0003.
2. Workflow sources are grouped by purpose at the repository root, such as `ci/`, `releases/`, `pages/`,
   `automation/` and `code-scanning/`. Folders appear when they have an implementation to hold. Starter
   caller sources live under `templates/`.
3. A generation step writes committed executable workflows under `.github/workflows/` and picker
   templates under `workflow-templates/`. Category files are the source of truth; generated files are not
   edited by hand. CI verifies that the generated files match their sources.
4. Each consuming repository keeps small caller files defining its events, permissions and inputs, and
   calls a reviewed central workflow by full commit. Its own product code, build and test commands,
   Dockerfiles, dependency locks and configuration remain there.
5. Retire the separate `unset-sh/workflows` repository after preserving its implementation and review
   history, reconciling references, and checking that no consumer depends on it. Existing consumers stay
   on working workflows until their individual migration is verified.

## Consequences

- One repository holds organisation automation, with category folders for authors and flat generated
  entry points for GitHub. The generation check is an additional maintenance responsibility.
- Reusable calls run in each caller's context. Storing a workflow centrally does not automatically enable
  it everywhere; each repository needs a caller. A coordinator that triggers organisation-wide runs is a
  separate capability and is not required by this decision.
- Release and verification contracts remain explicit. Moving the implementation changes its expected
  signer identity; update a consumer's verification references with its adoption, after a real release
  proves the new path. Do not broaden verification to accept any signer or change it ahead of adoption.
- Existing release approvals and least-privilege requirements remain in force. Consolidation does not
  authorise weakening them or changing secrets, release settings or access controls.
- Update the organisation map, pending ownership documentation and workflow callers as part of the
  migration. An existing accepted record is preserved; org-0003 changes only its status.
- Implementation judgments: exact filenames, generation mechanics and rollout order are chosen and
  tested in the migration pull requests. Archiving the old repository after cutover preserves its review
  links; this record does not claim it has already been archived or that consumers have migrated.
