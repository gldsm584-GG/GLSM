"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fullName, type Profile } from "./profile";
import { supabase } from "./supabase";

// Mesmo login serve pro cliente (cadastro em /cadastro) e pro admin
// (email na lista de src/lib/admin.ts).
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profile: Profile
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Mensagens do Supabase vêm em inglês — traduz as que o cliente pode ver.
function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email ou senha incorretos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Esse email já tem conta. Entre com ele ou use outro email.";
  if (m.includes("email not confirmed"))
    return "Confirme seu email (link enviado na sua caixa de entrada) antes de entrar.";
  if (m.includes("password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
  if (m.includes("invalid") && m.includes("email")) return "Esse email não parece válido.";
  return "Não deu certo. Confere os dados e tenta de novo.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, profile: Profile) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { ...profile, full_name: fullName(profile) } },
    });
    if (error) return { error: translateError(error.message), needsConfirmation: false };
    // Com "Confirm email" ligado o Supabase não devolve sessão, e com email
    // repetido devolve um usuário sem identidades (não avisa o erro direto).
    if (data.user && data.user.identities?.length === 0) {
      return { error: translateError("already registered"), needsConfirmation: false };
    }
    return { error: null, needsConfirmation: !data.session };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? translateError(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
