"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Address } from "@/lib/addresses";
import { formatCep, lookupCep, onlyDigits, UFS } from "@/lib/profile";

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

const empty: Omit<Address, "id"> = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export default function AddressForm({
  initial,
  title,
  saving,
  error,
  onSave,
  onCancel,
}: {
  initial: Address | null;
  title: string;
  saving: boolean;
  error: string | null;
  onSave: (address: Address) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>(
    initial ? { ...initial } : empty
  );
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "notfound">("idle");
  const numeroRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

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
    setForm((f) => ({ ...f, ...found }));
    numeroRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onlyDigits(form.cep).length !== 8) {
      setCepStatus("notfound");
      return;
    }
    onSave({ ...form, id: initial?.id ?? crypto.randomUUID() });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 font-semibold text-neutral-800">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-6">
        <Field id="addr-cep" label="CEP" className="sm:col-span-2">
          <input
            id="addr-cep"
            required
            inputMode="numeric"
            placeholder="00000-000"
            value={form.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            className={inputClass}
          />
        </Field>
        <p className="self-end pb-2 text-xs text-neutral-500 sm:col-span-4">
          {cepStatus === "loading" && "Buscando endereço…"}
          {cepStatus === "notfound" && "CEP não encontrado — preencha o endereço manualmente."}
          {cepStatus === "idle" && "Digite o CEP e a gente preenche o resto."}
        </p>
        <Field id="addr-rua" label="Rua / Avenida" className="sm:col-span-4">
          <input
            id="addr-rua"
            required
            value={form.rua}
            onChange={(e) => setField("rua")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="addr-numero" label="Número" className="sm:col-span-2">
          <input
            id="addr-numero"
            ref={numeroRef}
            required
            value={form.numero}
            onChange={(e) => setField("numero")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="addr-complemento" label="Complemento" optional className="sm:col-span-3">
          <input
            id="addr-complemento"
            placeholder="Apto, bloco, casa…"
            value={form.complemento}
            onChange={(e) => setField("complemento")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="addr-bairro" label="Bairro" className="sm:col-span-3">
          <input
            id="addr-bairro"
            required
            value={form.bairro}
            onChange={(e) => setField("bairro")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="addr-cidade" label="Cidade" className="sm:col-span-4">
          <input
            id="addr-cidade"
            required
            value={form.cidade}
            onChange={(e) => setField("cidade")(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="addr-uf" label="Estado" className="sm:col-span-2">
          <select
            id="addr-uf"
            required
            value={form.uf}
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
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar endereço"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
