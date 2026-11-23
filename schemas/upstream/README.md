# Vendored upstream Lexicon schemas

These are exact copies from [unset-sh/lexicons](https://github.com/unset-sh/lexicons/tree/52cfb6990f3833e4bdd260cd5bb520fc4446e122/lexicons)
at commit `52cfb6990f3833e4bdd260cd5bb520fc4446e122`. Recipes and tooling follow this contract; this repository does not edit or publish it.
Sample records live under [recipes/](../../recipes/).

[source.json](source.json) records the source commit, paths, inventory and copied-file hashes. [LICENSE](LICENSE)
retains the upstream MIT notice. The source repository also records its original application provenance.

The nine inputs are `sh.unset.profile`, `sh.unset.page`, `sh.unset.card`, five `sh.unset.block.*` content definitions
and `sh.unset.block.defs`. The OAuth permission set `sh.unset.authFull` is not needed to validate recipe records.
Identity is on the profile; card references and visibility are on the page. The main page uses record key `self`.

GitHub availability does not prove DNS/PDS publication. See the source repository's
[publication guide](https://github.com/unset-sh/lexicons/blob/52cfb6990f3833e4bdd260cd5bb520fc4446e122/docs/publication.md).
Compatibility applies after public adoption too: new fields must be optional and existing types and limits must
remain compatible under the [Lexicon evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution).

The validator also applies stricter sample rules and separately pinned [editor limits](../../limits.json).
Unknown sample fields and union members are rejected to catch template mistakes; the protocol permits extensions.
Passing schema validation does not prove display support. The README names the checked app consumer revision.

Follow [CONTRIBUTING.md](../../CONTRIBUTING.md#when-the-app-changes) to update the snapshot and its consumers together.
