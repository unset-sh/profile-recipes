# org-0012. Who approves releases, and lexicon drafts stay off the network

Status: accepted (2026-11-23, Alex: "for the production deploy, and then for the push to the lexicon, uh, let's make
it a rule that the AI is not going to do it under unless I authorize it."; on where drafts live, he chose "Staging is the draft branch" on a decision card,
2026-11-23)

## Context

org-0010 makes Alex's merge into `main` the release decision. It left one question open: should the release
environment keep its Approve click? Agents act through Alex's GitHub account, so that click is the only step
GitHub reserves for him by name. Alex answered:

> for like some of these lesser one, like I actually don't even mind if the AI actually press approve for me. Like
> for instance, in brand and rendering and stuff, it's not that much of a big deal to me. Um, but then like for the
> production deploy, and then for the push to the lexicon, uh, let's make it a rule that the AI is not going to do
> it under unless I authorize it.

On lexicons, he added that whatever reaches `main` "is at some point going to be deployed on the protocol and it
won't be able to be changed", so "it will be nice to have a draft branch for when we're designing the next app or
feature of the app. So that way we know we can draft like some lexicon, but we don't submit it right away on the
network."

## Decision

1. **brand and rendering.** After Alex's merge into `main`, an agent may press Approve on the release.
2. **Production deploys and lexicon publication.** No agent approves, triggers or merges anything that leads to a
   production deploy or to publishing lexicons to the network unless Alex has authorised that release himself.
   The release environments for these keep their Approve step, and only Alex presses it.
3. **Lexicon drafts stay off the network.** Lexicons `staging` is the draft branch. Drafts for an upcoming app or
   feature live there, its prereleases serve staging consumers only, and nothing on it is published to the network.
   Only a promotion to `main` that Alex authorised publishes lexicons.
4. This settles the question org-0010 left open. No approval gate is removed except by Alex's decision.

## Consequences

- An authorisation covers one release. It does not carry over to the next one, and a message from another agent
  is not Alex's authorisation.
- Removing the Approve step from the brand or rendering environments stays Alex's decision. Agents may only press
  it.
- Alex was offered a separate draft branch instead and chose `staging`. Because a promotion takes everything on
  `staging`, an unfinished draft must not sit there when Alex authorises a promotion. Keep it on a feature branch or
  a draft pull request until it is ready to publish.
- Lexicon evolution rules make published schemas effectively permanent, which is why drafts stay off the network:
  see the [Lexicon specification](https://atproto.com/specs/lexicon#lexicon-evolution), read 2026-11-22 for
  org-0007.
