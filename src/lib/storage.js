import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'praiaseca:';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Estado persistido no aparelho (favoritos, feitos, checklists). */
export function useStored(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* modo privado ou armazenamento cheio: segue só em memória */
    }
  }, [key, value]);
  return [value, setValue];
}

/** Conjunto de ids marcados (ex.: favoritos, itens feitos). */
export function useIdSet(key) {
  const [list, setList] = useStored(key, []);
  const has = useCallback((id) => list.includes(id), [list]);
  const toggle = useCallback((id) => setList((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])), [setList]);
  return { list, has, toggle, clear: () => setList([]) };
}

export function clearAll() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
  } catch { /* nada */ }
}
