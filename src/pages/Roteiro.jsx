import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Links from '../components/Links.jsx';
import { Moon } from '../components/Sky.jsx';
import { TIPOS } from '../lib/meta.js';
import { dayNum, duration, isLateNight, shortWeekday, toMin, longDate } from '../lib/time.js';
import { usePlaces } from '../lib/places.js';
import { rating, isUnknown } from '../lib/text.js';

const FILTROS = [
  { id: 'tudo', label: 'Tudo' },
  { id: 'ativ', label: 'Programas' },
  { id: 'comida', label: 'Comer & beber' },
  { id: 'desl', label: 'Deslocamentos' },
  { id: 'noite', label: 'Noite' },
];

function LinkedPlace({ p, onOpen }) {
  const r = rating(p.aval);
  return (
    <button type="button" className="route-row" style={{ textAlign: 'left' }} onClick={() => onOpen(p.id)}>
      <span className="stack" style={{ gap: 2 }}>
        <b style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>{p.nome}</b>
        {!isUnknown(p.func) && <span className="xsmall muted">{p.func}</span>}
      </span>
      <span className="stack" style={{ gap: 2, justifyItems: 'end' }}>
        {r && <span className="badge sun"><Icon name="star" />{r.nota.toFixed(1).replace('.', ',')}</span>}
        {p.faixa && !isUnknown(p.faixa) && <span className="badge">{p.faixa}</span>}
      </span>
    </button>
  );
}

function Item({ it, index, arr, open, onToggle, done, onDone, isNow, places, onOpenPlace }) {
  const t = TIPOS[it.tipo];
  const obrig = /^obrig/i.test(it.reserva);
  const linked = places ? it.lugares.map((id) => places.find((p) => p.id === id)).filter(Boolean) : [];
  const late = isLateNight(it, index, arr);
  return (
    <>
      {late && <div className="t-late"><span>Depois da meia-noite</span></div>}
      <li id={it.id} className={`t-item${done ? ' done' : ''}${isNow ? ' now' : ''}`} style={{ '--tcolor': t.color }}>
        <time className="t-time" dateTime={it.ini}>{it.ini}</time>
        <span className="t-dot" aria-hidden="true" />
        <div className="t-card">
          <button type="button" className="t-summary" aria-expanded={open} aria-controls={`${it.id}-body`} onClick={() => onToggle(it.id)}>
            <span className="t-type"><Icon name={t.icon} />{t.label}{isNow && ' · agora'}</span>
            <span className="t-title">{it.titulo}</span>
            {it.onde && <span className="t-where">{it.onde}</span>}
            <span className="t-meta">
              <span className="badge"><Icon name="clock" />{it.ini}–{it.fim} · {duration(it.ini, it.fim)}</span>
              {it.desl && !/^[—-]$/.test(it.desl) && <span className="badge"><Icon name="car" />{it.desl}</span>}
              {obrig && <span className="badge hot"><Icon name="ticket" />reservar</span>}
              {it.custo && !/^[—-]$/.test(it.custo) && <span className="badge sun">{it.custo}</span>}
            </span>
            <Icon name="chevron" className="chev" />
          </button>
          {open && (
            <div className="t-body" id={`${it.id}-body`}>
              {it.det && <p>{it.det}</p>}
              <dl className="kv">
                {it.turismo && <><dt>Tipo</dt><dd>{it.turismo}</dd></>}
                {it.desl && <><dt>Deslocamento</dt><dd>{it.desl}</dd></>}
                {it.custo && <><dt>Custo</dt><dd>{it.custo}</dd></>}
                {it.reserva && <><dt>Reserva</dt><dd>{it.reserva}</dd></>}
              </dl>
              {it.planoB && !/^[—-]$/.test(it.planoB) && <div className="planb"><b>Plano B: </b>{it.planoB}</div>}
              {linked.length > 0 && (
                <div className="stack" style={{ gap: 8 }}>
                  <span className="xsmall muted" style={{ fontWeight: 700 }}>DETALHES DO LUGAR</span>
                  {linked.map((p) => <LinkedPlace key={p.id} p={p} onOpen={onOpenPlace} />)}
                </div>
              )}
              <Links rota={it.rota} mapa={it.mapa} fotos={it.fotos} compact />
              <label className="check">
                <input type="checkbox" checked={done} onChange={() => onDone(it.id)} />
                {done ? 'Feito!' : 'Marcar como feito'}
              </label>
            </div>
          )}
        </div>
      </li>
    </>
  );
}

