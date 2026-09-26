import { useSyncExternalStore } from "react";

// Listas pessoais guardadas no navegador (localStorage): histórico de produtos
// vistos e favoritos. Ficam neste aparelho — não vão pro banco.

type Listener = () => void;

function createListStore<T>(key: string) {
  const empty: T[] = [];
  const listeners = new Set<Listener>();
  let raw: string | null = null;
  let cached: T[] = empty;
  let loaded = false;

  const read = (): T[] => {
    let next: string | null = null;
    try {
      next = localStorage.getItem(key);
    } catch {
      // localStorage indisponível (modo privado etc.)
    }
    if (!loaded || next !== raw) {
      raw = next;
      loaded = true;
      try {
        cached = next ? (JSON.parse(next) as T[]) : empty;
      } catch {
        cached = empty;
      }
    }
    return cached;
  };

  const notify = () => listeners.forEach((l) => l());

  const write = (list: T[]) => {
    const serialized = JSON.stringify(list);
    try {
      localStorage.setItem(key, serialized);
    } catch {
      // sem persistência — segue só em memória
    }
    raw = serialized;
    cached = list;
    loaded = true;
    notify();
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const useList = () => useSyncExternalStore(subscribe, read, () => empty);

  return { read, write, useList };
}

// ---------- Histórico de navegação ----------

export type HistoryItem = { id: string; at: number };

const historyStore = createListStore<HistoryItem>("plavii-historico");
const HISTORY_LIMIT = 30;

export const useHistory = historyStore.useList;

export function addToHistory(productId: string) {
  const rest = historyStore.read().filter((item) => item.id !== productId);
  historyStore.write([{ id: productId, at: Date.now() }, ...rest].slice(0, HISTORY_LIMIT));
}

export function clearHistory() {
  historyStore.write([]);
}

// ---------- Favoritos ----------

const favoritesStore = createListStore<string>("plavii-favoritos");

export const useFavorites = favoritesStore.useList;

export function toggleFavorite(productId: string) {
  const list = favoritesStore.read();
  favoritesStore.write(
    list.includes(productId) ? list.filter((id) => id !== productId) : [productId, ...list]
  );
}
