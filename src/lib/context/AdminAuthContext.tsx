import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { checkAuthStatusApi, loginWithGoogleApi, logoutApi, AuthUser } from '@/lib/api/projects';

interface AdminAuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (token: string, isAccessToken?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const authUser = await checkAuthStatusApi();
      setUser(authUser);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = async (token: string, isAccessToken: boolean = false) => {
    setIsLoading(true);
    try {
      const authUser = await loginWithGoogleApi(token, isAccessToken);
      setUser(authUser);
      setIsLoginModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user?.isAdmin),
        isLoading,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
