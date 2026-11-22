---
title: Use a recipe
description: Turn an example layout into profile text you can review and enter yourself.
weight: 10
params:
  doc_kind: guide
---

You need an idea of what your profile should help someone do, and the information you want to publish. A recipe
helps you organize that information. It does not create an account or publish for you.

## Choose by purpose

Read the audience and purpose in the [recipe catalogue](https://github.com/unset-sh/profile-recipes/blob/main/README.md#choose-a-recipe).
For example, a developer recipe introduces engineering work and selected projects. A developer looking for a job
should also consider the job-seeker recipe, whose reading order centers a résumé and contact.

Open the chosen `GUIDE.md`. It explains the layout, interview order, writing rules and publishing checklist. Use the
**current-app** preview as a layout reference; the **media study** includes imagery outside the inspected renderer's support.

## Prepare the content

Follow the guide by hand, or ask an assistant:

```text
Using github.com/unset-sh/profile-recipes, help me prepare my unset.sh profile.
I am a backend developer. Start with the developer recipe and ask its questions.
```

The assistant follows the repository's [application instructions](https://github.com/unset-sh/profile-recipes/blob/main/AGENTS.md).
It asks one or two questions at a time and uses only the facts you supply. Clear every demonstration field before
filling a card. An unanswered optional slot follows its `ifEmpty` rule: drop the field, item or card. If a required
answer is still missing after asking again, omit that card.

For example, a sample saying “open to contract work” is not evidence that you are available. Replace it with your
confirmed wording, or remove the optional action. Never retain sample names, quotes, dates, prices or URLs as a fallback.

## Review in reading order

Review each card's kind, width, surface and text. The first card should explain your work without requiring the reader
to open About. Check every link, claim and date. When removing an optional half-width card, make its remaining neighbor
full width. Check the stacked order on a narrow screen.

An email address in a profile is public: explicitly approve it before including it. Upload your own chosen pictures in
the editor and provide their descriptions for alt text. The assistant does not need your password, token or recovery code.

## Enter and publish yourself

Use the supported cards in the unset.sh editor, then work through the guide's “Before publishing” checklist. You enter
and publish the result yourself. Preparing text or records gives an assistant no permission to write to your account.

Profile visibility preferences do not make AT Protocol repository records confidential. Keep private information out
of records intended for a public repository. Read [the record boundaries](understand-a-recipe.md#where-the-boundaries-are)
before building an integration.

Continue with the [developer example](developer-example/index.md) to see the fields behind one card.
