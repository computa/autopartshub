// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, me as apiMe, setAuthToken } from '../api';  // ← note the new import

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  /* ───────── initial token check ───────── */
  useEffect(() => {
    if (!token) return;

    setAuthToken(token);          // <── makes all later requests carry the token

    apiMe()
      .then(u => setUser(u))      // apiMe already returns { userId, isAdmin, username … }
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      });
  }, [token]);

  /* ───────── public helpers ───────── */
  const signIn = async (username, password) => {
    const resp = await apiLogin(username, password);   // { token, userId, isAdmin … }
    localStorage.setItem('token', resp.token);
    setAuthToken(resp.token);
    setToken(resp.token);
    setUser({ userId: resp.userId, isAdmin: resp.isAdmin, username: resp.username });
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