export default function Roteiro({ viagem, now, params, done, onOpenPlace }) {
  const { dias } = viagem;
  const defaultDay = dias.find((d) => d.data === now.date)?.data ?? dias[0].data;
  const sel = params[0] && dias.some((d) => d.data === params[0]) ? params[0] : defaultDay;
  const dia = dias.find((d) => d.data === sel);
  const [filtro, setFiltro] = useState('tudo');
  const [openIds, setOpenIds] = useState(() => new Set(params[1] ? [params[1]] : []));
  const { data: places } = usePlaces();

  useEffect(() => {
    if (params[1]) {
      setOpenIds((s) => new Set([...s, params[1]]));
      requestAnimationFrame(() => document.getElementById(params[1])?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [params[0], params[1]]);

  const itens = useMemo(() => dia.itens.filter((i) => filtro === 'tudo' || i.tipo === filtro || (filtro === 'ativ' && i.tipo === 'descanso')), [dia, filtro]);
  const toggle = (id) => setOpenIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isToday = sel === now.date;
  const nowItem = isToday ? dia.itens.find((i) => { const a = toMin(i.ini); let b = toMin(i.fim); if (b < a) b += 1440; return now.minutes >= a && now.minutes < b; }) : null;
  const allOpen = itens.every((i) => openIds.has(i.id));

  return (
    <div>
      <div className="topbar">
        <div className="row between">
          <h1>Roteiro</h1>
          <button type="button" className="btn small" onClick={() => setOpenIds(allOpen ? new Set() : new Set(itens.map((i) => i.id)))}>
            {allOpen ? 'Recolher' : 'Abrir tudo'}
          </button>
        </div>
        <div className="chips" role="tablist" aria-label="Escolha o dia">
          {dias.map((d) => (
            <a key={d.data} role="tab" aria-selected={d.data === sel} href={`#/roteiro/${d.data}`}
              className={`chip day-chip${d.dia.includes('FERIADO') ? ' holiday' : ''}${d.data === now.date ? ' today' : ''}`}
              style={{ textDecoration: 'none' }}>
              <small>{shortWeekday(d.data)}</small><b>{dayNum(d.data)}</b>
            </a>
          ))}
        </div>
      </div>

      <div className="page" style={{ paddingTop: 'var(--sp-4)' }}>
        <section className="day-head" aria-labelledby="dia-t">
          <span className="eyebrow">{longDate(dia.data)}{dia.dia.includes('FERIADO') && ' · feriado'}</span>
          <h2 id="dia-t">{dia.tema}</h2>
          <p className="small muted">{dia.destino} · {dia.km}</p>
          <div className="sky-strip">
            <span className="sky-pill"><Icon name="sunrise" style={{ color: 'var(--sun)' }} /><b>{dia.sol.nasce}</b></span>
            <span className="sky-pill"><Icon name="sunset" style={{ color: 'var(--flamingo)' }} /><b>{dia.sol.poe}</b></span>
            <span className="sky-pill"><Moon ilum={dia.lua.ilum} size={18} /><b>{dia.lua.ilum}%</b> põe {dia.lua.poe}</span>
            <span className="sky-pill"><Icon name="waves" style={{ color: 'var(--lagoon)' }} />
              {dia.mares.length ? dia.mares.map((m) => `${m.tipo === 'alta' ? '↑' : '↓'}${m.h}`).join(' ') : 'maré a confirmar'}</span>
          </div>
          {dia.reservas && !/^nenhuma/i.test(dia.reservas) && (
            <div className="planb" style={{ background: 'var(--flamingo-soft)' }}><b style={{ color: 'var(--flamingo)' }}>Reservas: </b>{dia.reservas}</div>
          )}
          <details className="planb">
            <summary style={{ fontWeight: 700, cursor: 'pointer' }}>Plano B do dia</summary>
            <p style={{ marginTop: 6 }}>{dia.planoB}</p>
          </details>
        </section>

        <div className="chips" role="group" aria-label="Filtrar por tipo">
          {FILTROS.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>{f.label}</button>
          ))}
        </div>

        <ol className="timeline" role="list">
          {itens.map((it, i) => (
            <Item key={it.id} it={it} index={i} arr={itens} open={openIds.has(it.id)} onToggle={toggle}
              done={done.has(it.id)} onDone={done.toggle} isNow={nowItem?.id === it.id} places={places} onOpenPlace={onOpenPlace} />
          ))}
        </ol>
        {itens.length === 0 && <p className="empty">Nada deste tipo neste dia.</p>}
      </div>
    </div>
  );
}
