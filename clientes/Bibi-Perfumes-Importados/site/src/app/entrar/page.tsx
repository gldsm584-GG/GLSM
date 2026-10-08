"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import { inputClass } from "@/components/ProfileFields";
import { useAuth } from "@/lib/auth-context";
import { afterLoginPath } from "@/lib/redirect";
import { supabase } from "@/lib/supabase";

export default function EntrarPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }
    const { data } = await supabase.auth.getUser();
    router.push(afterLoginPath(data.user));
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-brand-dark">Entrar</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Entre na sua conta pra agilizar seus pedidos.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
      >
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          Senha
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Aguarde..." : "Entrar"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-neutral-500">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-brand hover:underline">
          Criar conta
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-neutral-400">
        Não precisa de conta pra comprar — dá pra finalizar direto pelo WhatsApp.
      </p>
    </div>
  );
}
