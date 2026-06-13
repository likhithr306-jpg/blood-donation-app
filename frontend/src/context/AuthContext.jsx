import { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'blood_donation_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setToken(parsed.token);
      setDarkMode(parsed.darkMode ?? false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token, darkMode }));
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [user, token, darkMode]);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setToken(result.token);
    return result;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const registerDonor = async (payload) => {
    const result = await authService.registerDonor(payload);
    setUser(result.user);
    setToken(result.token);
    return result;
  };

  const registerAcceptor = async (payload) => {
    const result = await authService.registerAcceptor(payload);
    setUser(result.user);
    setToken(result.token);
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, registerDonor, registerAcceptor, darkMode, setDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}
