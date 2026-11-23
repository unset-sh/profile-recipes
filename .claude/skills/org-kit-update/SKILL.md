---
name: org-kit-update
description: Adopt unset-sh/agent-kit in a repository or move a repository to a newer commit of agent-kit main. Use when the daily organisation check reports a repository behind, when a newer kit should be taken, when CI fails on `sync.mjs --check`, or when someone wants to change a file under `.claude/rules/org/`, `.claude/skills/org-*` or `.claude/agent-kit/`.
---

# Update a repository's copy of agent-kit

A repository carries a copy of agent-kit as it is at one commit of its `main` branch. The kit has no releases.
`.claude/agent-kit/lock.json` records that commit and a sha256 for every copied file. The copy is never edited
by hand.

## Someone wants a rule or skill changed

Do not edit the copy. Open a pull request on `unset-sh/agent-kit` with the change. It reaches repositories
once it is reviewed and merged into the kit's `main` and each repository takes that commit, through the steps below.

## Move to a newer commit

1. Find the newest commit of the kit's `main`:
   `git ls-remote https://github.com/unset-sh/agent-kit.git refs/heads/main`. Use the full 40-character id.
2. Read what changes in behaviour between the commit in `lock.json` and the target: the kit's `CHANGELOG.md`
   at the target, and `git log <old>..<new>` in a clone of the kit.
3. On your own branch, from the repository root, run `node .claude/agent-kit/sync.mjs <commit>`. It fetches
   the kit's `main` with git, refuses a commit that is not on it, replaces the kit's files with that commit's
   and rewrites `lock.json`. It touches nothing else. Then run `node .claude/agent-kit/sync.mjs --check`; it
   must print that the copy matches.
4. Read the diff. If a changed rule conflicts with the repository's own `CLAUDE.md`, say so in the pull
   request and do not resolve it silently.
5. Open a pull request titled `Update agent-kit to <first 7 characters of the commit>`. Say which rules and
   skills changed, in one line each, and give the full commit. It is reviewed and merged like code and never
   qualifies for a docs-only merge. `--check` proves only that the copy matches its lock, not that the lock
   matches the kit, so this pull request is the control: its reviewer runs `node .claude/agent-kit/sync.mjs
   <commit>` on the branch and expects no diff.

## First adoption

1. Clone `https://github.com/unset-sh/agent-kit.git` into a folder outside the repository and pick the commit
   as in step 1 above. Check it is on `main` before running anything from it:
   `git -C <folder> merge-base --is-ancestor <commit> origin/main` must exit 0. If it does not, stop and tell
   the owner. Then `git -C <folder> checkout <commit>`.
2. From the repository root run `node <folder>/sync.mjs <commit>`. It installs the kit's files, its own copy
   at `.claude/agent-kit/sync.mjs`, and `lock.json`.
3. Add `node .claude/agent-kit/sync.mjs --check` to the repository's CI check.
4. Make sure the repository's `CLAUDE.md` starts with "Where this repository fits" and that `AGENTS.md`
   exists, both from the kit's `templates/`. Remove rules from `CLAUDE.md` that the kit's rules now state.
5. In the same piece of work, record in `repos.json` (`unset-sh/.github`) that the repository uses
   `agent-kit`.

## Formatters and line endings

The copies must stay byte for byte as committed in the kit. Keep the repository's formatter off
`.claude/rules/org/`, `.claude/skills/org-*/`, `.claude/agents/org-*` and `.claude/agent-kit/`, and make sure
Git does not rewrite their line endings (for example with `core.autocrlf` on Windows; a `.gitattributes` line
`.claude/** -text` keeps them as committed). Otherwise `--check` fails on files nobody edited.

## When the check fails

`sync.mjs --check` names each problem: a changed file, a missing file, or a file under the kit's names that
the lock does not list. Restore the copy by running step 3 with the commit already in `lock.json`. A new rule
or skill of the repository's own must not use an `org` name or live under `.claude/rules/org/`.
