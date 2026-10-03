import { demand, record, text, freeze } from './validation.ts';

export interface TemporalCoordinates {
  recorded_at: string;
  effective_from: string;
  observed_at?: string;
  occurred_at?: string;
  valid_until?: string;
  superseded_at?: string;
  revoked_at?: string;
  requalification_at?: string;
}
export function instant(value: unknown): string {
  const s = text(value);
  demand(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(s), 'UTC_INSTANT_REQUIRED');
  const n = Date.parse(s);
  demand(Number.isFinite(n) && new Date(n).toISOString() === (s.includes('.') ? s : s.replace('Z', '.000Z')), 'INVALID_INSTANT');
  return s;
}
export function decodeTemporal(value: unknown): Readonly<TemporalCoordinates> {
  const r = record(value, ['recorded_at', 'effective_from'], ['observed_at', 'occurred_at', 'valid_until', 'superseded_at', 'revoked_at', 'requalification_at']);
  Object.values(r).forEach(instant);
  if (r.valid_until !== undefined) demand(Date.parse(r.valid_until as string) > Date.parse(r.effective_from as string), 'EMPTY_VALIDITY_INTERVAL');
  return freeze(r as unknown as TemporalCoordinates);
}
// Half-open validity intervals: expiry/revocation/supersession invalidate at the cut.
// Truth and knowledge are independent, so later-recorded truth is never silently known.
export function temporalAsOf(value: unknown, cut: string) {
  const t = decodeTemporal(value), at = Date.parse(instant(cut));
  const invalidated = [t.valid_until, t.superseded_at, t.revoked_at].some(s => s !== undefined && Date.parse(s) <= at);
  return freeze({
    as_of: cut,
    effective: Date.parse(t.effective_from) <= at && !invalidated,
    recorded_by_cut: Date.parse(t.recorded_at) <= at,
    observed_by_cut: t.observed_at === undefined ? 'UNKNOWN' as const : Date.parse(t.observed_at) <= at,
    requalification_due: t.requalification_at === undefined ? 'UNKNOWN' as const : Date.parse(t.requalification_at) <= at,
  });
}
export function knownAsOf(value: unknown, cut: string): boolean {
  const s = temporalAsOf(value, cut);
  return s.effective && s.recorded_by_cut && s.observed_by_cut !== false;
}
