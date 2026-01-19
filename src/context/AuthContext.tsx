import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { adminApi } from "@/services/admin/adminApi";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "zeinab-admin-auth";
const TOKEN_KEY = "zeinab-admin-token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY);
  });

  useEffect(() => {
    // Sync state to sessionStorage (one-way: state -> storage)
    if (isAuthenticated && token) {
      sessionStorage.setItem(AUTH_KEY, "true");
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }, [isAuthenticated, token]);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await adminApi.login(password);
      if (response && response.token) {
        // Store token immediately in sessionStorage
        sessionStorage.setItem(TOKEN_KEY, response.token);
        sessionStorage.setItem(AUTH_KEY, 'true');
        // Then update state
        setToken(response.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any existing auth data on login failure
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      setIsAuthenticated(false);
      setToken(null);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
