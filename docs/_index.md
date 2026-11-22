---
title: Profile recipes
description: Build a clear profile from a reusable layout, and understand the records and boundaries behind it.
type: docs
cascade:
  type: docs
menus:
  main:
    weight: 30
params:
  doc_kind: overview
---

A recipe gives an unset.sh profile a purpose and a reading order. It combines example records, interview questions,
writing guidance and a checklist. You replace the invented sample details with your own approved information.

## Learn and use

- [Use a recipe](use-a-recipe.md): choose a layout, prepare the text and review it before publishing.
- [Walk through the developer example](developer-example/index.md): see how one layout becomes cards and fields.
- [Browse all fifteen recipes](https://github.com/unset-sh/profile-recipes/blob/main/README.md#choose-a-recipe).

## Understand and contribute

- [Understand a recipe](understand-a-recipe.md): follow the relationship between a manifest, records, schemas and the app.
- [How these docs are published](publishing.md): see what runs, what it changes and how failures are recovered.
- [Contribute a recipe](https://github.com/unset-sh/profile-recipes/blob/main/CONTRIBUTING.md): validate samples and propose a change.

## Scope and status

This repository owns recipes, their application instructions, validation and these explanations. The app owns its
editor and renderer. The copied schema definitions retain their upstream authority; recipes do not publish schemas.

The recipes use the draft **0.2 card/block format**. App support was checked at
[`0dd0795`](https://github.com/Undefined6799/unset/tree/0dd079517074917ebd5217f7ecf15f4984cdd5d3).
That snapshot is evidence about that revision, not a promise about a later release. The example preview is a layout
mockup, not a deployed profile.

Documentation and export tooling use [AGPL-3.0-only](https://github.com/unset-sh/profile-recipes/blob/main/LICENSE).
Recipes, sample records and their preview use [CC0-1.0](https://github.com/unset-sh/profile-recipes/blob/main/LICENSE-CONTENT).
Copied schemas retain their [MIT notice](https://github.com/unset-sh/profile-recipes/blob/main/schemas/upstream/LICENSE).
Every export includes the source commit, file hashes and applicable notices.
