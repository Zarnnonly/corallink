import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom-setup.js';

setupDom();

const { createElement: h, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { MemoryRouter, Routes, Route } = await import('react-router-dom');
const { AuthProvider } = await import('../src/context/AuthContext.jsx');
const { default: ProtectedRoute } = await import('../src/components/ProtectedRoute.jsx');

const makeJwt = (exp) => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;
const profileReply = (role) => new Response(JSON.stringify({ success: true, data: { nama: 'Test User', role, email: 'test@example.com' } }), { status: 200, headers: { 'Content-Type': 'application/json' } });

const renderRoute = async (allowedRoles) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(h(MemoryRouter, { initialEntries: ['/protected'] },
      h(AuthProvider, null,
        h(Routes, null,
          h(Route, { path: '/protected', element: h(ProtectedRoute, { allowedRoles }, h('div', null, 'Secret Content')) }),
          h(Route, { path: '/signin', element: h('div', null, 'Sign In Page') }),
          h(Route, { path: '/', element: h('div', null, 'Home Page') })))));
  });
  return { root, container };
};

const cleanup = async (root) => {
  await act(async () => { root.unmount(); });
  localStorage.clear();
  delete globalThis.fetch;
  mock.timers.reset();
};

test('ProtectedRoute shows a restoring state while the session loads', async () => {
  localStorage.setItem('corallink_token', makeJwt(Math.floor(Date.now() / 1000) + 3600));
  mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.now() });
  globalThis.fetch = () => new Promise(() => {});
  const { root, container } = await renderRoute(['user']);
  assert.ok(container.querySelector('[role="status"]')?.textContent.includes('Restoring session'));
  await cleanup(root);
});

test('ProtectedRoute redirects to /signin when unauthenticated', async () => {
  const { root, container } = await renderRoute(['user']);
  assert.equal(container.textContent, 'Sign In Page');
  await cleanup(root);
});

test('ProtectedRoute redirects to / when the role is not allowed', async () => {
  localStorage.setItem('corallink_token', makeJwt(Math.floor(Date.now() / 1000) + 3600));
  globalThis.fetch = async () => profileReply('investor');
  const { root, container } = await renderRoute(['admin']);
  assert.equal(container.textContent, 'Home Page');
  await cleanup(root);
});

test('ProtectedRoute renders children for an allowed role', async () => {
  localStorage.setItem('corallink_token', makeJwt(Math.floor(Date.now() / 1000) + 3600));
  globalThis.fetch = async () => profileReply('admin');
  const { root, container } = await renderRoute(['admin']);
  assert.equal(container.textContent, 'Secret Content');
  await cleanup(root);
});
