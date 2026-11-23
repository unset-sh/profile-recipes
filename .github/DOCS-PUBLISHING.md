# Publishing the recipe documentation

`docs/` is authored here. `scripts/docs-export.ts` prepares a new `profile-recipes/` section with provenance and
licence notices. `.github/workflows/docs-mirror.yml` replaces that section in `unset-sh/docs`; the docs repository
builds and deploys the site. This workflow does not change the framework, other sections or repository settings.

## Publishing access

Follow the organisation's [Manage a documentation publishing key](https://github.com/unset-sh/.github/blob/main/docs/site/manage-docs-publishing-key.md)
guide for authorized Mac key creation, installation, verification, rotation and retirement. It also explains the
exception for explicitly approved key reuse. Keep the shared credential procedure there.

Use these values for this publisher:

| Setting | Value |
| --- | --- |
| Source repository | `unset-sh/profile-recipes` |
| Destination repository | `unset-sh/docs` |
| Exported section | `profile-recipes/` |
| Source environment | `docs-mirror` |
| Allowed deployment branch | `main` only |
| Environment secret | `DOCS_DEPLOY_KEY` |

Configure the protected environment before supplying its secret, and preserve the owner's required-reviewer policy.
The job also requires `refs/heads/main` and a push or manual event. The destination must permit the publishing key to
push `main`. The key grants repository access; this source's staged-path, outgoing-path and export-content checks
enforce the `profile-recipes/` boundary. A workflow file alone does not prove access is configured.

## Verify and release

Use Bun from `.bun-version`. From a clean, committed source checkout:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run check
bun run render
docs_stage_parent="$(mktemp -d)"
bun scripts/docs-export.ts "$docs_stage_parent/export"
```

The last command prepares files only; it has no credential or network behavior. It refuses dirty source inputs,
existing output, an output inside the source, symlinks, hardlinks and special files. `source.json` records the exact
source SHA, source/output SHA-256 digests and licences. Only Markdown under `docs/`, the existing developer preview
and the two relevant licence notices are included. Source links are frozen to that commit during export.

Before the first merge, render this exact generated section in an isolated checkout of the approved docs framework.
Run that repository's `bun run check` and `bun run build`; check the learning and understanding entries, example image,
internal links, narrow layout and both themes. Never hand-edit the export to make the build pass: fix the source and
generate it again. PR CI runs the source checks and a real dry export, but does not claim to replace the docs build.

Once setup and the docs cutover are ready, merge through the source PR and inspect **Actions → docs-mirror**. A push
with relevant input changes starts it automatically. A manual run must select `main`; queued and manual runs check
out the latest `main`, so an old event does not intentionally republish an older source revision. Validation precedes
key use. The source's `GITHUB_TOKEN` stays read-only; the destination checkout uses the environment key.

After the first push:

- Check the target commit changes only `profile-recipes/` and that `source.json.commit` matches the checked source.
- Confirm the docs repository's build and Pages deployment succeed. The first source push does not prove the site is live.
- Open `https://docs.unset.sh/profile-recipes/` and its example page. Confirm HTTPS and the current source citation.
- When replacing a publisher, complete the central guide's [old-access retirement steps](https://github.com/unset-sh/.github/blob/main/docs/site/manage-docs-publishing-key.md#5-retire-old-access-before-the-framework-merge)
  before the framework merge, including access available to historical workflow reruns.

## Keeping the section current

Review these pages when changing a recipe's interpretation, record format, schema snapshot, editor limits or renderer
support notes. Keep sample facts and the copied developer record accurate; the test suite detects drift in that record.
Do not copy app documentation into this org-only section before ownership moves. Do not add source fonts or theme CSS:
the docs framework consumes the brand package.

## Stop, recover or roll back

- **Validation/export failure:** no destination checkout has occurred. Fix the source in a PR, then rerun on `main`.
- **Missing secret or denied access:** the run stops. Check environment scope, target key write access and destination
  rules; do not add a PAT fallback or expose the key while debugging.
- **Concurrent target update:** normal pushes retry up to three times, rebasing between attempts. Before every push,
  the workflow checks the outgoing diff for paths outside `profile-recipes/` and compares the complete section to
  the generated export. A conflict, rename outside the section, or any section drift (including a rename inside it)
  stops for review. Inspect the concurrent changes and rerun from current source `main`; never force-push.
- **Bad content:** revert the source change through a PR, then export the corrected state. Do not edit only the mirror,
  because the next source run replaces it. For a fast pause, the owner can disable `docs-mirror` or remove its environment
  secret. Revoking a dedicated target key also stops writes; do not revoke a shared key without coordinating its other uses.
- **Site build failure:** inspect the docs build before declaring publication complete. Restore compatible source content
  and rerun; the site should continue serving its last successful deployment until a new one succeeds.
- **Cutover rollback:** pause this source's mirror, restore the last approved framework/deployment through the docs
  repository's reviewed process, and preserve the generated section's provenance. Re-enable publishing only after a
  successful render. Do not restore an out-of-scope app mirror as an automatic fallback.
