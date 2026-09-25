import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import viagem from './data/viagem.json';
import TabBar from './components/TabBar.jsx';
import Sheet from './components/Sheet.jsx';
import PlaceDetail from './components/PlaceDetail.jsx';
import Hoje from './pages/Hoje.jsx';
import { useRoute } from './lib/router.js';
import { useIdSet, useStored } from './lib/storage.js';
import { usePlaces } from './lib/places.js';
import { nowInTrip } from './lib/time.js';

// Páginas carregadas sob demanda: a tela inicial abre mais rápido no 4G fraco.
const Roteiro = lazy(() => import('./pages/Roteiro.jsx'));
const Explorar = lazy(() => import('./pages/Explorar.jsx'));
const CeuMar = lazy(() => import('./pages/CeuMar.jsx'));
const Mais = lazy(() => import('./pages/Mais.jsx'));

function useNow() {
  const [now, setNow] = useState(nowInTrip);
  useEffect(() => {
    const id = setInterval(() => setNow(nowInTrip()), 60_000);
    const vis = () => document.visibilityState === 'visible' && setNow(nowInTrip());
    document.addEventListener('visibilitychange', vis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return now;
}

export default function App() {
  const { path, params } = useRoute();
  const now = useNow();
  const favs = useIdSet('favoritos');
  const done = useIdSet('feitos');
  const [theme, setTheme] = useStored('tema', 'auto');
  const [placeId, setPlaceId] = useState(null);
  const { data: places } = usePlaces();
  const openPlace = useCallback((id) => setPlaceId(id), []);
  const closePlace = useCallback(() => setPlaceId(null), []);
  const place = placeId && places?.find((p) => p.id === placeId);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const titles = { hoje: 'Hoje', roteiro: 'Roteiro', explorar: 'Explorar', ceu: 'Céu & mar', mais: 'Mais' };
    document.title = `${titles[path] ?? 'Praia Seca'} · Praia Seca a dois`;
  }, [path]);

  const shared = { viagem, now, params };
  let page;
  switch (path) {
    case 'roteiro': page = <Roteiro {...shared} done={done} onOpenPlace={openPlace} />; break;
    case 'explorar': page = <Explorar {...shared} favs={favs} onOpenPlace={openPlace} />; break;
    case 'ceu': page = <CeuMar {...shared} />; break;
    case 'mais': page = <Mais {...shared} theme={theme} setTheme={setTheme} />; break;
    default: page = <Hoje {...shared} done={done} />;
  }

  return (
    <div className="app">
      <a href="#conteudo" className="sr-only">Pular para o conteúdo</a>
      <main id="conteudo">
        <Suspense fallback={<p className="empty">Carregando…</p>}>{page}</Suspense>
      </main>
      <TabBar current={path} />
      <Sheet open={!!place} onClose={closePlace} labelledBy="sheet-title">
        {place && <PlaceDetail p={place} fav={favs.has(place.id)} onFav={favs.toggle} />}
      </Sheet>
    </div>
  );
}
