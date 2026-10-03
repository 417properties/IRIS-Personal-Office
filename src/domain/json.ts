import { demand, record } from '../semantic-kernel/validation.ts';
export function jsonValue(v: unknown): unknown {
  if (v === null || typeof v === 'boolean' || typeof v === 'string') return v;
  if (typeof v === 'number') { demand(Number.isFinite(v), 'FINITE_JSON_NUMBER'); return v; }
  if (Array.isArray(v)) { return denseArray(v).map(jsonValue); }
  demand(v !== undefined && typeof v === 'object','JSON_VALUE_REQUIRED');
  const r=record(v,[],Object.keys(v as object)); return Object.fromEntries(Object.entries(r).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>[k,jsonValue(x)]));
}
export function denseArray(v:unknown):unknown[]{
 demand(Array.isArray(v)&&Object.getPrototypeOf(v)===Array.prototype,'ARRAY_REQUIRED');
 demand(Reflect.ownKeys(v).every(k=>k==='length'||typeof k==='string'&&/^(0|[1-9][0-9]*)$/.test(k)&&Number(k)<v.length&&Object.hasOwn(Object.getOwnPropertyDescriptor(v,k)!,'value'))&&Object.keys(v).length===v.length&&Array.from({length:v.length},(_,i)=>Object.hasOwn(v,i)).every(Boolean),'DENSE_DATA_ARRAY');
 return v;
}
// JSON.parse cannot report duplicate keys. Reject them before semantic decoding
// so contradictory schema/principal/version coordinates cannot be erased.
export function parseJSON(wire:string):unknown{
 const parsed=JSON.parse(wire);let at=0;
 const space=()=>{while(/\s/.test(wire[at]??'')&&at<wire.length)at++;};
 function token():string {space();const start=at++;while(at<wire.length){if(wire[at]==='\\'){at+=2;continue;}if(wire[at++]==='"')break;}return JSON.parse(wire.slice(start,at));}
 function scan():void{
  space();const c=wire[at];
  if(c==='"'){token();return;}
  if(c==='{'){at++;space();const keys=new Set<string>();while(wire[at]!=='}'){const key=token();demand(!keys.has(key),'DUPLICATE_JSON_COORDINATE');keys.add(key);space();at++;scan();space();if(wire[at]===','){at++;continue;}break;}at++;return;}
  if(c==='['){at++;space();while(wire[at]!==']'){scan();space();if(wire[at]===','){at++;continue;}break;}at++;return;}
  while(at<wire.length&&!/[\s,}\]]/.test(wire[at]!))at++;
 }
 scan();return parsed;
}
