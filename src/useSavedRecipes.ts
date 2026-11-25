import { useEffect, useRef, useState } from "react";
import { parseBackup, emptyKitchen, mergeKitchen, type Backup } from "./core";
import { createSavedSnapshot } from "./saved-snapshot";
const key = "panfolio-data";
const empty: Backup = { version: 1, favorites: [], notes: {} };
function readLocal() {
  try {
    return parseBackup(localStorage.getItem(key) || JSON.stringify(empty));
  } catch {
    return empty;
  }
}
function decode(raw: unknown) {
  try {
    return parseBackup(JSON.stringify(raw));
  } catch {
    return readLocal();
  }
}
let database: ReturnType<typeof createSavedSnapshot> | undefined;
try {
  if (globalThis.indexedDB)
    database = createSavedSnapshot(globalThis.indexedDB);
} catch {}
export function useSavedRecipes(onError: () => void) {
  const [data, setData] = useState(readLocal);
  const current = useRef(data),
    error = useRef(onError),
    queue = useRef(Promise.resolve()),
    pending = useRef<((v: Backup) => Backup)[]>([]),
    revision = useRef(0);
  error.current = onError;
  const channel = useRef<BroadcastChannel | null>(null);
  const mounted = useRef(true);
  function publish(next: Backup) {
    current.current = next;
    if (mounted.current) setData(next);
  }
  useEffect(() => {
    mounted.current = true;
    async function refresh() {
      const token = revision.current;
      try {
        const raw = database ? await database.read() : undefined;
        if (mounted.current && token === revision.current) {
          const latest = raw === undefined ? readLocal() : decode(raw);
          publish(pending.current.reduce((v, fn) => fn(v), latest));
        }
      } catch {
        if (mounted.current && token === revision.current)
          publish(pending.current.reduce((v, fn) => fn(v), readLocal()));
      }
    }
    const storage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) void refresh();
    };
    const foreground = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    try {
      channel.current = new BroadcastChannel("panfolio:saved");
      channel.current.onmessage = () => void refresh();
    } catch {}
    window.addEventListener("storage", storage);
    window.addEventListener("focus", foreground);
    document.addEventListener("visibilitychange", foreground);
    void refresh();
    return () => {
      mounted.current = false;
      channel.current?.close();
      window.removeEventListener("storage", storage);
      window.removeEventListener("focus", foreground);
      document.removeEventListener("visibilitychange", foreground);
    };
  }, []);
  function mutate(change: (v: Backup) => Backup) {
    revision.current++;
    pending.current.push(change);
    publish(change(current.current));
    queue.current = queue.current.then(async () => {
      const intents = [...pending.current];
      const apply = (v: Backup) => intents.reduce((next, fn) => fn(next), v);
      try {
        let next: Backup;
        if (database)
          next = await database.update(
            (raw) => apply(raw === undefined ? readLocal() : decode(raw)),
            () => {},
          );
        else {
          const write = () => {
            const value = apply(readLocal());
            localStorage.setItem(key, JSON.stringify(value));
            return value;
          };
          next = navigator.locks
            ? await navigator.locks.request("panfolio:saved", write)
            : write();
        }
        pending.current.splice(0, intents.length);
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          if (!database) throw Error();
        }
        publish(pending.current.reduce((v, fn) => fn(v), next));
        channel.current?.postMessage("changed");
      } catch {
        error.current();
      }
    });
  }
  function toggleStatus(field: "tried" | "repeat", id: string) {
    const selected = !current.current.kitchen?.[field].includes(id);
    mutate((v) => {
      const kitchen = v.kitchen ?? emptyKitchen();
      return {
        ...v,
        kitchen: {
          ...kitchen,
          [field]: selected
            ? [...new Set([...kitchen[field], id])]
            : kitchen[field].filter((x) => x !== id),
        },
      };
    });
  }
  return {
    data,
    favorite(id: string) {
      const selected = !current.current.favorites.includes(id);
      mutate((v) => ({
        ...v,
        favorites: selected
          ? [...new Set([...v.favorites, id])]
          : v.favorites.filter((x) => x !== id),
      }));
    },
    note(id: string, text: string) {
      mutate((v) => ({ ...v, notes: { ...v.notes, [id]: text } }));
    },
    toggleTried(id: string) {
      toggleStatus("tried", id);
    },
    toggleRepeat(id: string) {
      toggleStatus("repeat", id);
    },
    merge(backup: Backup) {
      backup = parseBackup(JSON.stringify(backup));
      mutate((v) => ({
        ...v,
        ...(v.kitchen || backup.kitchen
          ? { kitchen: mergeKitchen(v.kitchen, backup.kitchen) }
          : {}),
        favorites: [...new Set([...v.favorites, ...backup.favorites])],
        notes: { ...backup.notes, ...v.notes },
      }));
    },
    async settled() {
      await queue.current;
      return current.current;
    },
  };
}
