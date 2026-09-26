"use client";

import { useEffect, useState } from "react";
import AddressForm from "@/components/AddressForm";
import {
  addressPickerLine1,
  addressPickerLine2,
  type Address,
} from "@/lib/addresses";

type View = { type: "list" } | { type: "form"; id: string | null };

function PickerBody({
  addresses,
  selectedId,
  onSelect,
  onSave,
  onRemove,
  onClose,
}: {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSave: (address: Address) => Promise<string | null>;
  onRemove: (id: string) => Promise<string | null>;
  onClose: () => void;
}) {
  // Sem nenhum endereço salvo, já abre o formulário
  const [view, setView] = useState<View>(
    addresses.length === 0 ? { type: "form", id: null } : { type: "list" }
  );
  const [pending, setPending] = useState<string | null>(selectedId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = addresses.find((a) => a.id === pending) ?? addresses[0];

  const backToList = () => {
    setError(null);
    if (addresses.length === 0) onClose();
    else setView({ type: "list" });
  };

  const handleSave = async (address: Address) => {
    setSaving(true);
    setError(null);
    const message = await onSave(address);
    setSaving(false);
    if (message) {
      setError("Não deu pra salvar o endereço. Tenta de novo.");
      return;
    }
    setPending(address.id);
    // Primeiro endereço da conta: já fica selecionado e a janela fecha
    if (addresses.length === 0) onClose();
    else setView({ type: "list" });
  };

  const handleRemove = async (id: string) => {
    setSaving(true);
    setError(null);
    const message = await onRemove(id);
    setSaving(false);
    if (message) {
      setError("Não deu pra remover o endereço. Tenta de novo.");
      return;
    }
    setPending(addresses.find((a) => a.id !== id)?.id ?? null);
    setView({ type: "list" });
  };

  if (view.type === "form") {
    const editing = view.id ? addresses.find((a) => a.id === view.id) ?? null : null;
    return (
      <>
        <AddressForm
          key={view.id ?? "new"}
          initial={editing}
          title={editing ? "Editar endereço" : "Novo endereço"}
          saving={saving}
          error={error}
          onSave={handleSave}
          onCancel={backToList}
        />
        {editing && addresses.length > 1 && (
          <button
            type="button"
            onClick={() => handleRemove(editing.id)}
            disabled={saving}
            className="mt-3 text-sm font-medium text-red-500 hover:underline disabled:opacity-60"
          >
            Remover este endereço
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold text-neutral-800">
        Escolha um endereço de entrega
      </h2>

      <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
        {addresses.map((a) => {
          const active = a.id === current?.id;
          return (
            <label
              key={a.id}
              className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-neutral-50"
            >
              <input
                type="radio"
                name="endereco-entrega"
                checked={active}
                onChange={() => setPending(a.id)}
                className="mt-1 h-4 w-4 accent-[var(--brand)]"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-neutral-800">
                  {addressPickerLine1(a)}
                </span>
                <span className="block text-sm text-neutral-500">
                  {addressPickerLine2(a)}
                </span>
                {active && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setError(null);
                      setView({ type: "form", id: a.id });
                    }}
                    className="mt-1 text-sm font-medium text-brand hover:underline"
                  >
                    Editar
                  </button>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setView({ type: "form", id: null });
          }}
          className="rounded-md bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
        >
          Adicionar novo endereço
        </button>
        <button
          type="button"
          onClick={() => {
            if (current) onSelect(current.id);
            onClose();
          }}
          className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Confirmar
        </button>
      </div>
    </>
  );
}

export default function AddressPicker({
  open,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onSave,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSave: (address: Address) => Promise<string | null>;
  onRemove: (id: string) => Promise<string | null>;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Endereço de entrega"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
      >
        <PickerBody
          addresses={addresses}
          selectedId={selectedId}
          onSelect={onSelect}
          onSave={onSave}
          onRemove={onRemove}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
