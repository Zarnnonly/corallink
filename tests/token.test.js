import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTokenExpiry } from '../src/lib/token.js';

const makeJwt = (payload) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

test('getTokenExpiry returns exp in milliseconds for valid tokens', () => {
  assert.equal(getTokenExpiry(makeJwt({ exp: 1700000100 })), 1700000100 * 1000);
  assert.equal(getTokenExpiry(makeJwt({ exp: 1 })), 1000);
});

test('getTokenExpiry returns null for malformed or invalid tokens', () => {
  assert.equal(getTokenExpiry('not-a-jwt'), null);
  assert.equal(getTokenExpiry('abc.def'), null);
  assert.equal(getTokenExpiry(''), null);
  assert.equal(getTokenExpiry(null), null);
  assert.equal(getTokenExpiry(makeJwt({})), null);
  assert.equal(getTokenExpiry(makeJwt({ exp: 'soon' })), null);
});
