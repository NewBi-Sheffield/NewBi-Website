"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthContext = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string) => Promise<{ error: string | null }>;
  updateName: (name: string) => Promise<{ error: string | null }>;
  updateEmail: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthContext>({
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signup(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  async function updateName(name: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    return { error: error?.message ?? null };
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
  const isAdmin = !!user?.user_metadata?.is_admin;

  return (
    <Ctx.Provider value={{ isLoggedIn: !!user, isAdmin, userId: user?.id ?? null, email: user?.email ?? null, name, login, signup, updateName, updateEmail, updatePassword, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
