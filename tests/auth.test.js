import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom-setup.js';

setupDom();

const { createElement, act, useEffect } = await import('react');
const { createRoot } = await import('react-dom/client');
const { AuthProvider, useAuth } = await import('../src/context/AuthContext.jsx');

const makeJwt = (exp) => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;
const okProfile = () => new Response(JSON.stringify({ success: true, data: { nama: 'Test User', role: 'investor', email: 'test@example.com' } }), { status: 200, headers: { 'Content-Type': 'application/json' } });

const renderAuth = async () => {
  let ctx;
  const Capture = () => {
    const value = useAuth();
    useEffect(() => { ctx = value; });
    return null;
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => { root.render(createElement(AuthProvider, null, createElement(Capture))); });
  return { getCtx: () => ctx, root };
};

const cleanup = async (root) => {
  await act(async () => { root.unmount(); });
  localStorage.clear();
  delete globalThis.fetch;
  mock.timers.reset();
};

test('AuthProvider finishes loading without a session when no token is stored', async () => {
  const { getCtx, root } = await renderAuth();
  assert.equal(getCtx().loading, false);
  assert.equal(getCtx().user, null);
  await cleanup(root);
});

test('AuthProvider logs out immediately when the stored token is expired', async () => {
  localStorage.setItem('corallink_token', makeJwt(Math.floor(Date.now() / 1000) - 60));
  let fetchCalled = false;
  globalThis.fetch = async () => { fetchCalled = true; return okProfile(); };
  const { getCtx, root } = await renderAuth();
  assert.equal(localStorage.getItem('corallink_token'), null);
  assert.equal(getCtx().user, null);
  assert.equal(getCtx().loading, false);
  assert.equal(fetchCalled, false);
  await cleanup(root);
});

test('AuthProvider restores the session and logs out proactively at token expiry', async () => {
  const now = 1700000000000;
  mock.timers.enable({ apis: ['Date', 'setTimeout'], now });
  localStorage.setItem('corallink_token', makeJwt(now / 1000 + 60));
  globalThis.fetch = async () => okProfile();
  const { getCtx, root } = await renderAuth();
  assert.equal(getCtx().user?.name, 'Test User');
  assert.equal(getCtx().user?.role, 'user');
  assert.equal(getCtx().loading, false);
  await act(async () => { mock.timers.tick(60_000); });
  assert.equal(localStorage.getItem('corallink_token'), null);
  assert.equal(getCtx().user, null);
  assert.equal(getCtx().error, 'Your session expired. Please sign in again.');
  await cleanup(root);
});

test('logout clears the stored token and user state', async () => {
  localStorage.setItem('corallink_token', makeJwt(Math.floor(Date.now() / 1000) + 3600));
  globalThis.fetch = async () => okProfile();
  const { getCtx, root } = await renderAuth();
  assert.ok(getCtx().user);
  await act(async () => { getCtx().logout(); });
  assert.equal(localStorage.getItem('corallink_token'), null);
  assert.equal(getCtx().user, null);
  assert.equal(getCtx().error, '');
  await cleanup(root);
});
