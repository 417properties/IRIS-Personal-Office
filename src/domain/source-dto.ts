// Explicit version-owned source DTO descriptors. Historical spelling retained;
// validation is not canonical admission, source verification or authority.
import { demand, freeze, member, record, strings, text, version } from '../semantic-kernel/validation.ts';
import { instant } from '../semantic-kernel/temporal.ts';
import { jsonValue, denseArray } from './json.ts';
export const SOURCE_SCHEMAS = {
  "PRINCIPAL_V0": {
    "id_field": "principal_id",
    "fields": {
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_type": {
        "optional": false,
        "codec": [
          "AARON"
        ]
      },
      "status": {
        "optional": false,
        "codec": [
          "ACTIVE",
          "INACTIVE"
        ]
      },
      "created_at": {
        "optional": false,
        "codec": "instant"
      },
      "schema_version": {
        "optional": false,
        "codec": "version"
      }
    }
  },
  "ORIENTATIONSTATE_V0": {
    "id_field": "orientation_id",
    "fields": {
      "orientation_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "effective_from": {
        "optional": false,
        "codec": "instant"
      },
      "effective_to": {
        "optional": true,
        "codec": "instant"
      },
      "source_basis_refs": {
        "optional": false,
        "codec": "strings"
      },
      "standing_preferences": {
        "optional": false,
        "codec": "preferences"
      },
      "explicit_current_decisions": {
        "optional": false,
        "codec": "preferences"
      },
      "predicted_preferences": {
        "optional": false,
        "codec": "preferences"
      },
      "privacy_constraints": {
        "optional": false,
        "codec": "strings"
      },
      "authority_constraints": {
        "optional": false,
        "codec": "strings"
      },
      "version": {
        "optional": false,
        "codec": "version"
      },
      "supersedes_orientation_id": {
        "optional": true,
        "codec": "text"
      }
    }
  },
  "EVIDENCEOCCURRENCE_V0": {
    "id_field": "occurrence_id",
    "fields": {
      "occurrence_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "source_type": {
        "optional": false,
        "codec": "text"
      },
      "source_ref": {
        "optional": false,
        "codec": "text"
      },
      "source_event_id": {
        "optional": true,
        "codec": "text"
      },
      "observed_at": {
        "optional": false,
        "codec": "instant"
      },
      "ingested_at": {
        "optional": false,
        "codec": "instant"
      },
      "payload_digest": {
        "optional": false,
        "codec": "text"
      },
      "content_ref": {
        "optional": false,
        "codec": "text"
      },
      "provenance": {
        "optional": false,
        "codec": "text"
      },
      "coverage_state": {
        "optional": false,
        "codec": [
          "COMPLETE",
          "PARTIAL",
          "MISSING",
          "UNKNOWN",
          "CONFLICT"
        ]
      },
      "confidence_class": {
        "optional": false,
        "codec": [
          "DIRECT",
          "DERIVED",
          "REPORTED",
          "UNKNOWN"
        ]
      },
      "privacy_class": {
        "optional": false,
        "codec": "text"
      },
      "work_episode_id": {
        "optional": true,
        "codec": "text"
      },
      "causal_episode_id": {
        "optional": true,
        "codec": "text"
      },
      "supersedes_occurrence_id": {
        "optional": true,
        "codec": "text"
      }
    }
  },
  "CURRENTASSERTION_V0": {
    "id_field": "assertion_id",
    "fields": {
      "assertion_id": {
        "optional": false,
        "codec": "text"
      },
      "subject_ref": {
        "optional": false,
        "codec": "text"
      },
      "predicate": {
        "optional": false,
        "codec": "text"
      },
      "value": {
        "optional": false,
        "codec": "json"
      },
      "effective_from": {
        "optional": false,
        "codec": "instant"
      },
      "effective_to": {
        "optional": true,
        "codec": "instant"
      },
      "source_occurrence_refs": {
        "optional": false,
        "codec": "strings"
      },
      "qualification": {
        "optional": false,
        "codec": [
          "VERIFIED",
          "QUALIFIED",
          "CONFLICT",
          "UNKNOWN",
          "INAPPLICABLE"
        ]
      },
      "freshness": {
        "optional": false,
        "codec": [
          "FRESH",
          "STALE",
          "UNKNOWN"
        ]
      },
      "coverage": {
        "optional": false,
        "codec": [
          "COMPLETE",
          "PARTIAL",
          "MISSING",
          "UNKNOWN",
          "CONFLICT"
        ]
      },
      "uncertainty": {
        "optional": false,
        "codec": "strings"
      },
      "version": {
        "optional": false,
        "codec": "version"
      },
      "supersedes_assertion_id": {
        "optional": true,
        "codec": "text"
      },
      "invalidated_by_refs": {
        "optional": false,
        "codec": "strings"
      }
    }
  },
  "OBJECTIVE_V0": {
    "id_field": "objective_id",
    "fields": {
      "objective_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "parent_objective_id": {
        "optional": true,
        "codec": "text"
      },
      "description": {
        "optional": false,
        "codec": "text"
      },
      "desired_outcome": {
        "optional": false,
        "codec": "text"
      },
      "success_criteria": {
        "optional": false,
        "codec": "strings"
      },
      "status": {
        "optional": false,
        "codec": [
          "OPEN",
          "SATISFIED",
          "UNSATISFIED",
          "HOLD",
          "ABANDONED"
        ]
      },
      "authority_scope": {
        "optional": false,
        "codec": "strings"
      },
      "privacy_scope": {
        "optional": false,
        "codec": "strings"
      },
      "created_from": {
        "optional": false,
        "codec": "text"
      },
      "created_at": {
        "optional": false,
        "codec": "instant"
      },
      "closed_at": {
        "optional": true,
        "codec": "instant"
      },
      "closure_evidence_refs": {
        "optional": false,
        "codec": "strings"
      },
      "version": {
        "optional": false,
        "codec": "version"
      }
    }
  },
  "OBLIGATION_V0": {
    "id_field": "obligation_id",
    "fields": {
      "obligation_id": {
        "optional": false,
        "codec": "text"
      },
      "objective_id": {
        "optional": false,
        "codec": "text"
      },
      "owner": {
        "optional": false,
        "codec": [
          "IRIS",
          "AARON",
          "EXTERNAL"
        ]
      },
      "description": {
        "optional": false,
        "codec": "text"
      },
      "status": {
        "optional": false,
        "codec": [
          "OPEN",
          "IN_PROGRESS",
          "WAITING",
          "HOLD",
          "CLOSED",
          "UNKNOWN"
        ]
      },
      "due_at": {
        "optional": true,
        "codec": "instant"
      },
      "closure_criteria": {
        "optional": false,
        "codec": "strings"
      },
      "authority_requirement": {
        "optional": false,
        "codec": "strings"
      },
      "privacy_requirement": {
        "optional": false,
        "codec": "strings"
      },
      "source_refs": {
        "optional": false,
        "codec": "strings"
      },
      "last_episode_id": {
        "optional": true,
        "codec": "text"
      },
      "version": {
        "optional": false,
        "codec": "version"
      }
    }
  },
  "ACTIONINTENT_V0": {
    "id_field": "intent_id",
    "fields": {
      "intent_id": {
        "optional": false,
        "codec": "text"
      },
      "decision_ref": {
        "optional": false,
        "codec": "text"
      },
      "work_episode_id": {
        "optional": false,
        "codec": "text"
      },
      "tool_id": {
        "optional": false,
        "codec": "text"
      },
      "operation": {
        "optional": false,
        "codec": "text"
      },
      "arguments_digest": {
        "optional": false,
        "codec": "text"
      },
      "expected_effect": {
        "optional": false,
        "codec": "text"
      },
      "authority_basis": {
        "optional": false,
        "codec": "text"
      },
      "privacy_basis": {
        "optional": false,
        "codec": "text"
      },
      "idempotency_key": {
        "optional": false,
        "codec": "text"
      },
      "verification_contract": {
        "optional": false,
        "codec": "text"
      },
      "retry_classification": {
        "optional": false,
        "codec": [
          "IDEMPOTENT_BY_KEY",
          "READ_ONLY",
          "NON_IDEMPOTENT_RECONCILABLE",
          "NON_IDEMPOTENT_UNSAFE"
        ]
      },
      "created_at": {
        "optional": false,
        "codec": "instant"
      }
    }
  },
  "ACTIONRECEIPT_V0": {
    "id_field": "receipt_id",
    "fields": {
      "receipt_id": {
        "optional": false,
        "codec": "text"
      },
      "intent_id": {
        "optional": false,
        "codec": "text"
      },
      "provider_call_id": {
        "optional": false,
        "codec": "text"
      },
      "request_digest": {
        "optional": false,
        "codec": "text"
      },
      "completion_class": {
        "optional": false,
        "codec": [
          "SUCCESS",
          "ERROR",
          "TIMEOUT",
          "UNKNOWN"
        ]
      },
      "returned_payload_digest": {
        "optional": false,
        "codec": "text"
      },
      "tool_reported_status": {
        "optional": false,
        "codec": "text"
      },
      "error_class": {
        "optional": true,
        "codec": "text"
      },
      "received_at": {
        "optional": false,
        "codec": "instant"
      }
    }
  },
  "EFFECTVERIFICATION_V0": {
    "id_field": "verification_id",
    "fields": {
      "verification_id": {
        "optional": false,
        "codec": "text"
      },
      "intent_id": {
        "optional": false,
        "codec": "text"
      },
      "receipt_id": {
        "optional": true,
        "codec": "text"
      },
      "disposition": {
        "optional": false,
        "codec": [
          "VERIFIED_EFFECT",
          "VERIFIED_NO_EFFECT",
          "AMBIGUOUS_EFFECT",
          "CONFLICT",
          "UNKNOWN"
        ]
      },
      "evidence_refs": {
        "optional": false,
        "codec": "strings"
      },
      "verified_at": {
        "optional": false,
        "codec": "instant"
      },
      "notes": {
        "optional": false,
        "codec": "strings"
      }
    }
  },
  "AUTHORITYPOLICY_V0": {
    "id_field": "policy_id",
    "fields": {
      "policy_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "basis_type": {
        "optional": false,
        "codec": [
          "EXPLICIT_CURRENT_DECISION",
          "STANDING_AUTHORIZATION",
          "INTERNAL_NONCONSEQUENTIAL",
          "PREDICTED_PREFERENCE"
        ]
      },
      "scopes": {
        "optional": false,
        "codec": "strings"
      },
      "valid_from": {
        "optional": false,
        "codec": "instant"
      },
      "valid_to": {
        "optional": true,
        "codec": "instant"
      },
      "source_ref": {
        "optional": false,
        "codec": "text"
      },
      "version": {
        "optional": false,
        "codec": "version"
      }
    }
  },
  "PRIVACYPOLICY_V0": {
    "id_field": "policy_id",
    "fields": {
      "policy_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "scopes": {
        "optional": false,
        "codec": "strings"
      },
      "disclosure": {
        "optional": false,
        "codec": [
          "ALLOW",
          "DENY"
        ]
      },
      "valid_from": {
        "optional": false,
        "codec": "instant"
      },
      "valid_to": {
        "optional": true,
        "codec": "instant"
      },
      "source_ref": {
        "optional": false,
        "codec": "text"
      },
      "version": {
        "optional": false,
        "codec": "version"
      }
    }
  },
  "CAPABILITYPROCEDURE_V0": {
    "id_field": "capability_id",
    "fields": {
      "capability_id": {
        "optional": false,
        "codec": "text"
      },
      "name": {
        "optional": false,
        "codec": "text"
      },
      "version": {
        "optional": false,
        "codec": "version"
      },
      "capability_class": {
        "optional": false,
        "codec": "text"
      },
      "procedure_ref": {
        "optional": false,
        "codec": "text"
      },
      "tool_requirements": {
        "optional": false,
        "codec": "strings"
      },
      "authority_envelope": {
        "optional": false,
        "codec": "strings"
      },
      "privacy_envelope": {
        "optional": false,
        "codec": "strings"
      },
      "qualification_state": {
        "optional": false,
        "codec": [
          "CANDIDATE",
          "QUALIFIED",
          "REJECTED",
          "UNKNOWN"
        ]
      },
      "evidence_refs": {
        "optional": false,
        "codec": "strings"
      },
      "failure_conditions": {
        "optional": false,
        "codec": "strings"
      },
      "recovery_contract": {
        "optional": false,
        "codec": "text"
      },
      "provider_dependency": {
        "optional": true,
        "codec": "text"
      }
    }
  },
  "LEARNINGRECORD_V0": {
    "id_field": "learning_id",
    "fields": {
      "learning_id": {
        "optional": false,
        "codec": "text"
      },
      "source_episode_refs": {
        "optional": false,
        "codec": "strings"
      },
      "candidate_lesson": {
        "optional": false,
        "codec": "text"
      },
      "causal_basis": {
        "optional": false,
        "codec": "strings"
      },
      "alternative_explanations": {
        "optional": false,
        "codec": "strings"
      },
      "qualification_state": {
        "optional": false,
        "codec": [
          "CANDIDATE",
          "QUALIFIED",
          "REJECTED",
          "UNKNOWN"
        ]
      },
      "evidence_refs": {
        "optional": false,
        "codec": "strings"
      },
      "applicability": {
        "optional": false,
        "codec": "strings"
      },
      "invalidators": {
        "optional": false,
        "codec": "strings"
      },
      "created_at": {
        "optional": false,
        "codec": "instant"
      },
      "qualified_at": {
        "optional": true,
        "codec": "instant"
      },
      "version": {
        "optional": false,
        "codec": "version"
      }
    }
  },
  "WORKEPISODE_V0": {
    "id_field": "work_episode_id",
    "fields": {
      "work_episode_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "objective_id": {
        "optional": false,
        "codec": "text"
      },
      "obligation_id": {
        "optional": true,
        "codec": "text"
      },
      "episode_generation": {
        "optional": false,
        "codec": "version"
      },
      "continuation_of_episode_id": {
        "optional": true,
        "codec": "text"
      },
      "causal_episode_id": {
        "optional": false,
        "codec": "text"
      },
      "state_version_at_start": {
        "optional": false,
        "codec": "version"
      },
      "orientation_version_at_start": {
        "optional": false,
        "codec": "version"
      },
      "authority_snapshot_digest": {
        "optional": false,
        "codec": "text"
      },
      "privacy_snapshot_digest": {
        "optional": false,
        "codec": "text"
      },
      "toolset_digest": {
        "optional": false,
        "codec": "text"
      },
      "cognition_profile": {
        "optional": false,
        "codec": "text"
      },
      "workflow_runtime_ref": {
        "optional": true,
        "codec": "text"
      },
      "status": {
        "optional": false,
        "codec": [
          "RECEIVED",
          "ORIENTING",
          "PERCEIVING",
          "THINKING",
          "AUTHORITY_CHECK",
          "INTENT_READY",
          "EXECUTING",
          "RECEIPT_CAPTURED",
          "VERIFYING",
          "EFFECT_VERIFIED",
          "OBLIGATION_RECONCILE",
          "OBJECTIVE_RECONCILE",
          "LEARNING_RECORD",
          "EPISODE_CLOSED",
          "WAITING_FOR_AARON",
          "WAITING_FOR_SOURCE",
          "HOLD_AUTHORITY_UNKNOWN",
          "HOLD_PRIVACY_UNKNOWN",
          "HOLD_CONFLICTING_EVIDENCE",
          "EFFECT_AMBIGUOUS",
          "RECONCILIATION_REQUIRED",
          "FAILED_RETRY_SAFE",
          "FAILED_RETRY_UNSAFE",
          "ABORTED"
        ]
      },
      "started_at": {
        "optional": false,
        "codec": "instant"
      },
      "last_checkpoint_at": {
        "optional": false,
        "codec": "instant"
      },
      "ended_at": {
        "optional": true,
        "codec": "instant"
      }
    }
  },
  "ACTIONDECISION_V0": {
    "id_field": "decision_id",
    "fields": {
      "decision_id": {
        "optional": false,
        "codec": "text"
      },
      "principal_id": {
        "optional": false,
        "codec": "text"
      },
      "source_ref": {
        "optional": false,
        "codec": "text"
      },
      "scope": {
        "optional": false,
        "codec": "text"
      },
      "decided_at": {
        "optional": false,
        "codec": "instant"
      }
    }
  }
} as const;
export function decodeSource(value:unknown){
  const envelope=record(value,['representation_version','source']);
  const key=member(envelope.representation_version,Object.keys(SOURCE_SCHEMAS));
  const schema=SOURCE_SCHEMAS[key as keyof typeof SOURCE_SCHEMAS] as {id_field:string;fields:Record<string,{optional:boolean;codec:string|readonly string[]}>};
  const entries=Object.entries(schema.fields),r=record(envelope.source,entries.filter(([,d])=>!d.optional).map(([k])=>k),entries.filter(([,d])=>d.optional).map(([k])=>k));
  const source:Record<string,unknown>={};
  for(const [k,d] of entries){
    if(!Object.hasOwn(r,k))continue;
    const v=r[k],c=d.codec;
    source[k]=Array.isArray(c)?member(v,c):c==='strings'?strings(denseArray(v)):c==='version'&&k==='state_version_at_start'?nonnegative(v):c==='version'?version(v):c==='instant'?instant(v):c==='json'?jsonValue(v):c==='preferences'?decodePreferences(v):text(v);
  }
  return freeze({representation_version:key,source});
}
function decodePreferences(value:unknown){
  demand(Array.isArray(value)&&Object.keys(value).length===value.length,'DENSE_PREFERENCE_ARRAY');
  return value.map(v=>{const r=record(v,['key','value','source_ref','effective_from'],['effective_to']);
    return {key:text(r.key),value:jsonValue(r.value),source_ref:text(r.source_ref),effective_from:instant(r.effective_from),...(Object.hasOwn(r,'effective_to')?{effective_to:instant(r.effective_to)}:{})};});
}

function nonnegative(v:unknown){demand(Number.isSafeInteger(v)&&(v as number)>=0,'NONNEGATIVE_VERSION');return v as number;}
