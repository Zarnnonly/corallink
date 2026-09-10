import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = guest, { role: 'user' | 'admin', email: string }

  // Load user from localStorage on mount (simple persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('corallink_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email) => {
    // Mock login logic
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const userData = { email, role };
    setUser(userData);
    localStorage.setItem('corallink_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('corallink_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
