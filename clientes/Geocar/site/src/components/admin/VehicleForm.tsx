"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Icon from "@/components/Icon";
import { slugify } from "@/lib/format";
import { resizeForUpload } from "@/lib/image-resize";
import type { Vehicle, VehicleInput } from "@/lib/types";
import { createVehicle, updateVehicle, uploadVehiclePhoto } from "@/lib/vehicles";

const CAMBIOS = ["Manual", "Automático", "Automatizado", "CVT"];
const COMBUSTIVEIS = ["Flex", "Gasolina", "Etanol", "Diesel", "Híbrido", "Elétrico"];

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-azul";

const vazio: VehicleInput = {
  slug: "",
  tipo: "carro",
  marca: "",
  modelo: "",
  versao: "",
  anoFabricacao: null,
  anoModelo: new Date().getFullYear(),
  km: null,
  cambio: "Manual",
  combustivel: "Flex",
  cor: "",
  motor: "",
  preco: null,
  status: "disponivel",
  destaque: false,
  opcionais: [],
  descricao: "",
  fotos: [],
};

function Campo({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium text-neutral-700 ${className}`}>
      {label}
      {children}
    </label>
  );
}

const numOuNull = (valor: string) => (valor.trim() === "" ? null : Number(valor));

export default function VehicleForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: Vehicle | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<VehicleInput>(() => {
    if (!editing) return vazio;
    return Object.fromEntries(
      Object.entries(editing).filter(([key]) => key !== "id" && key !== "createdAt")
    ) as VehicleInput;
  });
  const [opcionaisTexto, setOpcionaisTexto] = useState(form.opcionais.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);

  const set = <K extends keyof VehicleInput>(key: K, value: VehicleInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);
    setUploading(files.length);
    try {
      // Uma de cada vez, na ordem escolhida
      for (const file of files) {
        const blob = await resizeForUpload(file);
        const url = await uploadVehiclePhoto(blob);
        setForm((f) => ({ ...f, fotos: [...f.fotos, url] }));
        setUploading((n) => n - 1);
      }
    } catch {
      setError("Não deu pra enviar uma das fotos. Tenta de novo.");
    } finally {
      setUploading(0);
    }
  };

  const moverFoto = (de: number, para: number) =>
    setForm((f) => {
      if (para < 0 || para >= f.fotos.length) return f;
      const fotos = [...f.fotos];
      const [foto] = fotos.splice(de, 1);
      fotos.splice(para, 0, foto);
      return { ...f, fotos };
    });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (form.fotos.length === 0) {
      setError("Envia pelo menos uma foto antes de salvar.");
      return;
    }
    const opcionais = opcionaisTexto
      .split(/[,\n]/)
      .map((o) => o.trim())
      .filter(Boolean);
    const slug =
      form.slug || slugify(`${form.marca} ${form.modelo} ${form.versao} ${form.anoModelo}`);
    const dados = { ...form, opcionais, slug };

    setSaving(true);
    try {
      if (editing) await updateVehicle(editing.id, dados);
      else await createVehicle(dados);
      onDone();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg === "NO_PERMISSION"
          ? "O banco recusou a alteração. Confere se esse login está em is_admin() no Supabase."
          : msg.includes("duplicate")
            ? "Já existe um veículo com esse link. Muda a versão ou o ano."
            : "Não deu pra salvar. Tenta de novo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">
          {editing ? "Editar veículo" : "Novo veículo"}
        </h2>
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
          {(["carro", "moto"] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => set("tipo", tipo)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                form.tipo === tipo ? "bg-ink text-white" : "text-neutral-500"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* FOTOS */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-neutral-700">
          Fotos <span className="font-normal text-neutral-400">— a primeira é a capa</span>
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {form.fotos.map((src, i) => (
            <div
              key={src}
              className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 ${
                i === 0 ? "ring-2 ring-brand" : ""
              }`}
            >
              <Image src={src} alt={`Foto ${i + 1}`} fill sizes="120px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => set("fotos", form.fotos.filter((_, j) => j !== i))}
                aria-label="Remover foto"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button
                  type="button"
                  onClick={() => moverFoto(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Mover pra esquerda"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-0"
                >
                  <Icon name="chevron-left" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moverFoto(i, i + 1)}
                  disabled={i === form.fotos.length - 1}
                  aria-label="Mover pra direita"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-0"
                >
                  <Icon name="chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-300 text-center text-xs font-semibold text-neutral-500 hover:border-azul hover:text-azul">
            <Icon name="plus" className="h-6 w-6" />
            {uploading > 0 ? `Enviando ${uploading}...` : "Adicionar fotos"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotos}
              disabled={uploading > 0}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* DADOS */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Campo label="Marca *">
          <input required value={form.marca} onChange={(e) => set("marca", e.target.value)} className={inputClass} placeholder="Ex.: Fiat" />
        </Campo>
        <Campo label="Modelo *">
          <input required value={form.modelo} onChange={(e) => set("modelo", e.target.value)} className={inputClass} placeholder="Ex.: Toro" />
        </Campo>
        <Campo label="Versão">
          <input value={form.versao} onChange={(e) => set("versao", e.target.value)} className={inputClass} placeholder="Ex.: Endurance" />
        </Campo>
        <Campo label="Ano do modelo *">
          <input required type="number" min={1950} max={2100} value={form.anoModelo} onChange={(e) => set("anoModelo", Number(e.target.value))} className={inputClass} />
        </Campo>
        <Campo label="Ano de fabricação">
          <input type="number" min={1950} max={2100} value={form.anoFabricacao ?? ""} onChange={(e) => set("anoFabricacao", numOuNull(e.target.value))} className={inputClass} />
        </Campo>
        <Campo label="Quilometragem">
          <input type="number" min={0} value={form.km ?? ""} onChange={(e) => set("km", numOuNull(e.target.value))} className={inputClass} placeholder="Ex.: 85000" />
        </Campo>
        <Campo label="Câmbio">
          <select value={form.cambio} onChange={(e) => set("cambio", e.target.value)} className={inputClass}>
            <option value="">—</option>
            {CAMBIOS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Combustível">
          <select value={form.combustivel} onChange={(e) => set("combustivel", e.target.value)} className={inputClass}>
            <option value="">—</option>
            {COMBUSTIVEIS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Campo>
        <Campo label={form.tipo === "moto" ? "Cilindrada" : "Motor"}>
          <input value={form.motor} onChange={(e) => set("motor", e.target.value)} className={inputClass} placeholder={form.tipo === "moto" ? "Ex.: 250 cc" : "Ex.: 1.6"} />
        </Campo>
        <Campo label="Cor">
          <input value={form.cor} onChange={(e) => set("cor", e.target.value)} className={inputClass} placeholder="Ex.: Prata" />
        </Campo>
        <Campo label="Preço (R$)">
          <input type="number" min={0} step={100} value={form.preco ?? ""} onChange={(e) => set("preco", numOuNull(e.target.value))} className={inputClass} placeholder="Vazio = sob consulta" />
        </Campo>
        <Campo label="Situação">
          <select value={form.status} onChange={(e) => set("status", e.target.value as VehicleInput["status"])} className={inputClass}>
            <option value="disponivel">À venda</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido (sai do site)</option>
          </select>
        </Campo>
      </div>

      <Campo label="Itens e diferenciais (separados por vírgula)">
        <input value={opcionaisTexto} onChange={(e) => setOpcionaisTexto(e.target.value)} className={inputClass} placeholder="Ex.: Completo, Revisado, Pneus novos, Único dono" />
      </Campo>

      <Campo label="Descrição">
        <textarea rows={4} value={form.descricao} onChange={(e) => set("descricao", e.target.value)} className={inputClass} placeholder="Conte o que o cliente precisa saber: estado, revisões, histórico..." />
      </Campo>

      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <input type="checkbox" checked={form.destaque} onChange={(e) => set("destaque", e.target.checked)} className="h-4 w-4 accent-brand" />
        Destaque (aparece primeiro e no topo do site)
      </label>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || uploading > 0}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
