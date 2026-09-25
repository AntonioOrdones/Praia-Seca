import { useEffect, useState } from 'react';

/** Roteamento por hash: funciona no GitHub Pages sem configuração de servidor. */
const parse = () => {
  const [path = 'hoje', ...rest] = location.hash.replace(/^#\/?/, '').split('/');
  return { path: path || 'hoje', params: rest.map(decodeURIComponent) };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const go = (hash) => {
  location.hash = hash;
};
