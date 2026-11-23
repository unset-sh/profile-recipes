# org-0007. Separate backend, web and deployment through capability contracts

Status: accepted (2026-11-22, Alex: "ok let make the organisation follow this logic"; then "rename server-kit
to backend, and delete standalone messaging"; documentation requested with "remember to documents this chat
in agent-kit")

## Context

The architecture discussion began with maintainability as features and contributors grow, then developed
the organisation's shared-platform model and examined the existing application as a read-only reference.
Alex explicitly allowed moving and rewriting parts in the future organisation application. He approved the
backend, web and deployment direction and asked that the chat be documented here.

The repository inventory found `server-kit` and `messaging` only as proposed map entries, not existing
repositories. The subsequent instruction replaces the server-kit proposal with backend and removes the
standalone messaging proposal. It does not describe a GitHub repository rename or deletion, nor removal of
an existing published contract. The organisation map remains authoritative in `unset-sh/.github`.

Org-0006 already assigns shared developer-tooling implementations to `unset-sh/tooling`. This decision
retains that ownership; earlier research using `developer-tooling` or `.github` as its proposed destination
is historical. Source code, released artifacts, consumer adoption and deployment are separate states.

## Decision

1. Establish `unset-sh/backend`, `unset-sh/web` and `unset-sh/deployment` around the agreed responsibilities.
   Backend owns product operations, domain rules, its AppView/query and indexing code, private server
   adapters, migrations and separately privileged process entries. Web owns the complete SvelteKit client:
   routes, SSR, browser features, components and web-specific session/edge adapters. Deployment owns
   environment topology, desired artifact versions and rollout orchestration. These names and foundation
   work are approved; a mobile repository remains future scope.
2. Replace the proposed `server-kit` responsibility with backend and remove the standalone `messaging`
   proposal. Messaging UI belongs with web or a future mobile client; server-side messaging operations
   belong with backend. An adapter belongs in the runtime and trust boundary its technology requires,
   including device-side adapters. This does not require a separate repository per adapter or capability.
3. Name application contracts after capabilities such as profile, identity and messaging. Concrete
   adapters implement those capabilities using appropriate technologies. Keep UI capability interfaces,
   public network contracts and private backend ports distinct. Translate provider details at the adapter;
   do not mirror a complete external API or assume every protocol can be implemented wholly on a server.
   Capability-owned internal ports belong with their domain; public AT Protocol contracts belong with
   lexicons, and other public API specifications with their authoritative owner. For example, an S3 adapter
   implements a domain-owned storage contract in backend infrastructure, while deployment owns bucket
   setup, policies, lifecycle and environment configuration. Exact filenames are implementation choices.
   Alex accepted `assets` for the managed-content capability: "assets is fine". Its domain owns public
   internal contracts and rules for uploaded/generated files, references and access metadata. Other domains
   consume that surface; a profile-specific repository contract remains with profile. Postgres and S3 are
   infrastructure/storage providers, but relational and blob-storage ports remain distinct. Extra provider
   ports are justified by real policy, not forwarding layers or recreating an external API.
4. Make externally published contracts stable commitments, with compatible evolution and supported
   consumer/provider versions. Lexicons may describe records and XRPC interfaces; preserve old meanings,
   add compatible optional fields and use new NSIDs for breaking designs. Verify behavior as well as
   shape. Private interfaces and database representations may evolve behind those public commitments,
   with deliberate migrations and recovery where stored data changes.
5. Keep existing shared responsibilities focused: brand owns semantic tokens and assets; lexicons is the
   intended protocol authority through an explicit source/release cutover; presentation owns rendering
   supplied data; profile-recipes owns recipes; docs publishes source-owned documentation. A possible
   `rendering` name was discussed, but no presentation rename is approved by this decision. A generated
   client can ship from its authoritative owner without creating another repository.
   Alex confirmed "yes agreed brand remains its own". Brand remains the independent authoritative source
   of versioned visual artifacts. Delivery copies in S3/CDN are an optional consumer/deployment pattern,
   not a dependency of brand on the running backend or a transfer of brand ownership to assets.
6. Preserve org-0006: tooling owns reusable workflow/check implementations, while consumers keep their
   product commands, policies, fixtures and small caller files. Deployment consumes producer-owned images
   and configuration/run contracts at immutable revisions. Producers own image builds and migrations;
   deployment assembles independently versioned components rather than one image containing all services.
7. Keep PDS, Unset's AppView/indexer and a possible Tap integration distinct. Backend owns Unset's product
   integration and projections; PDS packaging retains its component owner; deployment selects and runs
   released components. Tap adoption and the exact client write/authentication path require implementation
   evidence. This decision does not claim that Tap is running or approve a new credential mechanism.
8. Compatible shared changes should propagate through published artifacts, consumer updates, verification,
   eligible automatic merge and normal delivery, with actual versions and failures recorded. Required
   checks, owner release approval and other existing controls remain in force. A merged dependency update
   alone is not a deployed result; installed mobile clients have their own distribution/support lifecycle.

The protocol compatibility basis is the [Lexicon specification](https://atproto.com/specs/lexicon#lexicon-evolution).
The distinction between public representations and behavior follows [AIP-180](https://google.aip.dev/180).
The component vocabulary follows the [AT Protocol stack](https://atproto.com/guides/the-at-stack#tap).
These sources inform the design; the repository ownership above is Alex's decision, not a protocol mandate.

## Consequences

- Update the organisation map and repository foundations together. Keep status precise: approved direction
  is not evidence of a running API, migration, package release or consumer cutover.
- Discover a small representative operation before freezing a public API. Current web forms, redirects
  and route-owned contracts need separation before they become a reusable native-client boundary.
- Separate repositories add network/authentication boundaries, partial failures and version coordination.
  Keep operations cohesive; repeated lockstep changes are evidence to revisit a boundary.
- Browser/mobile clients never receive private database or PDS-admin capabilities. Direct end-user PDS
  access may be a valid separately designed OAuth path; it is not selected by this record. Externally
  authored records still require appropriate read validation rather than assuming our editor produced them.
- Preserve useful source invariants and tests while changing destination structure. Explicitly replace
  path-bound checks and applicable placement decisions; do not weaken trust boundaries to make moves pass.
- The original `Undefined6799/unset` application remains read-only for this organisation work. Foundation
  creation and map updates happen now; production cutovers and the full application migration follow actual
  contracts, migration evidence and the existing approval process.
- Record the chat synthesis and plan under `notes/org-architecture/` and its dated research under
  `artifacts/org-architecture/`, as org-0005 requires. Those task files do not ship in the kit. This decision
  reaches consumers only through a later approved kit release.
