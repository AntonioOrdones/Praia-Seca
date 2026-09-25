import { useEffect } from 'react';
import Icon from '../components/Icon.jsx';
import { useIdSet, clearAll } from '../lib/storage.js';

function Acc({ id, icon, title, sub, open, children }) {
  return (
    <details className="acc" id={id} open={open}>
      <summary>
        <span className="ico"><Icon name={icon} /></span>
        <span className="stack" style={{ gap: 0 }}><h3>{title}</h3>{sub && <span className="xsmall muted">{sub}</span>}</span>
        <Icon name="chevron" />
      </summary>
      <div className="acc-body">{children}</div>
    </details>
  );
}

const ext = { target: '_blank', rel: 'noopener noreferrer' };

export default function Mais({ viagem, params, theme, setTheme }) {
  const { info } = viagem;
  const res = useIdSet('reservas');
  const mala = useIdSet('mala');
  useEffect(() => {
    if (params[0]) requestAnimationFrame(() => document.getElementById(params[0])?.scrollIntoView({ block: 'start' }));
  }, [params[0]]);

  return (
    <div>
      <div className="topbar"><h1>Mais</h1></div>
      <div className="page" style={{ paddingTop: 'var(--sp-4)' }}>
        <Acc id="reservas" icon="ticket" title="Reservas" sub={`${res.list.length} de ${info.reservas.length} feitas`} open={params[0] === 'reservas'}>
          {info.reservas.map((r) => (
            <div key={r.o} className="list-item">
              <label className="check"><input type="checkbox" checked={res.has(r.o)} onChange={() => res.toggle(r.o)} /><span>{r.o}</span></label>
              <p><b>Quando:</b> {r.q}</p>
              <p><b>Como:</b> {r.c}</p>
              {r.obs && <p>{r.obs}</p>}
            </div>
          ))}
        </Acc>

        <Acc id="emergencia" icon="shield" title="Emergência e saúde" sub="SAMU 192 · Bombeiros 193 · Polícia 190">
          <div className="actions">
            {info.emergencia.filter((e) => /^\d{3}$/.test(e.numero)).map((e) => (
              <a key={e.numero} className="btn" href={`tel:${e.numero}`}><Icon name="phone" /> {e.numero} · {e.servico.split(' (')[0].split(' –')[0]}</a>
            ))}
          </div>
          {info.emergencia.filter((e) => !/^\d{3}$/.test(e.numero)).concat(info.saude.map((s) => ({ servico: s.nome, numero: s.contato, obs: `${s.end} · ${s.func}` }))).map((e) => (
            <div key={e.servico} className="list-item"><b className="small">{e.servico}</b><p>{e.numero} · {e.obs}</p></div>
          ))}
        </Acc>

        <Acc id="mala" icon="bag" title="Checklist da mala" sub={`${mala.list.length} de ${info.checklist.length} prontos`}>
          {info.checklist.map((c) => (
            <div key={c.k} className="list-item">
              <label className="check"><input type="checkbox" checked={mala.has(c.k)} onChange={() => mala.toggle(c.k)} /><span>{c.k}</span></label>
              <p>{c.v}</p>
            </div>
          ))}
        </Acc>

        <Acc id="eventos" icon="sparkle" title="Eventos da semana" sub="14 a 24/11/2026">
          {info.eventos.map((e) => (
            <div key={e.nome} className="list-item">
              <span className="row"><span className={`badge ${e.status.startsWith('confirm') ? 'ok' : 'hot'}`}>{e.status || 'a confirmar'}</span><span className="xsmall mono">{e.data}</span></span>
              <b className="small">{e.nome}</b>
              <p>{e.cidade}{e.local ? ` · ${e.local}` : ''}{e.horario ? ` · ${e.horario}` : ''}</p>
              <p>{e.descricao}</p>
              {e.fonte?.startsWith('http') && <a className="link-btn" href={e.fonte} {...ext}>Fonte ↗</a>}
            </div>
          ))}
        </Acc>

        <Acc id="deslocamentos" icon="car" title="Distâncias e tempos" sub="A partir de Praia Seca · normal / feriado">
          <div className="table-list">
            {info.rotas.map((r) => (
              <div key={r.origem + r.destino} className="route-row">
                <span><b style={{ fontFamily: 'var(--font-body)' }}>{r.destino}</b><br /><span className="xsmall muted">{r.origem !== 'Praia Seca centro' ? `de ${r.origem} · ` : ''}{r.via}</span></span>
                <b>{r.km ?? '—'} km<br />{r.min_normal ?? '—'}′ / {r.min_pico_feriado ?? '—'}′</b>
              </div>
            ))}
          </div>
          <p className="xsmall muted">Uma rota medida (Praia Seca → Arraial). As outras são estimativas: confirme no Waze/Maps na hora.</p>
        </Acc>

        <Acc id="pedagios" icon="wallet" title="Pedágios, estacionamento e transporte">
          {info.pedagios.map((p) => <div key={p.praca} className="list-item"><b className="small">{p.praca}</b><p>{p.valor_carro} · {p.sentido}</p></div>)}
          {info.estacionamento.map((p) => <div key={p.regra} className="list-item"><b className="small">{p.cidade}</b><p>{p.regra} · {p.valor}</p></div>)}
          {info.transporte.map((p) => <div key={p.tipo} className="list-item"><b className="small">{p.tipo}</b><p>{p.descricao} {p.preco && `· ${p.preco}`}</p></div>)}
          {info.ferry.map((f) => <div key={f.sentido} className="list-item"><b className="small">Ferry {f.sentido}</b><p className="mono">{(f.saidas || []).join(' · ')}</p><p>{f.dias}</p></div>)}
        </Acc>

        <Acc id="regras" icon="alert" title="Regras e alertas 2026" sub={`${info.alertas.length} avisos`}>
          {info.alertas.map((a) => (
            <div key={a.texto.slice(0, 50)} className="list-item"><b className="small">{a.tema}</b><p>{a.texto}</p></div>
          ))}
        </Acc>

        <Acc id="videos" icon="play" title="Vídeos para se inspirar" sub={`${info.videos.length} vídeos de criadores`}>
          {info.videos.map((v) => (
            <a key={v.url} className="list-item" href={v.url} {...ext} style={{ textDecoration: 'none' }}>
              <b className="small">{v.titulo || v.url}</b>
              <p>{[v.canal, v.plataforma, v.data].filter((x) => x && x !== 'a confirmar').join(' · ')}</p>
              {v.sobre && <p>{v.sobre}</p>}
            </a>
          ))}
        </Acc>

        <Acc id="casa" icon="home" title="A casa">
          {Object.entries({ Anúncio: info.casa.nome, Anfitriã: info.casa.anfitria, 'Check-in': info.casa.checkin, Checkout: info.casa.checkout, Estrutura: info.casa.estrutura, Atenção: info.casa.atencao, 'Dicas da Claudia': info.casa.dicas }).map(([k, v]) => (
            <div key={k} className="list-item"><b className="small">{k}</b><p>{v}</p></div>
          ))}
        </Acc>

        <section className="card stack">
          <h2 className="card-title" style={{ fontSize: 'var(--fs-lg)' }}><Icon name="theme" />Aparência</h2>
          <div className="row" role="group" aria-label="Tema">
            {[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Escuro']].map(([v, l]) => (
              <button key={v} type="button" className="chip" aria-pressed={theme === v} onClick={() => setTheme(v)}>{l}</button>
            ))}
          </div>
          <p className="xsmall muted">Favoritos, feitos e checklists ficam salvos só neste celular.</p>
          <button type="button" className="btn small" onClick={() => { clearAll(); location.reload(); }}>Apagar marcações deste aparelho</button>
        </section>
        <div className="pride-line" aria-hidden="true" />
        <p className="footer-note">Dados checados em set/2026 (prefeituras, ICMBio, Marinha, Tripadvisor, Google). "a confirmar" = ainda não verificado.</p>
      </div>
    </div>
  );
}
