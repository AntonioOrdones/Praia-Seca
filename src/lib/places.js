import { useEffect, useState } from 'react';

let cache = null;
let pending = null;

/** Carrega os 434 lugares uma vez (arquivo separado para o app abrir rápido). */
export function loadPlaces() {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch(`${import.meta.env.BASE_URL}data/lugares.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((d) => (cache = d))
    .finally(() => (pending = null));
  return pending;
}

export function usePlaces() {
  const [state, setState] = useState({ data: cache, error: null });
  useEffect(() => {
    if (cache) return;
    let alive = true;
    loadPlaces()
      .then((data) => alive && setState({ data, error: null }))
      .catch((error) => alive && setState({ data: null, error }));
    return () => { alive = false; };
  }, []);
  return state;
}
