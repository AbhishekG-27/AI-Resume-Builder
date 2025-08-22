"use client";
import { useState, useEffect } from "react";
import { getCurrentSession } from "@/lib/actions/user.actions";

interface User {
  $id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentSession();
        setUser(currentUser);
      } catch (err: any) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, loading, error };
};
