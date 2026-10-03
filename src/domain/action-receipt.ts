// IRIS_LEGACY_V0 source representation. Explicit decoders/maps are in
// source-dto.ts / legacy-maps.ts; qualified canonical records use canonical.ts.
export interface ActionReceipt {
  receipt_id: string;
  intent_id: string;
  provider_call_id: string;
  request_digest: string;
  completion_class: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'UNKNOWN';
  returned_payload_digest: string;
  tool_reported_status: string;
  error_class?: string;
  received_at: string;
}
