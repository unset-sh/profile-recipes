---
name: org-principles
description: Alex's full engineering principles for unset.sh (architecture, engineering practices, workflow and change management). Read before designing or restructuring code, adding a dependency, layer, abstraction or contract, or planning a change to stored data, a public contract or deployment.
---

# Engineering principles, in full

The rule file `principles.md` is a one-page digest. These three documents are the full text. Read the one that
fits the work before you start, and name the section you applied when you explain a design choice.

| Read | When |
| --- | --- |
| [architecture-instructions.md](architecture-instructions.md) | Designing or changing structure: boundaries, contracts, adapters, dependency direction, naming, when to abstract, when to escalate to human review |
| [engineering-practices.md](engineering-practices.md) | Implementing: code quality, testing, verification, security, dependencies, observability, configuration, upgrades |
| [workflow-and-change-management.md](workflow-and-change-management.md) | Changing an existing system: reconnaissance, git discipline, API and data design, performance, documentation, higher-risk changes |

Where a repository's own `CLAUDE.md` is more specific than these documents, the repository's rule wins.

The three documents were copied unchanged from `Undefined6799/unset`, folder `docs/human/engineering/`, at
commit 2e7f4d4. For the organisation's repositories this copy is the one to change. The app keeps its own copy
until its rewrite.
