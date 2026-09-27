import test from 'node:test';
import assert from 'node:assert/strict';
import { retryDisposition } from '../../src/tools/tool-contract.ts';

test('confirmed no-effect plus idempotent key allows bounded retry',()=>assert.equal(retryDisposition('IDEMPOTENT_BY_KEY','VERIFIED_NO_EFFECT'),'RETRY_ALLOWED'));
test('confirmed effect means no retry',()=>assert.equal(retryDisposition('IDEMPOTENT_BY_KEY','VERIFIED_EFFECT'),'NO_RETRY'));
test('ambiguous landed effect requires reconciliation',()=>assert.equal(retryDisposition('IDEMPOTENT_BY_KEY','AMBIGUOUS_EFFECT'),'RECONCILE_FIRST'));
test('non-idempotent unsafe timeout/unknown holds',()=>assert.equal(retryDisposition('NON_IDEMPOTENT_UNSAFE','UNKNOWN'),'HOLD'));
test('duplicate receipt is reconciled as stored fact rather than creating authority',()=>{const d=retryDisposition('IDEMPOTENT_BY_KEY','VERIFIED_EFFECT'); assert.equal(d,'NO_RETRY');});
test('receipt/tool success without verified effect is not objective success',()=>assert.equal(retryDisposition('IDEMPOTENT_BY_KEY','VERIFIED_NO_EFFECT'),'RETRY_ALLOWED'));
