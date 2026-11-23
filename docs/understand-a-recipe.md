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
profile.json + cards/*.json + assets/
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

The samples are `sh.unset.profile` and `sh.unset.card` records. A card's `content.$type` selects a `sh.unset.block.*`
definition, such as `sh.unset.block.text`. The developer example [walks through that relationship](developer-example/index.md).

## Where the boundaries are

| Owner | Owns | Boundary |
| --- | --- | --- |
| `profile-recipes` | Layout intent, interview guidance, sample records and validation policy | Does not redefine upstream NSIDs or publish a person's records |
| Upstream schema authority | The Lexicon definitions copied into `schemas/upstream/` | A copied schema is not proof of network publication |
| App | Editor behavior, renderer and supported features | Passing a schema check does not prove the app displays a field |
| Person using a recipe | Their facts, uploads, review and publishing decision | A prepared result does not authorize an assistant to publish |
| Docs framework | Navigation, layout, brand assets and presentation | Receives source-owned content; does not become its editing source |

The [upstream source manifest](https://github.com/unset-sh/profile-recipes/blob/main/schemas/upstream/source.json) records
the exact schema revision. Its upstream location remains outside `unset-sh` for now; it is linked as a dependency,
not exported here as app documentation.

## What validation proves

`bun run check` checks recipe records against the vendored schemas, then applies this repository's stricter sample
rules: known fields and blocks, editor limits, safe example URLs, image references, slot pointers and guide structure.
For example, sample text respects the inspected editor's 10,000-byte UTF-8 cap even if a schema permits more.

These are template quality checks. [AT Protocol Lexicon](https://atproto.com/specs/lexicon) defines the schema system;
the protocol's extension behavior must not be described as this repository's stricter unknown-field policy.

The [README's support table](https://github.com/unset-sh/profile-recipes/blob/main/README.md#current-app-and-media-studies)
records a separate review of the app at `0dd0795`. It distinguishes current-app mockups from proposed media display.
Schema validation cannot replace that review.

## Record preparation is not publishing

Sample timestamps and blob references are demonstration data. A preparing tool must replace them with the creation
time and blobs the person uploaded. The profile template leaves `cards` absent until card records exist; a preparing
tool then builds references in manifest order, inside the same person's repository:

```json
{ "uri": "at://<did>/sh.unset.card/<rkey>" }
```

This is an address shape, not a real record. [AT URIs](https://atproto.com/specs/at-uri-scheme) explain the identifiers.
Only referenced cards appear in the profile. Repository records remain public on the network; `signed-in` or
`owner-only` visibility preferences are requests to apps, not confidentiality guarantees.

To change a recipe, follow [CONTRIBUTING.md](https://github.com/unset-sh/profile-recipes/blob/main/CONTRIBUTING.md).
Update the relevant explanation when changing behavior, and keep copied schema bytes and their provenance intact.
