# 14 — Canonical Authority / Capability / Privacy Contract

This expands A3 into the implementation contract.

## Capability qualification

CapabilityQualification is evidence-bearing and exact:
qualification_id; configuration_subject_id; role_scope; capability/procedure/version; tool/context/privacy requirements; evaluation population; evidence/falsifier refs; validity/requalification; limitations; status.

A qualification cannot be applied to another candidate/configuration unless explicit transfer evidence authorizes that relation.

Eligibility proof precedes any cost/latency ranking.

## Authority proof

A ValidatedAuthoritySnapshot is derived only from canonical Current as-of release and binds:
principal/sponsor; grantee identity/incarnation; purpose/objective; object/resource scope; capability/tool/operation; effect/consequence/value/resource bounds; privacy/disclosure class; recipient where applicable; delegation chain/lease; authority domain and generation; issued/effective/expiry; revocation/supersession; work/causal episode; intent/release attempt where material; evidence/provenance.

Unknown/missing/stale/conflicted mandatory dimension => UNKNOWN/DENY/HOLD according to A1; never positive authority.

Explicit denial/value semantics outrank matching keys/scopes.

## Delegation / lease

Lease issuance and release validation use the same total validator.
Validation includes exact principal, IRIS/worker identity and status, worker/profile validity, work + causal episode, capability/tool/operation, privacy scope/policy, authority policy, generation, latest lease state, expiry/future issuance, revocation, intent/digest and continuation fence where applicable.

No caller-supplied string bag may stand in for the validated snapshot.

## Revocation / fencing

Revocation/generation advance is canonical and monotonic.
Consequential release holds an authority/continuation fence through the one-time release transition defined in artifact 16.
Either revocation wins first and release is denied, or release linearizes first and later revocation cannot rewrite history.

## Privacy

Separate proofs:
- evidence qualification;
- permission to retain;
- permission to use for purpose;
- permission to disclose to exact recipient;
- minimum necessary projection;
- retention/expiry;
- re-use/transfer restrictions.

QUALIFIED_EVIDENCE != PERMISSION_TO_PERSIST.
SHARED_PROTOCOL != SHARED_DISCLOSURE_RIGHT.
COMMUNICATION_EFFICIENCY_CANNOT_OVERRIDE_PRIVACY.

## Credential / provider boundary

Credential/provider/device possession is an execution capability only. It does not prove principal identity, authority, Current, qualification or continuity.

COGNITION_MAY_PROPOSE_CAPABILITY / COGNITION_CANNOT_RELEASE_CAPABILITY.

## Recurrence proof

Batch C must mutate each bound dimension independently; swap candidate qualifications; use denial values; future/expired grants; foreign principals; mismatched privacy; revoked/old generation; replaced worker; wrong episode/intent/digest; retained credential/provider session. Every case must fail at the common validator before consequential release.
