import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom-setup.js';

setupDom();

const { createElement, act, useEffect } = await import('react');
const { createRoot } = await import('react-dom/client');
const { ThemeProvider, useTheme } = await import('../src/context/ThemeContext.jsx');

const mockSystemTheme = (dark) => {
  const listeners = new Set();
  window.matchMedia = (query) => ({
    matches: dark,
    media: query,
    onchange: null,
    addEventListener: (type, cb) => { if (type === 'change') listeners.add(cb); },
    removeEventListener: (type, cb) => { listeners.delete(cb); },
    addListener: (cb) => listeners.add(cb),
    removeListener: (cb) => listeners.delete(cb),
    dispatchEvent: () => true,
  });
  return { setDark: (next) => { dark = next; listeners.forEach((cb) => cb({ matches: next })); } };
};

const renderTheme = async () => {
  let ctx;
  const Capture = () => {
    const value = useTheme();
    useEffect(() => { ctx = value; });
    return null;
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => { root.render(createElement(ThemeProvider, null, createElement(Capture))); });
  return { getCtx: () => ctx, root };
};

const cleanup = async (root) => {
  await act(async () => { root.unmount(); });
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
};

test('ThemeProvider defaults to dark when the OS prefers dark and nothing is stored', async () => {
  mockSystemTheme(true);
  const { getCtx, root } = await renderTheme();
  assert.equal(getCtx().theme, 'dark');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
  await cleanup(root);
});

test('ThemeProvider defaults to light when the OS prefers light', async () => {
  mockSystemTheme(false);
  const { getCtx, root } = await renderTheme();
  assert.equal(getCtx().theme, 'light');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'light');
  await cleanup(root);
});

test('toggleTheme flips the theme and persists it to localStorage', async () => {
  mockSystemTheme(false);
  const { getCtx, root } = await renderTheme();
  assert.equal(getCtx().theme, 'light');
  await act(async () => { getCtx().toggleTheme(); });
  assert.equal(getCtx().theme, 'dark');
  assert.equal(localStorage.getItem('corallink_theme'), 'dark');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'dark');
  await act(async () => { getCtx().toggleTheme(); });
  assert.equal(getCtx().theme, 'light');
  assert.equal(localStorage.getItem('corallink_theme'), 'light');
  await cleanup(root);
});

test('a stored theme choice wins over the OS preference', async () => {
  mockSystemTheme(true);
  localStorage.setItem('corallink_theme', 'light');
  const { getCtx, root } = await renderTheme();
  assert.equal(getCtx().theme, 'light');
  assert.equal(document.documentElement.getAttribute('data-theme'), 'light');
  await cleanup(root);
});

test('follows OS changes until the user explicitly picks a theme', async () => {
  const system = mockSystemTheme(false);
  const { getCtx, root } = await renderTheme();
  assert.equal(getCtx().theme, 'light');
  await act(async () => { system.setDark(true); });
  assert.equal(getCtx().theme, 'dark');
  await act(async () => { getCtx().toggleTheme(); });
  assert.equal(getCtx().theme, 'light');
  await act(async () => { system.setDark(false); });
  assert.equal(getCtx().theme, 'light');
  await cleanup(root);
});
