// lib/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentSession } from "@/lib/actions/user.actions";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  //   logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount and refresh
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentSession();
      if (!user) {
        setUser(null);
        return;
      }
      setUser({
        id: user.$id,
        email: user.email,
        name: user.name,
        resumes: user.resume_analysis,
        no_of_analysis_left: user.no_of_analysis_left,
        createdAt: user.$createdAt,
      });
    } catch (err) {
      console.log("No active session", err);
      setUser(null);
      setError(null); // Don't set error for no session
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    // logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
