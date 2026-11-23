# org-0009. Maps refresh automatically through shared tooling

Status: accepted (2026-11-22, Alex: "so i want every map that we create to be refreshed automatically,
can that be a shared workflow??")

## Context

The organisation is adding a workflow catalogue alongside its repository ownership map. Maintaining diagrams
by hand would let their displayed relationships diverge from the source, especially as repositories and
reusable workflow pins change. Alex wants automatic refresh to be the rule for every map we create.

## Decision

1. Maintained maps are generated from authoritative sources and refreshed automatically through shared
   developer tooling. Map generation and refresh implementations belong in `unset-sh/tooling`, following
   org-0006; the consumer retains its source facts, map registry, triggers and publication responsibility.
2. The organisation rule points to `org-map-maintenance` in agent-kit. Repository `AGENTS.md` files direct
   agents to that procedure through their approved, pinned kit copy.
3. Automatic refresh preserves the distinction between extracted facts and human decisions. Ownership,
   architectural intent and explanations still need review; refreshing a diagram does not establish that
   its interpretation is correct.

## Consequences

- The implementation uses a consumer `.github/maps.json` registry and a reviewed pin of the shared
  `automation-maps-refresh.yml` workflow. Each map declares its generator, outputs and validation, with
  freshness, source provenance and failure behaviour documented by its owner.
- All registered maps are validated before refreshed artifacts are published. A collection or validation
  failure retains the previous successful output and exposes its age rather than publishing partial data.
- Workflow explanations are bound to exact source revisions and file digests. Changed YAML flags the prose
  for review; automation does not silently declare the old explanation verified or rewrite human meaning.
- Registry shape, workflow entry point, review-evidence fields and failure handling are implementation
  choices implementing Alex's direction. Their executable checks live with the implementation, not this kit.
- This rule does not by itself connect existing maps, publish a release, update consumer kit copies or
  change publication permissions. Those integrations require their own checked changes.
