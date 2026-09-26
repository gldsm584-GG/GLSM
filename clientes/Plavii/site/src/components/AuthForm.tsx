"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/lib/auth-context";
import {
  emptyProfile,
  formatCep,
  formatPhone,
  isValidPhone,
  lookupCep,
  onlyDigits,
  UFS,
  type Profile,
} from "@/lib/profile";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:border-brand";

function Field({
  id,
  label,
  optional,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
        {optional && <span className="ml-1 font-normal text-neutral-400">(opcional)</span>}
      </label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
      <legend className="px-2 text-sm font-bold uppercase tracking-wide text-brand">
        {title}
      </legend>
      <div className="grid gap-3 sm:grid-cols-6">{children}</div>
    </fieldset>
  );
}

export default function AuthForm({ mode }: { mode: "entrar" | "cadastro" }) {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "notfound">("idle");
  const numeroRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof Profile) => (value: string) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const handleCepChange = async (raw: string) => {
    const cep = formatCep(raw);
    setField("cep")(cep);
    setCepStatus("idle");
    if (onlyDigits(cep).length !== 8) return;

    setCepStatus("loading");
    const found = await lookupCep(cep);
    if (!found) {
      setCepStatus("notfound");
      return;
    }
    setCepStatus("idle");
    setProfile((p) => ({ ...p, ...found }));
    numeroRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "cadastro") {
      if (!isValidPhone(profile.telefone)) {
        setError("Confere o número de celular: use DDD + número.");
        return;
      }
      if (profile.telefone2 && !isValidPhone(profile.telefone2)) {
        setError("Confere o segundo número: use DDD + número.");
        return;
      }
      if (onlyDigits(profile.cep).length !== 8) {
        setError("Confere o CEP: são 8 números.");
        return;
      }
    }

    setLoading(true);

    if (mode === "entrar") {
      const result = await signIn(email, password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }

    const result = await signUp(email, password, profile);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsConfirmation) {
      setInfo("Conta criada! Verifique seu email pra confirmar antes de entrar.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  const submitButton = (
    <button
      type="submit"
      disabled={loading}
      className="rounded-full bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
    >
      {loading ? "Aguarde..." : mode === "entrar" ? "Entrar" : "Criar conta"}
    </button>
  );

  const messages = (
    <>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {info && <p className="text-sm text-green-600">{info}</p>}
    </>
  );

  if (mode === "entrar") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="email" label="Email">
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
        <Field id="password" label="Senha">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </Field>
        {messages}
        {submitButton}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Section title="Seus dados">
        <Field id="nome" label="Nome" className="sm:col-span-3">
          <input
            id="nome"
            required
            autoComplete="given-name"
            value={profile.nome}
            onChange={(e) => setField("nome")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="sobrenome" label="Sobrenome" className="sm:col-span-3">
          <input
            id="sobrenome"
            required
            autoComplete="family-name"
            value={profile.sobrenome}
            onChange={(e) => setField("sobrenome")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="telefone" label="Celular / WhatsApp" className="sm:col-span-3">
          <input
            id="telefone"
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(61) 99999-9999"
            value={profile.telefone}
            onChange={(e) => setField("telefone")(formatPhone(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field id="telefone2" label="Segundo número pra contato" optional className="sm:col-span-3">
          <input
            id="telefone2"
            type="tel"
            inputMode="numeric"
            placeholder="(61) 3333-4444"
            value={profile.telefone2}
            onChange={(e) => setField("telefone2")(formatPhone(e.target.value))}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Localização">
        <Field id="cep" label="CEP" className="sm:col-span-2">
          <input
            id="cep"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={profile.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            className={inputClass}
          />
        </Field>
        <p className="self-end pb-2 text-xs text-neutral-500 sm:col-span-4">
          {cepStatus === "loading" && "Buscando endereço…"}
          {cepStatus === "notfound" && "CEP não encontrado — preencha o endereço manualmente."}
          {cepStatus === "idle" && "Digite o CEP e a gente preenche o resto pra você."}
        </p>
        <Field id="rua" label="Rua / Avenida" className="sm:col-span-4">
          <input
            id="rua"
            required
            autoComplete="address-line1"
            value={profile.rua}
            onChange={(e) => setField("rua")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="numero" label="Número" className="sm:col-span-2">
          <input
            id="numero"
            ref={numeroRef}
            required
            value={profile.numero}
            onChange={(e) => setField("numero")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="complemento" label="Complemento" optional className="sm:col-span-3">
          <input
            id="complemento"
            autoComplete="address-line2"
            placeholder="Apto, bloco, casa…"
            value={profile.complemento}
            onChange={(e) => setField("complemento")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="bairro" label="Bairro" className="sm:col-span-3">
          <input
            id="bairro"
            required
            value={profile.bairro}
            onChange={(e) => setField("bairro")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="cidade" label="Cidade" className="sm:col-span-4">
          <input
            id="cidade"
            required
            autoComplete="address-level2"
            value={profile.cidade}
            onChange={(e) => setField("cidade")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="uf" label="Estado" className="sm:col-span-2">
          <select
            id="uf"
            required
            value={profile.uf}
            onChange={(e) => setField("uf")(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              UF
            </option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Field>
      </Section>

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
        <Field id="password" label="Senha (mínimo 6 caracteres)" className="sm:col-span-6">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
        </Field>
      </Section>

      {messages}
      {submitButton}
    </form>
  );
}
