---
name: org-release
description: Prepare a release of an unset.sh repository for the owner's approval. Use when a package or release asset should be published, when asked to tag or cut a version, or when a release workflow waits or fails.
---

# Prepare a release

A release starts when a raised version lands on `main`. The release workflow checks that the `release`
environment still holds the owner's approval, builds the artefact once, and waits. The owner's one step is
Approve. The workflow then creates the tag `v<version>` at that commit, and attests and publishes the
artefact it built. Assistants prepare a release; only the owner approves it.

Releases start from `main`, never from a pushed tag: GitHub runs the workflow file of the commit a run starts
from, so a tag on an unreviewed commit brings its own release workflow. If a repository still releases from a
pushed tag, tell the owner and propose moving it to this pattern before its next release.

## Before the merge

1. Check that the repository has a `release` environment where the owner is the only required reviewer,
   "Prevent self-review" is off (the owner's merge starts the run), "Allow administrators to bypass
   configured protection rules" is off (assistants act through the owner's account, an administrator's), and
   deployment is limited to the one branch `main`. Release immutability (Settings, Releases) must be on, so a
   published release's tag and files cannot change. If any of this is missing, stop and ask the owner to set
   it up. Assistants do not create or change it. The release workflow checks the environment before it builds.
2. Decide the version. Major: something consumers rely on changed meaning or was removed. Minor: something
   was added. Patch: a fix with no change for consumers.
3. In one pull request, raise the version in the repository's manifest and give the changelog entry that
   version. The entry says what changes for consumers, in plain words. This change reaching `main` is what
   starts the release, so no other pull request raises the version.
4. Where the repository requires a review record before a release, a separate thread writes it from the full
   diff since the last release. The author of the changes does not review them. Where releases are promoted
   from `staging`, the review covers the difference between `main` and the `staging` commit to be promoted;
   the promotion pull request names that commit, and nothing else merges into `staging` before it.
5. Merge by the repository's rule. Where pull requests land on `staging`, the release run starts when the owner
   merges `staging` into `main`; otherwise the merge to `main` starts it.

## While it waits

6. Tell the owner the release waits for approval, with a link to the workflow run. The run's summary shows
   the commit, the changes since the last push and the changelog entry.

## After approval

7. Check that the release page holds the artefact and that its attestation names the release workflow on
   `main`: `gh attestation verify <file> --repo <owner>/<repo> --signer-workflow
   <owner>/<repo>/.github/workflows/release.yml --source-ref refs/heads/main`. `--repo` alone accepts any
   workflow of the repository on any branch, and a workflow on a pushed branch can publish without the
   environment. Until a first release has proved these steps in a repository, say they are unverified.
8. Consumers take the release by an exact version, each in its own pull request.

## Never

- Never push a `v*` tag by hand, and never move, delete or reuse one. A bad release is fixed by a new version.
- Never publish from a branch, a fork or a local machine.
- Never approve, bypass or remove the approval step, and never add a stored token to make publishing work.
