import crypto from 'node:crypto';

function normalize(value: unknown, path = '$'): unknown {
  if (value === undefined) throw new Error(`canonical-json undefined at ${path}`);
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`canonical-json nonfinite number at ${path}`);
    return value;
  }
  if (Array.isArray(value)) return value.map((item, index) => normalize(item, `${path}[${index}]`));
  if (typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) output[key] = normalize(input[key], `${path}.${key}`);
    return output;
  }
  throw new Error(`canonical-json unsupported ${typeof value} at ${path}`);
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(normalize(value));
}

export function canonicalBytes(value: unknown): Buffer {
  return Buffer.from(canonicalJson(value), 'utf8');
}

export function sha256Bytes(bytes: Uint8Array): string {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

export function sha256Canonical(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

export function gitBlobSha1(bytes: Uint8Array): string {
  const header = Buffer.from(`blob ${bytes.byteLength}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(bytes).digest('hex');
}
