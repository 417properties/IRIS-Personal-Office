# Independent offline qualification reproduction

Materialize the exact repository commit c8118a013c926aa74c44dacc2469498dc24d78f2 as `candidate/`. Put this package's files in sibling `evaluator/`. Do not substitute a branch tip, candidate mutation, E1 population, E2/E3 labels, or previous result files.

Use Node 24.19.0 and an isolated installation of `@electric-sql/pglite@0.3.14` with lifecycle scripts disabled. The candidate's declared SQL fixture applies its migration roster and historical pgcrypto shim. Set `IRIS_B2_PGLITE_MODULE` to the absolute path of that installation's `dist/index.js`. This is an offline ephemeral PostgreSQL/WASM fixture, not a production connection. Review the exact candidate fixture helpers imported by the two harness files; they construct valid canonical records, not oracle expectations.

Run from the parent directory:

```bash
node --require ./candidate/scripts/qualification/network-guard.cjs evaluator/privacy-counterexample.mjs MEMORY
node --require ./candidate/scripts/qualification/network-guard.cjs evaluator/privacy-counterexample.mjs SQL
```

Both qualified reproductions intentionally exit 1 at `ORACLE_FALSIFIED: prohibited-recipient projection leaked private evidence reference`, after saving result and snapshot evidence. Each calls a fresh child reader using the network-denial preload. Setup/runtime errors before that assertion are not the recorded falsifier.

The snapshot evidence was identical across Memory and SQL; only `privacy-snapshot-MEMORY.json` is published to avoid duplicate payload. Its SHA-256 is d2c2629f1c27890b49bcb45d6416a1ef36138bd9d8db11f5ce543e610ac70e50. The harness can independently reconstruct this recorded occurrence with `privacy-cold-reader.mjs`, providing the snapshot path and the exact request in the result's replay/output run capture. Replays are representations of one synthetic causal test, not new empirical experiences.

The qualification report supplies the exact source/oracle semantics and limits. All oracle vectors are tracked in the disposition ledger; it intentionally contains zero whole-vector PASS claims after the material stop. `REGRESSION-OBSERVATION.json` records the separate 201 passing candidate-authored assertions observed in the tool transcript. Do not equate them with independent conformance.

Source retrieval corrected a serialization-only trailing newline before verifying original blob hashes. The sealed source inventory verifies bytes used during execution and after execution. No semantic candidate/oracle/E1 change occurred.
