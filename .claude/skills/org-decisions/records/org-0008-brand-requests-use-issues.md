# org-0008. Brand requests use issues, handoffs live in agent-kit

Status: accepted (2026-11-22, Alex: "if ever an agent building a app needs more token for branding etc. can
you have it open issues on brand repo?? then another agent could follow the repo and provide him";
"no that handoff should live in agent-kit"; "make sure it is a rule, i do not want random ai artifact
across my repos"; "and the repo agent.md can direct to the relevant files")

## Context

A consuming application's agent may find a missing shared design token or brand asset while building a
feature. The need should reach the repository that owns the visual contract, and another agent should be
able to pick it up without scattering handoff documents through the organisation's repositories.

## Decision

1. A consumer agent that verifies a missing shared design token or brand asset opens or updates a concrete
   request in `unset-sh/brand` issues. A provider agent assigned to that queue can fulfil it in brand.
2. The shared request, provider and consumer-adoption instructions live in `unset-sh/agent-kit`, as the
   `org-brand-request` skill. An always-loaded organisation rule points to the skill.
3. Repository `AGENTS.md` files direct agents to the relevant rules and skills rather than copying their
   contents. Consumers use the approved kit version they pin; changes reach them through the kit's normal
   reviewed release and update procedure.
4. Org-0005 continues to govern all AI working material. Plans, drafts, task notes and reviews stay in
   agent-kit under `notes/<task>/`; supporting artifacts stay under `artifacts/<task>/`. Maintained human
   documentation belongs in its owner's `docs/` and is exported to the documentation site.

## Consequences

- Brand issues carry concise, actionable requests and links. Task notes and supporting evidence remain in
  agent-kit. Brand owns the resulting contract, assets and maintained documentation.
- The skill's issue fields, duplicate handling, provider claim and verification steps are implementation
  choices that make the handoff usable. They do not override a repository's owner decisions or release gate.
- A rule and skill do not start an agent or create a scheduled watcher. Pickup requires an assigned or
  separately configured agent with access; provider completion and consumer adoption are distinct steps.
- This change does not publish a kit release, install consumer copies, or move historical working files.
