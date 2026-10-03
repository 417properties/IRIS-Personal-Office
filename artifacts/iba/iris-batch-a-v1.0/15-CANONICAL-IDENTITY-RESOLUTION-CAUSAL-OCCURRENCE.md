# 15 — Canonical Identity / Resolution / Causal-Occurrence Contract

This expands A2.

## Identity rules

IDs are opaque. Prefix/type may validate namespace but cannot encode relationships or semantic payload.
No substring parsing, name guessing, case folding or reconstruction from candidate display IDs.

Explicit identity classes include:
principal; canonical business object; worker/substrate incarnation; Work Episode; continuation claim; intent; release attempt; receipt/effect/verification; conflict; resolution; projection run; communication message/event; causal occurrence.

Stable identity != current validity. Every material identity relation has version/as-of/evidence.

## Resolution object

ResolutionRequest:
resolution_id; principal_id; resolution_kind; primary_subject_refs; context_refs; source_relation/equivalence evidence; applicability/freshness; privacy/authority requirements; lifecycle; provenance.

Identity anchors determine “same resolution.”
Context refs provide needed understanding and may not silently broaden identity.

Two roots consolidate only when an explicit relation proves they satisfy the same resolution. Shared objective, same authority class, same holder, same text or proximity is insufficient.

Conflict is a first-class resolution object and cannot be absorbed into authorization merely because it shares an objective.

## Causal occurrence

CausalOccurrence:
occurrence_id; originating intent/event; parent occurrence; first occurrence time; operation/effect identity; replay/retry attempt refs; worker/episode representations; outcome/evidence lineage.

One real occurrence observed live, replayed, retried, transported, reconstructed or re-rendered remains one occurrence unless evidence proves a new independent event.

experience_count_key = occurrence_id (or a source-proven independent occurrence relation), never record count/work-episode count/message count.

## Work Episode / continuation

WorkEpisode represents durable work context.
ContinuationClaim binds causal_episode_id + generation/fence + owner incarnation + admission evidence + validity.

Transfer:
atomic compare current owner/generation -> admit successor -> invalidate/fence predecessor for new releases.
Only one active continuation claim per causal episode.

Recovery/replacement may create a new worker/episode representation without creating a new causal experience or inheriting predecessor authority automatically.

## Projection / content identity

Projection content digest and projection run/occurrence identity are distinct.
Identical semantic content in two independent runs may share content_hash but has different run_id and snapshot proof.

## Recurrence controls

- explicit relation graph replaces ID parsing;
- resolution-equivalence negative controls on same-objective/same-authority roots;
- overlapping predecessor/successor schedule tests;
- replay/reconstruction invariance for occurrence/experience counts;
- conflict/root identity compiler totality.
