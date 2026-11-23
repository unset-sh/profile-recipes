# org-0005. AI working material lives in agent-kit

Status: accepted (2026-11-22, Alex: "all AI notes and artifact are to go in the agent repo" and
"i dont want to see random md across repos"; clarified as "all random note from ai is in the agent repo,
then well formatted human doc can go in a docs folder that exports it to the docs repo to be published
(must follow proper documentation rules)")

## Context

Work on the workflow consolidation was producing AI plans, migration notes and review evidence alongside
the code being changed. Alex wants one home for this working material, with no ad hoc task, design or
review Markdown scattered across the organisation's repositories.

`unset-sh/agent-kit` already owns the organisation's assistant resources. Its distributed bundle selects
only the shared rules, skills, agents and `sync.mjs`; storing task-specific material here does not require
shipping that material to every consuming repository.

## Decision

1. AI plans, working notes, investigations and review reports belong in `unset-sh/agent-kit`, grouped under
   `notes/<task>/`. Supporting working artifacts belong under `artifacts/<task>/`.
2. These folders are repository-owned working storage. They stay outside the distributed kit through its
   existing bundle allowlist; they are not copied into each repository's `.claude/` directory.
3. Do not create ad hoc task, design or review Markdown in consuming repositories. Maintained human
   documentation belongs in its owning repository's `docs/`, follows the shared `org-documentation`
   standard, and exports through the documentation pipeline to `unset-sh/docs` for publication. A README
   can introduce and link those guides. Product documentation and repository-owned decision records are
   not AI working notes, including when an assistant helps write them.
4. This rule does not authorise a bulk migration or deletion of historical files. Move current task notes
   deliberately, preserving useful evidence and correcting references as part of the task.

## Consequences

- A task's plan and evidence are found together in agent-kit, even when its code changes span repositories.
  Notes identify the repositories and revisions they concern so that the relationship remains clear.
- Assistant rules and ownership descriptions distinguish what agent-kit stores from what the kit ships.
  Task-specific working material may name one repository; distributed rules and skills remain generic.
- Human documentation stays close to the code its owning repository maintains. Publication exports those
  maintained sources; raw AI notes and artifacts are not published as product documentation. Consumer
  adoption of the shared documentation standard and export pipeline follows their reviewed integration.
- The existing protections for secrets, tokens and personal data apply to notes and artifacts as to code.
- Implementation choices are the task-folder names, individual filenames and which transient artifacts
  are worth retaining. The approved placement does not require keeping every temporary output.
