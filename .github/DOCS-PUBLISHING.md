# Publishing the recipe documentation

`docs/` is authored here. `scripts/docs-export.ts` prepares a new `profile-recipes/` section with provenance and
licence notices. `.github/workflows/docs-mirror.yml` replaces that section in `unset-sh/docs`; the docs repository
builds and deploys the site. This workflow does not change the framework, other sections or repository settings.

## Before the first run

Alex configures the publishing credential and environment. Do this before merging or manually running the mirror.
The settings are not created by this pull request, and a workflow file is not evidence that they exist.

1. In `unset-sh/profile-recipes` → **Settings → Environments**, create `docs-mirror`. Set **Deployment branches and
   tags → Selected branches and tags** to the branch `main` only. Keep any required-reviewer policy chosen by the owner.
   The job's `if` guard also requires `refs/heads/main` and a push or manual event.
2. On the owner's machine, generate a dedicated Ed25519 key for this source. Do not reuse an account key or the
   retiring app mirror's credential. Keep the private key out of the repository, logs and chat. For example:

   ```sh
   docs_key_dir="$(mktemp -d)"
   chmod 700 "$docs_key_dir"
   ssh-keygen -t ed25519 -N '' -C 'profile-recipes docs-mirror' -f "$docs_key_dir/docs-mirror"
   ```

3. In `unset-sh/docs` → **Settings → Deploy keys**, add the `.pub` file as **profile-recipes docs-mirror**, with
   **Allow write access** enabled. The target is `unset-sh/docs`, not this source repository.
4. In the source's `docs-mirror` environment, add the private key as the environment secret **`DOCS_DEPLOY_KEY`**.
   This is the only publishing secret name used. The existing app's secret is not inherited. If using `gh`, this
   reads the file directly rather than putting its contents in command arguments:

   ```sh
   gh secret set DOCS_DEPLOY_KEY --repo unset-sh/profile-recipes --env docs-mirror < "$docs_key_dir/docs-mirror"
   ```

5. Confirm the destination's rules permit this dedicated key to push `main`. Do not weaken unrelated rules. A deploy
   key grants repository access, not a server-enforced path restriction; the reviewed exporter and staged-path check
   enforce this workflow's `profile-recipes/` boundary. Keep the environment restricted and review workflow changes.
6. Retain or remove the local key files according to the owner's secret-storage policy. Do not print the private key.

References: [GitHub deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys)
and [environment protection](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

## Verify and release

Use Node from `.nvmrc`. From a clean, committed source checkout:

```sh
npm ci --ignore-scripts
npm run check
npm run render
docs_stage_parent="$(mktemp -d)"
node scripts/docs-export.ts "$docs_stage_parent/export"
```

The last command prepares files only; it has no credential or network behavior. It refuses dirty source inputs,
existing output, an output inside the source, symlinks, hardlinks and special files. `source.json` records the exact
source SHA, source/output SHA-256 digests and licences. Only Markdown under `docs/`, the existing developer preview
and the two relevant licence notices are included. Source links are frozen to that commit during export.

Before the first merge, render this exact generated section in an isolated checkout of the approved docs framework.
Run that repository's `npm run check` and `npm run build`; check the learning and understanding entries, example image,
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
- Retire the old app mirror and revoke its separate target key as part of the owner-managed cutover, after checking
  no remaining workflow needs it. Do not revoke this source's key by mistake.

## Keeping the section current

Review these pages when changing a recipe's interpretation, record format, schema snapshot, editor limits or renderer
support notes. Keep sample facts and the copied developer record accurate; the test suite detects drift in that record.
Do not copy app documentation into this org-only section before ownership moves. Do not add source fonts or theme CSS:
the docs framework consumes the brand package.

## Stop, recover or roll back

- **Validation/export failure:** no destination checkout has occurred. Fix the source in a PR, then rerun on `main`.
- **Missing secret or denied access:** the run stops. Check environment scope, target key write access and destination
  rules; do not add a PAT fallback or expose the key while debugging.
- **Concurrent target update:** normal pushes retry up to three times, rebasing between attempts. A rebase conflict
  stops for review. Inspect both sections and rerun from current source `main`; never force-push.
- **Bad content:** revert the source change through a PR, then export the corrected state. Do not edit only the mirror,
  because the next source run replaces it. For a fast pause, the owner can disable `docs-mirror`; removing its environment
  secret or revoking its dedicated target key also stops future writes.
- **Site build failure:** inspect the docs build before declaring publication complete. Restore compatible source content
  and rerun; the site should continue serving its last successful deployment until a new one succeeds.
- **Cutover rollback:** pause this source's mirror, restore the last approved framework/deployment through the docs
  repository's reviewed process, and preserve the generated section's provenance. Re-enable publishing only after a
  successful render. Do not restore an out-of-scope app mirror as an automatic fallback.
