"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthContext = {
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  updateName: (name: string) => Promise<{ error: string | null }>;
  updateEmail: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthContext>({
  loading: true,
  isLoggedIn: false,
  isAdmin: false,
  userId: null,
  email: null,
  name: null,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  updateName: async () => ({ error: null }),
  updateEmail: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchAdmin(userId: string) {
    try {
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", userId).single();
      setIsAdmin(!!data?.is_admin);
    } catch {
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      fetchAdmin(u.id).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signup(email: string, password: string, name: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
        data: { full_name: name },
      },
    });
    return { error: error?.message ?? null };
  }

  async function updateName(name: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) return { error: error.message };
    if (user) {
      await supabase.from("profiles").update({ name }).eq("user_id", user.id);
    }
    return { error: null };
  }

  async function updateEmail(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({ email });
    return { error: error?.message ?? null };
  }

  async function updatePassword(password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const name = user?.user_metadata?.full_name ?? null;

  return (
    <Ctx.Provider value={{ loading, isLoggedIn: !!user, isAdmin, userId: user?.id ?? null, email: user?.email ?? null, name, login, signup, updateName, updateEmail, updatePassword, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
