# Vendored upstream Lexicon schemas

These JSON files are actual AT Protocol Lexicon documents copied from
[Undefined6799/unset](https://github.com/Undefined6799/unset/tree/0dd079517074917ebd5217f7ecf15f4984cdd5d3/shared/lexicons/schemas)
at commit `0dd079517074917ebd5217f7ecf15f4984cdd5d3`. They are validation dependencies, not recipe examples and not
definitions authored or published by this repository. The sample records live in [recipes/](../../recipes/).

[source.json](source.json) records the exact repository, source path, commit, copy date and file list.
[LICENSE](LICENSE) is copied from upstream's `shared/lexicons/LICENSE`.
Preserve the schema files and their NSIDs exactly; propose definition changes upstream.

The snapshot contains `sh.unset.profile`, `sh.unset.card`, five `sh.unset.block.*` content definitions and shared
`sh.unset.block.defs`. It supersedes the older `sh.unset.section` and `sh.unset.defs` snapshot.
The upstream [published lock](https://github.com/Undefined6799/unset/blob/0dd079517074917ebd5217f7ecf15f4984cdd5d3/shared/lexicons/published.lock.json)
is empty at this commit, so all these definitions are drafts.

The validator checks schema shape plus the repository's stricter sample rules and the editor limits in
[limits.json](../../limits.json). Unknown fields and union members are rejected here to catch template mistakes,
although the protocol allows extensions. Passing validation does not establish that the current app editor or
renderer supports every schema feature. See the root README's app support notes.

Follow [CONTRIBUTING.md](../../CONTRIBUTING.md#when-the-app-changes) when refreshing this snapshot.
