# Engineering principles, in short

A copy of `rules/principles.md` in `unset-sh/agent-kit`: change it there, never in this copy. It digests three
documents by Alex, given in full in the skill `org-principles`. Read them before you design or restructure code,
add a dependency, layer, abstraction or contract, or plan a change to stored data, a public contract or deployment.

The guiding rule: choose the simplest design that keeps responsibilities clear and changes localised.

## Design

- Model the application's concepts first. External technology sits behind small contracts, in adapters.
- Define the smallest contract the application needs. Do not mirror an external API.
- Dependencies point toward stable application concepts rather than toward implementation details.
- Wire known dependencies in a composition root. Use a registry or a plugin only when something truly is dynamic.
- No layer, abstraction or file without a responsibility that needs it now. Clarity comes before reuse: extract
  a shared concept only once the pattern is stable and changes for the same reason.
- Spend design effort where a decision is expensive to reverse; keep cheap decisions simple.
- A failure in one external provider should not take down unrelated parts.
- Names say what something is responsible for, not which technology it uses, except at the boundary.
- Principles are tools for reasoning, not laws. When following one adds complexity without solving a real
  problem, prefer the simpler design.

## Practice

- Work in small loops: understand, plan briefly, change a little, format, lint, type-check, test, review the
  diff, then continue.
- Test observable behaviour with the simplest test that gives real confidence. If something is hard to test,
  reconsider its boundaries.
- Security is part of design, not a last step: secure defaults, validated trust boundaries, least privilege.
- Use established, well-maintained dependencies for real problems, recorded in the manifest and lockfile. Say
  what each one solves and why it was chosen.
- Logs, metrics and health signals make production diagnosable, and never carry secrets or personal data.
- Configuration that differs between environments stays out of the code.

## Change

- Read the existing code, conventions and history before adding a pattern, a dependency or a subsystem. Reuse
  what the repository already does well.
- Treat stored data and external contracts as long-lived: plan migrations, compatibility and rollback in
  proportion to the risk.
- Measure before optimising, and measure again after.
- Document why, where the reason is not obvious. Record important decisions lightly.
- When a small problem repeats, refactor. When it reveals a boundary problem, reconsider the design. A major
  change to boundaries, contracts or data models is surfaced for human review first.
