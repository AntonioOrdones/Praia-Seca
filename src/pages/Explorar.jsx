import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { usePlaces } from '../lib/places.js';
import { GRUPOS, FAIXAS, TURISMO } from '../lib/meta.js';
import { norm, rating } from '../lib/text.js';
import { useStored } from '../lib/storage.js';

const EMPTY = { cidades: [], faixas: [], tags: [], chuva: false, abreSeg: false, abreTer: false, noRoteiro: false };
const PAGE = 30;

export default function Explorar({ viagem, params, favs, onOpenPlace }) {
  const { data, error } = usePlaces();
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const [grupo, setGrupo] = useStored('explorar-grupo', 'Todos');
  const [f, setF] = useStored('explorar-filtros', EMPTY);
  const [ordem, setOrdem] = useStored('explorar-ordem', 'distancia');
  const [sheet, setSheet] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const soFavs = params[0] === 'favoritos';
  const sentinel = useRef(null);

  const planIds = useMemo(() => new Set(viagem.dias.flatMap((d) => d.itens.flatMap((i) => i.lugares))), [viagem]);
  const cidades = useMemo(() => (data ? [...new Set(data.map((p) => p.cidade))] : []), [data]);

  const lista = useMemo(() => {
    if (!data) return [];
    const words = norm(dq).split(/\s+/).filter(Boolean);
    let out = data.filter((p) => {
      if (soFavs && !favs.has(p.id)) return false;
      if (grupo !== 'Todos' && p.grupo !== grupo) return false;
      if (f.cidades.length && !f.cidades.includes(p.cidade)) return false;
      if (f.faixas.length && !f.faixas.includes(p.faixa)) return false;
      if (f.tags.length && !f.tags.some((t) => p.tags.includes(t))) return false;
      if (f.chuva && !p.chuva) return false;
      if (f.abreSeg && p.fechaSeg) return false;
      if (f.abreTer && p.fechaTer) return false;
      if (f.noRoteiro && !planIds.has(p.id)) return false;
      if (words.length) {
        const hay = norm(`${p.nome} ${p.cidade} ${p.local} ${p.cat} ${p.desc} ${p.dicas} ${p.tags.join(' ')}`);
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const nota = (p) => rating(p.aval)?.nota ?? 0;
    out = [...out].sort((a, b) =>
      ordem === 'nota' ? nota(b) - nota(a) || a.nome.localeCompare(b.nome)
        : ordem === 'nome' ? a.nome.localeCompare(b.nome, 'pt-BR')
          : (a.min ?? 999) - (b.min ?? 999) || nota(b) - nota(a));
    return out;
  }, [data, dq, grupo, f, ordem, soFavs, favs, planIds]);

  useEffect(() => setLimit(PAGE), [dq, grupo, f, ordem, soFavs]);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLimit((l) => l + PAGE), { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [lista.length, limit]);

  const nFiltros = f.cidades.length + f.faixas.length + f.tags.length + [f.chuva, f.abreSeg, f.abreTer, f.noRoteiro].filter(Boolean).length;
  const toggleIn = (key, v) => setF((s) => ({ ...s, [key]: s[key].includes(v) ? s[key].filter((x) => x !== v) : [...s[key], v] }));
  const counts = useMemo(() => {
    const c = {};
    data?.forEach((p) => { c[p.grupo] = (c[p.grupo] ?? 0) + 1; });
    return c;
  }, [data]);

  return (
    <div>
      <div className="topbar">
        <div className="row between">
          <h1>{soFavs ? 'Favoritos' : 'Explorar'}</h1>
          <div className="row">
            {soFavs ? <a className="btn small" href="#/explorar">Ver tudo</a> : <a className="btn small" href="#/explorar/favoritos"><Icon name="heart" /> {favs.list.length}</a>}
          </div>
        </div>
        <div className="search" role="search">
          <Icon name="search" />
          <label htmlFor="busca" className="sr-only">Buscar lugares</label>
          <input id="busca" type="search" inputMode="search" enterKeyHint="search" autoComplete="off"
            placeholder="Buscar: moqueca, trilha, pôr do sol…" value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button type="button" className="btn icon clear" aria-label="Limpar busca" onClick={() => setQ('')}><Icon name="x" /></button>}
        </div>
        <div className="filterbar">
          <div className="chips" role="group" aria-label="Categorias">
            {['Todos', ...Object.keys(GRUPOS)].map((g) => (
              <button key={g} type="button" className="chip" aria-pressed={grupo === g} onClick={() => setGrupo(g)}>
                {g !== 'Todos' && <Icon name={GRUPOS[g].icon} />}{g}{g !== 'Todos' && counts[g] ? <span className="count">{counts[g]}</span> : null}
              </button>
            ))}
          </div>
          <button type="button" className="btn small" onClick={() => setSheet(true)} aria-label={`Filtros${nFiltros ? `, ${nFiltros} ativos` : ''}`}>
            <Icon name="filter" />{nFiltros || ''}
          </button>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 'var(--sp-3)' }}>
        <div className="result-line" aria-live="polite">
          <span>{data ? `${lista.length} lugar${lista.length === 1 ? '' : 'es'}` : 'Carregando…'}</span>
          <label className="row small">
            <span className="sr-only">Ordenar por</span>
            <select className="select" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="distancia">Mais perto</option>
              <option value="nota">Melhor avaliação</option>
              <option value="nome">A–Z</option>
            </select>
          </label>
        </div>
        {error && <p className="empty">Não deu para carregar os lugares. Verifique a conexão e recarregue.</p>}
        {data && lista.length === 0 && (
          <div className="empty">
            <Icon name={soFavs ? 'heart' : 'search'} />
            <b>{soFavs ? 'Nenhum favorito ainda' : 'Nada encontrado'}</b>
            <span className="small">{soFavs ? 'Toque no coração dos lugares que chamarem atenção.' : 'Tente outra palavra ou limpe os filtros.'}</span>
            {nFiltros > 0 && <button className="btn small" type="button" onClick={() => setF(EMPTY)}>Limpar filtros</button>}
          </div>
        )}
        <div className="places">
          {lista.slice(0, limit).map((p) => (
            <PlaceCard key={p.id} p={p} fav={favs.has(p.id)} onFav={favs.toggle} onOpen={onOpenPlace} inPlan={planIds.has(p.id)} />
          ))}
        </div>
        {limit < lista.length && <div ref={sentinel} className="empty small">Carregando mais…</div>}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} labelledBy="filtros-t">
        <div className="row between">
          <h2 id="filtros-t" style={{ fontSize: 'var(--fs-xl)' }}>Filtros</h2>
          <button type="button" className="btn small" onClick={() => setF(EMPTY)}>Limpar</button>
        </div>
        <fieldset className="stack" style={{ border: 0, padding: 0 }}>
          <legend className="eyebrow">Para hoje</legend>
          <label className="check"><input type="checkbox" checked={f.chuva} onChange={() => setF((s) => ({ ...s, chuva: !s.chuva }))} /> Bom com chuva</label>
          <label className="check"><input type="checkbox" checked={f.abreSeg} onChange={() => setF((s) => ({ ...s, abreSeg: !s.abreSeg }))} /> Não fecha às segundas</label>
          <label className="check"><input type="checkbox" checked={f.abreTer} onChange={() => setF((s) => ({ ...s, abreTer: !s.abreTer }))} /> Não fecha às terças</label>
          <label className="check"><input type="checkbox" checked={f.noRoteiro} onChange={() => setF((s) => ({ ...s, noRoteiro: !s.noRoteiro }))} /> Só o que está no roteiro</label>
        </fieldset>
        <fieldset className="stack" style={{ border: 0, padding: 0 }}>
          <legend className="eyebrow">Faixa de preço (por pessoa)</legend>
          <div className="row">
            {FAIXAS.map((x) => <button key={x} type="button" className="chip" aria-pressed={f.faixas.includes(x)} onClick={() => toggleIn('faixas', x)}>{x}</button>)}
          </div>
          <span className="xsmall muted">$ até R$ 60 · $$ R$ 60–150 · $$$ R$ 150–300 · $$$$ acima de R$ 300</span>
        </fieldset>
        <fieldset className="stack" style={{ border: 0, padding: 0 }}>
          <legend className="eyebrow">Cidade</legend>
          <div className="row">
            {cidades.map((c) => <button key={c} type="button" className="chip" aria-pressed={f.cidades.includes(c)} onClick={() => toggleIn('cidades', c)}>{c}</button>)}
          </div>
        </fieldset>
        <fieldset className="stack" style={{ border: 0, padding: 0 }}>
          <legend className="eyebrow">Tipo de turismo</legend>
          <div className="row">
            {Object.entries(TURISMO).map(([k, v]) => <button key={k} type="button" className="chip" aria-pressed={f.tags.includes(k)} onClick={() => toggleIn('tags', k)}>{v}</button>)}
          </div>
        </fieldset>
        <button type="button" className="btn primary" onClick={() => setSheet(false)}>Ver {lista.length} lugares</button>
      </Sheet>
    </div>
  );
}
