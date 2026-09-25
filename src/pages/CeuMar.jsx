import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { SunArc, TideChart, Moon } from '../components/Sky.jsx';
import { dayNum, shortWeekday, longDate } from '../lib/time.js';

export default function CeuMar({ viagem, now }) {
  const { dias, info } = viagem;
  const [sel, setSel] = useState(dias.find((d) => d.data === now.date)?.data ?? dias[0].data);
  const d = dias.find((x) => x.data === sel);
  const s = d.sol;
  return (
    <div>
      <div className="topbar">
        <h1>Céu & mar</h1>
        <div className="chips" role="tablist" aria-label="Escolha o dia">
          {dias.map((x) => (
            <button key={x.data} type="button" role="tab" aria-selected={x.data === sel} className={`chip day-chip${x.data === now.date ? ' today' : ''}`} onClick={() => setSel(x.data)}>
              <small>{shortWeekday(x.data)}</small><b>{dayNum(x.data)}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="page" style={{ paddingTop: 'var(--sp-4)' }}>
        <section className="card stack" aria-labelledby="sol-t">
          <span className="eyebrow">{longDate(d.data)}</span>
          <h2 id="sol-t" className="card-title" style={{ fontSize: 'var(--fs-xl)' }}><Icon name="sun" />Sol</h2>
          <SunArc sol={s} nowMin={d.data === now.date ? now.minutes : null} />
          <div className="timeband">
            <div className="tb blue"><span>Primeira luz (aurora civil)</span><b>{s.civil}</b></div>
            <div className="tb gold"><span>Nascer · direção {s.azNasce}° (ESE)</span><b>{s.nasce}</b></div>
            <div className="tb gold"><span>Fim da hora dourada</span><b>{s.douradaAm}</b></div>
            <div className="tb"><span>Meio-dia solar (sol a pino)</span><b>{s.meio}</b></div>
            <div className="tb gold"><span>Começa a hora dourada</span><b>{s.douradaPm}</b></div>
            <div className="tb gold"><span>Pôr do sol · direção {s.azPoe}° (OSO)</span><b>{s.poe}</b></div>
            <div className="tb blue"><span>Fim do crepúsculo</span><b>{s.crep}</b></div>
            <div className="tb blue"><span>Céu totalmente escuro</span><b>{s.noite}</b></div>
          </div>
          <p className="small muted">Dia com {s.duracao} de luz. Em Praia Seca o sol se põe sobre a lagoa; das praias oceânicas, ele nasce sobre o mar. Sol quase a pino ao meio-dia: protetor FPS 50+ e sombra entre 10h e 15h.</p>
        </section>

        <section className="card stack" aria-labelledby="mare-t">
          <h2 id="mare-t" className="card-title" style={{ fontSize: 'var(--fs-xl)' }}><Icon name="waves" />Maré</h2>
          {d.mares.length ? <TideChart mares={d.mares} /> : <p className="small">{d.mareTxt}</p>}
          <ul role="list" className="table-list">
            {d.mares.map((m) => (
              <li key={m.h} className="route-row"><span>{m.tipo === 'alta' ? 'Preamar (maré cheia)' : 'Baixa-mar (maré seca)'}</span><b>{m.h} · {m.alt.toFixed(2).replace('.', ',')} m</b></li>
            ))}
          </ul>
          <p className="xsmall muted">Tábua CHM/Marinha nº 42, Porto do Forno (Arraial do Cabo). Maré baixa ajuda nas piscininhas do Vargas, nas faixas de areia e na travessia à Ilha do Japonês.</p>
        </section>

        <section className="card stack" aria-labelledby="lua-t">
          <h2 id="lua-t" className="card-title" style={{ fontSize: 'var(--fs-xl)' }}><Icon name="moon" />Lua</h2>
          <div className="row" style={{ gap: 16, flexWrap: 'nowrap' }}>
            <Moon ilum={d.lua.ilum} />
            <div className="stack" style={{ gap: 2 }}>
              <b>{d.lua.ilum}% iluminada às 21h</b>
              <span className="small muted">Nasce {d.lua.nasce} · se põe {d.lua.poe}</span>
            </div>
          </div>
        </section>

        <section className="stack" aria-labelledby="ceu-t">
          <h2 id="ceu-t" style={{ fontSize: 'var(--fs-xl)' }}>O que ver no céu</h2>
          {info.ceu.map((c) => (
            <article key={c.t} className="card stack" style={{ gap: 4 }}>
              <span className="eyebrow">{c.q}</span>
              <h3>{c.t}</h3>
              <p className="small muted">{c.d}</p>
            </article>
          ))}
        </section>

        <details className="acc">
          <summary><span className="ico"><Icon name="sun" /></span><h3>Clima de novembro</h3><Icon name="chevron" /></summary>
          <div className="acc-body">
            {info.clima.map((c) => (
              <div key={c.parametro} className="list-item"><b className="small">{c.parametro}: {c.valor}</b><p>{c.estacao_ou_fonte}</p></div>
            ))}
            <p className="small">{info.elnino}</p>
          </div>
        </details>
        <details className="acc">
          <summary><span className="ico"><Icon name="waves" /></span><h3>Vento e mar</h3><Icon name="chevron" /></summary>
          <div className="acc-body">
            {[...info.vento, ...info.mar].map((v) => (
              <div key={v.t} className="list-item"><b className="small">{v.t}{v.temp && v.temp !== 'a confirmar' ? ` · ${v.temp}` : ''}</b><p>{v.d}</p></div>
            ))}
          </div>
        </details>
        <details className="acc" open>
          <summary><span className="ico"><Icon name="external" /></span><h3>Previsão: onde e quando olhar</h3><Icon name="chevron" /></summary>
          <div className="acc-body">
            {info.previsao.map((p) => (
              <a key={p.servico} className="list-item" href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <b className="small" style={{ color: 'var(--flamingo)' }}>{p.servico} ↗</b>
                <p>{p.o_que_ver} — <i>{p.quando_consultar}</i></p>
              </a>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
