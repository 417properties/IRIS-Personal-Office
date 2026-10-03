// Batch-A v1.0: strict boundary primitives. No coercion or default state.
export class SemanticError extends Error {
  constructor(code: string) { super(code); this.name = 'SemanticError'; }
}
export function demand(condition: unknown, code: string): asserts condition {
  if (!condition) throw new SemanticError(code);
}
export function record(value: unknown, required: readonly string[], optional: readonly string[] = []): Record<string, unknown> {
  demand(value !== null && typeof value === 'object' && !Array.isArray(value), 'OBJECT_REQUIRED');
  demand(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null, 'PLAIN_OBJECT_REQUIRED');
  const r = value as Record<string, unknown>;
  demand(Reflect.ownKeys(r).every(k => typeof k === 'string' && Object.getOwnPropertyDescriptor(r, k)?.enumerable && Object.hasOwn(Object.getOwnPropertyDescriptor(r, k)!, 'value')), 'DATA_COORDINATES_REQUIRED');
  demand(required.every(k => Object.hasOwn(r, k)), 'MISSING_COORDINATE');
  demand(Object.keys(r).every(k => [...required, ...optional].includes(k)), 'UNMAPPED_COORDINATE');
  return r;
}
export function text(value: unknown): string {
  demand(typeof value === 'string' && value.length > 0 && value.trim() === value, 'NONEMPTY_EXACT_STRING_REQUIRED');
  return value;
}
export function strings(value: unknown): string[] {
  demand(Array.isArray(value), 'ARRAY_REQUIRED');
  demand(Array.from({ length: value.length }, (_, i) => Object.hasOwn(value, i)).every(Boolean), 'DENSE_ARRAY_REQUIRED');
  return value.map(text);
}
export function evidence(value: unknown): string[] {
  const refs = strings(value); demand(refs.length > 0, 'EVIDENCE_REQUIRED'); return refs;
}
export function member<const T extends readonly string[]>(value: unknown, states: T): T[number] {
  demand(typeof value === 'string' && states.includes(value), 'UNSUPPORTED_STATE');
  return value as T[number];
}
export function version(value: unknown): number {
  demand(Number.isSafeInteger(value) && (value as number) > 0, 'POSITIVE_SAFE_VERSION_REQUIRED');
  return value as number;
}
export function freeze<T>(value: T): Readonly<T> {
  const copy = structuredClone(value);
  function seal(v: unknown): void {
    if (v !== null && typeof v === 'object') { Object.values(v).forEach(seal); Object.freeze(v); }
  }
  seal(copy); return copy;
}
