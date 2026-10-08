"use client";

import { useEffect } from "react";
import { addToHistory } from "@/lib/personal";

// Registra a visita ao produto no histórico de navegação (só neste navegador)
export default function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    addToHistory(productId);
  }, [productId]);

  return null;
}
