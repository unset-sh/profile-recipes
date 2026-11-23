---
title: Understand a recipe
description: Follow the manifest, records and checks without confusing recipe policy with protocol or app behavior.
weight: 20
params:
  doc_kind: explanation
---

A recipe is a preparation format. It says what to ask, where answers go and how cards should read together. It is not
a schema authority, a rendering engine or permission to publish.

## From a recipe to a profile

```text
recipe.json + GUIDE.md
  audience, questions, writing rules and card order
                    |
                    v
profile.json + page.json + cards/*.json + assets/
  invented records and local sample pictures
                    |
                    v
validator + pinned schemas + editor limits
  check the repository's sample policy
                    |
                    v
person's answers -> reviewed content -> person uses the app editor
```

The manifest's `cards` array defines reading order. Filenames are stable identifiers: `02-stack.json` can come before
`01-projects.json`. Each slot identifies a file and a [JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901), then supplies
the question, writing guidance, required flag and optional-answer behavior.

The samples are `sh.unset.profile`, `sh.unset.page` and `sh.unset.card` records. The profile holds identity;
the main page (`self`) holds visibility and the references to the cards it shows. A card's `content.$type` selects a `sh.unset.block.*`
definition, such as `sh.unset.block.text`. The developer example [walks through that relationship](developer-example/index.md).

## Where the boundaries are

| Owner | Owns | Boundary |
| --- | --- | --- |
| `profile-recipes` | Layout intent, interview guidance, sample records and validation policy | Does not redefine upstream NSIDs or publish a person's records |
| `unset-sh/lexicons` | The contract copied into `schemas/upstream/` | Recipe consumers follow these definitions; GitHub availability does not prove DNS/PDS publication |
| App | Editor behavior, renderer and supported features | Passing a schema check does not prove the app displays a field |
| Person using a recipe | Their facts, uploads, review and publishing decision | A prepared result does not authorize an assistant to publish |
| Docs framework | Navigation, layout, brand assets and presentation | Receives source-owned content; does not become its editing source |

The [upstream source manifest](https://github.com/unset-sh/profile-recipes/blob/main/schemas/upstream/source.json) records
the exact `unset-sh/lexicons` revision and copied-file hashes. The app remains a separate dependency for editor
limits and verified reader behavior. A repository split does not change the schemas’ meaning.

## What validation proves

`bun run check` checks recipe records against the vendored schemas, then applies this repository's stricter sample
rules: correct profile/page/card placement, known fields and blocks, editor limits, safe example URLs, image
references, slot pointers and guide structure. It also checks copied-schema inventory and hashes.
For example, sample text respects the inspected editor's 10,000-byte UTF-8 cap even if a schema permits more.

These are template quality checks. [AT Protocol Lexicon](https://atproto.com/specs/lexicon) defines the schema system;
the protocol's extension behavior must not be described as this repository's stricter unknown-field policy.

The [README's support table](https://github.com/unset-sh/profile-recipes/blob/main/README.md#current-app-and-media-studies)
records a separate review of the app at `9817f1e`. It distinguishes current-app mockups from proposed media display.
Schema validation cannot replace that review. Regression tests exercise recipe loading and rendering as consumers,
including manifest order and empty card content. The static preview remains a local design study, not an access-control implementation.

## Record preparation is not publishing

Sample timestamps and blob references are demonstration data. For new records, a preparing tool must replace them
with creation times and blobs the person uploaded. `page.json` is a main-page template; it leaves `cards` absent until card keys
are assigned. A preparing tool fills the page’s `cards` in retained manifest order, inside the same person’s repository:

```json
{ "uri": "at://<did>/sh.unset.card/<rkey>" }
```

This is an address shape, not a real record. [AT URIs](https://atproto.com/specs/at-uri-scheme) explain the identifiers.
Only the cards referenced by the page appear. Never put card references or visibility on the profile. When editing
existing records, preserve unknown fields (including inside blocks) and creation times. Preserve the page's visibility
and unrelated references unless the person chooses to change them. Repository records remain
public on the network; `signed-in` or
`owner-only` visibility preferences are requests to apps, not confidentiality guarantees.

## Updating a consumer

The 0.2 recipes predate the profile/page split. Version 0.3 reconciles that history by adopting the schema
repository’s current contract, moving sample visibility to `page.json` and updating validators and instructions.
No upstream schema is changed to accommodate old recipe files.

Future evolution of an existing NSID requires optional new fields and compatible existing types, required fields,
closed unions and size or length limits. Keeping every field name is insufficient. Follow the
[evolution rules](https://atproto.com/specs/lexicon#lexicon-evolution) and verify consumer behavior when updating a pin.

To change a recipe, follow [CONTRIBUTING.md](https://github.com/unset-sh/profile-recipes/blob/main/CONTRIBUTING.md).
Update the relevant explanation when changing behavior, and keep copied schema bytes and their provenance intact.
