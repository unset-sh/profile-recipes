---
name: org-map-maintenance
description: Use when creating, changing, publishing or reviewing a maintained repository, workflow, dependency or architecture map in unset.sh, or when a map is stale or its automatic refresh fails.
---

# Keep maps current

Every maintained map needs authoritative source data, a generator and automatic refresh through
`unset-sh/tooling`. The owning repository supplies its data and checks; agent-kit holds this procedure.
Keep working diagrams and investigation notes in agent-kit under the organisation's artifact rule.

## Register and connect a map

1. Identify what each node and edge means and which source establishes it. Read code or configuration for
   mechanical relationships. Record ownership and architectural intent as explicit, reviewed source facts;
   a generator cannot infer those decisions from filenames or dependencies.
2. Register each map in its consumer's `.github/maps.json`, following the schema supported by the reviewed
   tooling revision. Name its generator, outputs and validation. Keep the registry and authored source facts
   under review; do not maintain a second editable copy of generated output.
3. Use tooling's pinned `automation-maps-refresh.yml` for website JSON snapshots, or a documented shared
   publisher that explicitly supports the map's committed output format. Never broaden the JSON runner's
   file contract to publish executable or authored files. Configure the caller's source
   change events, schedule and manual recovery for the map's freshness needs. Declare the refresh interval,
   owner and failure path in maintained documentation. Verify the actual shared workflow and registry contract
   before wiring it; a rule or proposed integration is not evidence that refresh is running.
4. Validate every registered map before publishing any refreshed artifact. Generate from exact source
   revisions, preserve provenance and show when the snapshot was collected. Local or pull-request checks
   may validate a saved snapshot offline; they must not imply a live refresh succeeded.

## Preserve meaning and review evidence

Generated maps show the relationships their sources declare. Label their scope and arrow meanings; do not
present configuration as proof of a successful run, deployed state, configured approval or human ownership.
Keep separate views when these questions need different sources.

Bind each maintained workflow explanation to the exact source revision and workflow-file digest it was
reviewed against. A YAML change must mark the explanation for review; a newly discovered workflow must
remain visible with its explanation missing or unreviewed. Never silently refresh the digest while retaining
unreviewed prose. After checking purpose, triggers, steps, outputs and recovery against the changed source,
update the explanation and evidence through the owning repository's normal review.

Other maps also need human review when a change alters meaning. Automatic extraction may update facts and
layout; it must not automatically rewrite architectural decisions, ownership claims or explanations.

Alex's instruction, 2026-11-22: a validated update containing only derived map data or generated views does not
need a separate owner approval. Review the generator and authoritative source changes normally; do not ask the
owner to approve the same facts again in their rendered map. A publisher must enforce its output paths, preserve
authored text, validate the complete result, and respect repository merge restrictions. This exception does not
approve release or production promotion, policy changes, or invented ownership and explanations.

## Verify refresh and recover

Before calling the map maintained, verify one real refresh and its published or consumed output. Check new,
changed and removed source entries, provenance, validation failure and the offline snapshot path. State any
unverified integration explicitly. A scheduled interval is an intention, not a guaranteed completion time.

Collection or validation failure must stop replacement and publication, retaining the previous successful
output. Do not publish a partial map or translate an unavailable source into an empty inventory. Make the
last successful collection time and the failed refresh discoverable so readers can assess staleness.

Investigate the failed source, generator or validation step; correct it through review and rerun the same
checked refresh path. Do not hand-edit generated files or bypass validation to make the map look current.
