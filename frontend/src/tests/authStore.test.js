import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build a minimal, unsigned JWT with the given payload (for unit tests only). */
function makeJwt(payload) {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = btoa(JSON.stringify(payload));
  const sig     = 'fakesig';
  return `${header}.${body}.${sig}`;
}

// ── Mock localStorage ──────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (k)    => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v); },
    removeItem: (k)    => { delete store[k]; },
    clear:      ()     => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ── Zustand re-import helper ───────────────────────────────────────────────

/** Import a fresh authStore instance per test to avoid cross-test state leakage. */
async function freshStore() {
  vi.resetModules();
  const mod = await import('../store/authStore.js');
  return mod.default;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('authStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  // ── login ────────────────────────────────────────────────────────────────

  it('login() sets isAuthenticated to true', async () => {
    const useStore = await freshStore();
    const token = makeJwt({ sub: 'user@test.com', role: 'user', exp: 9999999999 });
    useStore.getState().login(token, { id: 1, username: 'testuser', email: 'user@test.com' });

    const { isAuthenticated } = useStore.getState();
    expect(isAuthenticated).toBe(true);
  });

  it('login() stores the token in localStorage', async () => {
    const useStore = await freshStore();
    const token = makeJwt({ sub: 'user@test.com', role: 'user', exp: 9999999999 });
    useStore.getState().login(token, { id: 1, username: 'testuser', email: 'user@test.com' });

    expect(localStorage.getItem('token')).toBe(token);
  });

  it('login() extracts role from JWT and sets it on user', async () => {
    const useStore = await freshStore();
    const token = makeJwt({ sub: 'admin@test.com', role: 'admin', exp: 9999999999 });
    useStore.getState().login(token, { id: 2, username: 'admin', email: 'admin@test.com' });

    const { user } = useStore.getState();
    expect(user.role).toBe('admin');
  });

  it('login() falls back to role "user" when JWT has no role claim', async () => {
    const useStore = await freshStore();
    const token = makeJwt({ sub: 'noRole@test.com', exp: 9999999999 });
    useStore.getState().login(token, { id: 3, username: 'norole', email: 'noRole@test.com' });

    const { user } = useStore.getState();
    expect(user.role).toBe('user');
  });

  // ── logout ───────────────────────────────────────────────────────────────

  it('logout() resets state and removes token from localStorage', async () => {
    const useStore = await freshStore();
    const token = makeJwt({ sub: 'user@test.com', role: 'user', exp: 9999999999 });
    useStore.getState().login(token, { id: 1, username: 'testuser', email: 'user@test.com' });

    useStore.getState().logout();

    const { isAuthenticated, user, token: storedToken } = useStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(storedToken).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  // ── updateUser ───────────────────────────────────────────────────────────

  it('updateUser() preserves the role from the current JWT', async () => {
    const useStore = await freshStore();
    const token = makeJwt({ sub: 'admin@test.com', role: 'admin', exp: 9999999999 });
    useStore.getState().login(token, { id: 2, username: 'admin', email: 'admin@test.com' });

    // Simulate a profile update that might not include the role
    useStore.getState().updateUser({ id: 2, username: 'admin_renamed', email: 'admin@test.com' });

    const { user } = useStore.getState();
    expect(user.username).toBe('admin_renamed');
    expect(user.role).toBe('admin');
  });
});
