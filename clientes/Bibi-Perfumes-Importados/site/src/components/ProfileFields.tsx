"use client";

import { useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { formatCep, lookupCep, onlyDigits, UFS, type Profile } from "@/lib/profile";

export const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:border-brand";

export function Field({
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

export function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <fieldset
      id={id}
      className="flex scroll-mt-28 flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
    >
      <legend className="sr-only">{title}</legend>
      <h2 className="text-sm font-bold uppercase tracking-wide text-brand">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-6">{children}</div>
    </fieldset>
  );
}

// Nome + endereço (com busca automática pelo CEP). Usado no cadastro e em
// "Minha conta".
export default function ProfileFields({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
}) {
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "notfound">("idle");
  const numeroRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof Profile) => (value: string) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const handleCepChange = async (raw: string) => {
    const cep = formatCep(raw);
    setProfile((p) => ({ ...p, cep }));
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

  return (
    <>
      <Section title="Seus dados">
        <Field id="nome" label="Nome" className="sm:col-span-3">
          <input
            id="nome"
            required
            autoComplete="given-name"
            value={profile.nome}
            onChange={(e) => set("nome")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="sobrenome" label="Sobrenome" className="sm:col-span-3">
          <input
            id="sobrenome"
            required
            autoComplete="family-name"
            value={profile.sobrenome}
            onChange={(e) => set("sobrenome")(e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Localização" id="endereco">
        <Field id="cep" label="CEP" className="sm:col-span-2">
          <input
            id="cep"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            pattern="\d{5}-\d{3}"
            title="CEP com 8 números"
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
            onChange={(e) => set("rua")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="numero" label="Número" className="sm:col-span-2">
          <input
            id="numero"
            ref={numeroRef}
            required
            value={profile.numero}
            onChange={(e) => set("numero")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="complemento" label="Complemento" optional className="sm:col-span-3">
          <input
            id="complemento"
            autoComplete="address-line2"
            placeholder="Apto, bloco, casa…"
            value={profile.complemento}
            onChange={(e) => set("complemento")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="bairro" label="Bairro" className="sm:col-span-3">
          <input
            id="bairro"
            required
            value={profile.bairro}
            onChange={(e) => set("bairro")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="cidade" label="Cidade" className="sm:col-span-4">
          <input
            id="cidade"
            required
            autoComplete="address-level2"
            value={profile.cidade}
            onChange={(e) => set("cidade")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="uf" label="Estado" className="sm:col-span-2">
          <select
            id="uf"
            required
            value={profile.uf}
            onChange={(e) => set("uf")(e.target.value)}
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
    </>
  );
}
