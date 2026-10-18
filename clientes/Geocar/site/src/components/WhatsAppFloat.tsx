"use client";

import { useState } from "react";
import { VENDEDORES, linkWhatsapp } from "@/lib/whatsapp";
import Icon from "./Icon";

// Botão fixo no canto: abre a escolha entre os dois vendedores
export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-60 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
          <p className="px-2 pb-1 pt-1 text-xs font-semibold text-neutral-500">
            Falar no WhatsApp com:
          </p>
          {VENDEDORES.map((v) => (
            <a
              key={v.numero}
              href={linkWhatsapp(v.numero, "Olá! Vim pelo site da Geocar.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-neutral-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c4a]">
                <Icon name="whatsapp" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{v.nome}</span>
                <span className="block text-xs text-neutral-500">{v.exibicao}</span>
              </span>
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar opções de WhatsApp" : "Falar no WhatsApp"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
      >
        <Icon name={open ? "close" : "whatsapp"} className="h-7 w-7" />
      </button>
    </div>
  );
}
