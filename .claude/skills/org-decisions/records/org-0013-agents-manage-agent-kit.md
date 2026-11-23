# org-0013. Agents manage agent-kit, including merges into main

Status: accepted (2026-11-23, Alex: "For the agent kit, you're allowed to manage it yourself, and then I believe we
said that we will remove those rules there. So make sure that all those rules that we just talked about are
updated"; then "Yes, agent can merge agent can to main without me. It's like the agent repos.")

## Context

org-0010 decision 5 puts agent-kit with the main-only repositories: no `staging`, no releases, and only a person
merges into `main`. Alex had already said the kit is the assistants' own working memory: "it's going to be your kind
of your memory, so I don't feel like we need like releases there." He has now said assistants may manage it
themselves.

## Decision

1. In agent-kit, agents merge pull requests into `main`. Alex no longer has to merge them.
2. The author of a pull request never merges it. A separate review thread reads the full diff and merges only after
   the required checks pass.
3. This replaces, for agent-kit only, the "only a person merges it" part of org-0010 decision 5, and agent-kit's
   lines saying only Alex merges into `main`. Every other repository keeps org-0010 unchanged, and `working.md` keeps
   "only the owner merges into `main`" as the organisation default. agent-kit's `CLAUDE.md` names the exception, as
   the organisation rules provide.

## Consequences

- What merges into agent-kit `main` reaches other repositories only when each of them takes that commit through
  its own reviewed pull request (`org-kit-update`). In staged repositories, that update still reaches their `main`
  only through Alex's promotion.
- Reading of Alex's words, for him to correct: "remove those rules" is taken to mean the merge and release
  approvals for agent-kit. Two security rules in agent-kit's `CLAUDE.md` stay in force:
  - changing what may ship (no hooks, settings, scripts or tool grants) needs the owner's decision;
  - changing where `sync.mjs` may write, what it accepts or where it downloads from is a security decision to stop
    and ask about.

  Both guard every repository's assistant, and the no-security-shortcuts rule asks for his explicit word before
  either is relaxed.
- Merging is not deciding. Whoever merges into agent-kit `main` steers every assistant, including the rules that
  keep "only the owner merges into `main`" elsewhere and the release approvals of org-0012. A rule still states
  something Alex decided. A change here that relaxes a gate or an approval in another repository needs his own
  words, quoted in the pull request, before a review thread merges it. (Reviewer's wording, for Alex to strike.)
- Accepted records stay intact. org-0010 changes only for agent-kit, through this record.
