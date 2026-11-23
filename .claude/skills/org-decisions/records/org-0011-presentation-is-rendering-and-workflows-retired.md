# org-0011. presentation is renamed rendering, and tooling replaces workflows

Status: accepted (2026-11-23, Alex: "I did rename presentation to rendering. I think it's more suited." and "And
yes, unset slash workflow is now replaced by tooling.")

## Context

Alex renamed `unset-sh/presentation` to `unset-sh/rendering` on GitHub himself. The organisation drift check of
2026-11-23 found that nothing had caught up with the rename: the package name, README, `CLAUDE.md`, the
organisation map and org-0007 decision 5 all still say presentation, and org-0007 notes that no rename was
approved then.

The same check found that `unset-sh/workflows` returns 404 to public reads. org-0006 had expected it to remain
archived as historical provenance.

## Decision

1. The repository that renders supplied data is `unset-sh/rendering`. Its responsibilities under org-0007
   decision 5 are unchanged. Only its name changes.
2. `unset-sh/tooling` replaces `unset-sh/workflows` (org-0006). Nothing pins, links or documents
   `unset-sh/workflows` as a live repository.

## Consequences

- Update the repository's own README, `CLAUDE.md` and package metadata, and the organisation map
  (`repos.json`, `MAP.md`, the profile), to say rendering.
- Publishing the package under a new npm name is a separate release decision. Existing published versions keep
  their name, and consumers move when a release under the new name exists.
- GitHub redirects web and Git traffic for the old name. It does not redirect calls to an action hosted by the
  renamed repository, and a new repository named `presentation` would end the redirects. Use the new name in
  every pin and link.
- org-0003, org-0004 and org-0006 stay as accepted history. Their references to `unset-sh/workflows` describe
  where work used to be. This record does not establish whether that repository was deleted or made private.
- In org-0007 decision 5, read "presentation" as rendering.

GitHub's rename behaviour was checked 2026-11-23 against
[Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).
