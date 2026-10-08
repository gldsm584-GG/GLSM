"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import PasswordInput from "@/components/PasswordInput";
import ProfileFields, { Field, inputClass, Section } from "@/components/ProfileFields";
import { useAuth } from "@/lib/auth-context";
import { emptyProfile, onlyDigits, type Profile } from "@/lib/profile";
import { afterLoginPath } from "@/lib/redirect";
import { supabase } from "@/lib/supabase";

export default function CadastroPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (onlyDigits(profile.cep).length !== 8) {
      setError("Confere o CEP: são 8 números.");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, {
      ...profile,
      nome: profile.nome.trim(),
      sobrenome: profile.sobrenome.trim(),
    });

    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    if (result.needsConfirmation) {
      setLoading(false);
      setInfo(
        "Conta criada! Enviamos um link pro seu email — confirme por lá e depois é só entrar."
      );
      return;
    }

    const { data } = await supabase.auth.getUser();
    router.push(afterLoginPath(data.user));
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-brand-dark">Criar conta</h1>
      <p className="mb-6 mt-1 text-neutral-500">
        Cadastre seus dados uma vez e eles já vão junto no seu pedido pelo WhatsApp.
      </p>

      {info ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="font-semibold text-green-700">{info}</p>
          <Link
            href="/entrar"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
          >
            Ir pra tela de entrar
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <ProfileFields profile={profile} setProfile={setProfile} />

          <Section title="Acesso à conta">
            <Field id="email" label="Email" className="sm:col-span-6">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="password" label="Crie uma senha (mínimo 6 caracteres)" className="sm:col-span-6">
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
            </Field>
          </Section>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Criar conta"}
          </button>
          <p className="text-xs text-neutral-400">
            Seus dados ficam guardados só pra agilizar seus pedidos — veja a{" "}
            <Link href="/politica-de-privacidade" className="underline hover:text-brand">
              Política de Privacidade
            </Link>
            .
          </p>
        </form>
      )}

      <p className="mt-5 text-sm text-neutral-500">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
