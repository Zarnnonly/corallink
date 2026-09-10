import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { request, getToken, setToken } from '../lib/api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const adaptUser = (user) => ({ ...user, name: user.nama, role: user.role === 'investor' ? 'user' : user.role });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const revision = useRef(0);
  const logout = useCallback(() => {
    revision.current++;
    setToken(null);
    localStorage.removeItem('corallink_user');
    setUser(null);
    setError('');
    setLoading(false);
  }, []);
  const restoreSession = useCallback(async () => {
    const current = ++revision.current;
    setError('');
    if (!getToken()) { setLoading(false); return; }
    setLoading(true);
    try {
      const profile = await request('/api/auth/profile', { auth: true });
      if (current === revision.current) setUser(adaptUser(profile));
    } catch (e) {
      if (current === revision.current) {
        setUser(null);
        if (e.status === 404) setToken(null);
        setError(e.message);
      }
    } finally { if (current === revision.current) setLoading(false); }
  }, []);
  useEffect(() => {
    const expired = () => { logout(); setError('Your session expired. Please sign in again.'); };
    const storage = (e) => { if (e.key === 'corallink_token') { revision.current++; setUser(null); restoreSession(); } };
    window.addEventListener('corallink:unauthorized', expired);
    window.addEventListener('storage', storage);
    restoreSession();
    return () => { revision.current++; window.removeEventListener('corallink:unauthorized', expired); window.removeEventListener('storage', storage); };
  }, [logout, restoreSession]);
  const authenticate = async (path, body) => {
    const current = ++revision.current;
    const data = await request(path, { method: 'POST', body });
    if (!data?.token || !data?.user) throw new Error('Invalid authentication response.');
    if (current !== revision.current) throw new Error('Session changed. Please sign in again.');
    setToken(data.token);
    setUser(adaptUser(data.user));
    setError('');
    setLoading(false);
  };
  return <AuthContext.Provider value={{ user, loading, error, restoreSession, logout,
    login: (email, password) => authenticate('/api/auth/login', { email, password }),
    register: (name, email, password, phone) => authenticate('/api/auth/register', { name, email, password, phone }),
  }}>{children}</AuthContext.Provider>;
};
