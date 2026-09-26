"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import AddressPicker from "@/components/AddressPicker";
import { getAddresses, saveAddresses, type Address } from "./addresses";
import { useAuth } from "./auth-context";

const STORAGE_KEY = "plavii-endereco-ativo";

type AddressContextValue = {
  addresses: Address[];
  selected: Address | undefined;
  saveAddress: (address: Address) => Promise<string | null>;
  openPicker: () => void;
};

const AddressContext = createContext<AddressContextValue | null>(null);

function readStoredId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const addresses = getAddresses(user?.user_metadata);

  const [selectedId, setSelectedId] = useState<string | null>(readStoredId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const closePicker = () => setPickerOpen(false);
  const openPicker = () => setPickerOpen(true);

  const selected = addresses.find((a) => a.id === selectedId) ?? addresses[0];

  const select = (id: string) => {
    setSelectedId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage indisponível — a escolha vale só nesta visita
    }
  };

  // Adiciona ou atualiza um endereço e já deixa ele selecionado
  const saveAddress = async (address: Address) => {
    const exists = addresses.some((a) => a.id === address.id);
    const list = exists
      ? addresses.map((a) => (a.id === address.id ? address : a))
      : [...addresses, address];
    const message = await saveAddresses(list);
    if (!message) select(address.id);
    return message;
  };

  const removeAddress = async (id: string) => {
    const message = await saveAddresses(addresses.filter((a) => a.id !== id));
    if (!message && selected?.id === id) setSelectedId(null);
    return message;
  };

  return (
    <AddressContext.Provider value={{ addresses, selected, saveAddress, openPicker }}>
      {children}
      <AddressPicker
        open={pickerOpen}
        onClose={closePicker}
        addresses={addresses}
        selectedId={selected?.id ?? null}
        onSelect={select}
        onSave={saveAddress}
        onRemove={removeAddress}
      />
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses precisa estar dentro de <AddressProvider>");
  return ctx;
}
