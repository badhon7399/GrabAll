import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('grabAllUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('grabAllUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      localStorage.setItem('grabAllUser', JSON.stringify(data));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      localStorage.setItem('grabAllUser', JSON.stringify(data));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('grabAllUser');
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let currentToken = user?.token;

    const mergeHeaders = (token: string | undefined) => {
      const headers = new Headers(options.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    };

    options.headers = mergeHeaders(currentToken);
    let res = await fetch(url, options);

    if (res.status === 401 && user) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const updatedUser = { ...user, token: data.token };
          setUser(updatedUser);
          localStorage.setItem('grabAllUser', JSON.stringify(updatedUser));

          options.headers = mergeHeaders(data.token);
          res = await fetch(url, options);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Silent token refresh failed:', err);
        logout();
      }
    }

    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
