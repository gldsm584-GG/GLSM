"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import Icon from "@/components/Icon";
import { useAuth } from "@/lib/auth-context";
import { supabaseConfigured } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-neutral-200 px-3 py-2.5 outline-none focus:border-azul";

export default function EntrarPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
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
    router.push("/admin");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold text-ink">Área da loja</h1>
      <p className="mb-6 mt-1 text-sm text-neutral-500">
        Entre pra cadastrar carros e acompanhar as negociações.
      </p>

      {!supabaseConfigured ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
          O site está em modo demonstração: o banco de dados (Supabase) ainda
          não foi ligado, então o painel fica desativado.
        </p>
      ) : (
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
            <span className="relative">
              <input
                type={visible ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Esconder senha" : "Mostrar senha"}
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 hover:text-azul"
              >
                <Icon name={visible ? "eye-off" : "eye"} className="h-5 w-5" />
              </button>
            </span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      )}
    </div>
  );
}
