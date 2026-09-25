import Icon from '../components/Icon.jsx';
import { SunArc } from '../components/Sky.jsx';
import { TIPOS } from '../lib/meta.js';
import { countdown, longDate, toMin, TRIP_START, TRIP_END } from '../lib/time.js';

/** Acha o item "agora" e o "próximo" no dia atual. */
function nowNext(dia, minutes) {
  const itens = dia.itens.filter((i) => toMin(i.ini) >= 300 || i.tipo !== 'noite');
  let now = null, next = null;
  for (const it of itens) {
    const a = toMin(it.ini); let b = toMin(it.fim); if (b < a) b += 1440;
    if (minutes >= a && minutes < b) now = it;
    if (a > minutes && !next) next = it;
  }
  return { now, next };
}

function ItemMini({ it, label }) {
  const t = TIPOS[it.tipo];
  return (
    <a href={`#/roteiro/${it.id.slice(0, 10)}/${it.id}`} className="card now-card" style={{ textDecoration: 'none', display: 'grid', gap: 6 }}>
      <span className="row small" style={{ fontWeight: 700 }}>
        {label === 'Agora' && <span className="pulse" aria-hidden="true" />}{label} · <time>{it.ini}–{it.fim}</time>
      </span>
      <span className="t-type" style={{ '--tcolor': t.color }}><Icon name={t.icon} />{t.label}</span>
      <b style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)' }}>{it.titulo}</b>
      {it.onde && <span className="small muted">{it.onde}</span>}
    </a>
  );
}

export default function Hoje({ viagem, now, done }) {
  const { dias, info } = viagem;
  const cd = countdown(now.stamp);
  const hoje = dias.find((d) => d.data === now.date);
  const antes = now.date < TRIP_START;
  const depois = now.date > TRIP_END;
  const destaque = hoje ?? dias[0];
  const { now: agora, next } = hoje ? nowNext(hoje, now.minutes) : {};
  const totalItens = dias.reduce((s, d) => s + d.itens.length, 0);
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-sun" aria-hidden="true" />
        <div className="hero-waves" aria-hidden="true" />
        <span className="eyebrow">16 → 23 de novembro de 2026</span>
        <h1>Praia Seca a dois</h1>
        <p>Lagoa de um lado, mar do outro e sete noites para explorar a Região dos Lagos no nosso ritmo.</p>
        {antes && (
          <div className="countdown" aria-label={`Faltam ${cd.dias} dias`}>
            <div><b>{cd.dias}</b><span>dias</span></div>
            <div><b>{cd.horas}</b><span>horas</span></div>
            <div><b>7</b><span>noites</span></div>
          </div>
        )}
        {hoje && <p style={{ marginTop: 16, fontWeight: 700 }}>Hoje: {hoje.tema}</p>}
        {depois && <p style={{ marginTop: 16, fontWeight: 700 }}>A viagem acabou. Que tal rever o que fizeram?</p>}
      </header>

      {hoje && (agora || next) && (
        <section className="stack" aria-label="Agora">
          {agora && <ItemMini it={agora} label="Agora" />}
          {next && <ItemMini it={next} label="A seguir" />}
        </section>
      )}

      <section className="card stack" aria-labelledby="sol-hoje">
        <div className="section-head">
          <h2 id="sol-hoje" className="card-title" style={{ fontSize: 'var(--fs-lg)' }}><Icon name="sun" />Sol {hoje ? 'de hoje' : `de ${longDate(destaque.data).split(',')[0]}`}</h2>
          <a className="link-btn" href="#/ceu">Céu & mar →</a>
        </div>
        <SunArc sol={destaque.sol} nowMin={hoje ? now.minutes : null} />
        <div className="stats">
          <div className="stat"><Icon name="sunrise" /><b>{destaque.sol.nasce}</b><span>nascer</span></div>
          <div className="stat"><Icon name="sunset" /><b>{destaque.sol.poe}</b><span>pôr do sol</span></div>
          <div className="stat"><Icon name="sparkle" /><b>{destaque.sol.douradaPm}</b><span>hora dourada</span></div>
        </div>
      </section>

      <nav className="quick" aria-label="Atalhos">
        <a href={`#/roteiro/${destaque.data}`}><Icon name="calendar" /><b>Roteiro</b><span className="small muted">{totalItens} momentos em 8 dias</span></a>
        <a href="#/explorar"><Icon name="compass" /><b>Explorar</b><span className="small muted">434 lugares com filtro</span></a>
        <a href="#/mais/reservas"><Icon name="ticket" /><b>Reservas</b><span className="small muted">{info.reservas.length} para garantir</span></a>
        <a href="#/explorar/favoritos"><Icon name="heart" /><b>Favoritos</b><span className="small muted">o que a gente curtiu</span></a>
      </nav>

      <section className="stack" aria-labelledby="dias-t">
        <div className="section-head"><h2 id="dias-t">Os 8 dias</h2><span className="xsmall muted">{done.list.length} feitos</span></div>
        {dias.map((d) => (
          <a key={d.data} href={`#/roteiro/${d.data}`} className="card" style={{ textDecoration: 'none', display: 'grid', gap: 4 }}>
            <span className="eyebrow" style={{ color: d.dia.includes('FERIADO') ? 'var(--flamingo)' : 'var(--lagoon)' }}>{d.dia}</span>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', lineHeight: 1.2 }}>{d.tema}</b>
            <span className="small muted">{d.destino} · {d.km}</span>
          </a>
        ))}
      </section>

      <section className="card stack" aria-labelledby="casa-t">
        <h2 id="casa-t" className="card-title" style={{ fontSize: 'var(--fs-lg)' }}><Icon name="home" />Nossa casa</h2>
        <p className="small">{info.casa.nome} · anfitriã {info.casa.anfitria}. Lagoa a {info.casa.lagoa}, mar a {info.casa.mar}.</p>
        <p className="small muted">Check-in {info.casa.checkin} · Checkout {info.casa.checkout}</p>
        <p className="small"><b>Dicas da Claudia:</b> {info.casa.dicas}</p>
      </section>
      <div className="pride-line" aria-hidden="true" />
      <p className="footer-note">Feito com dados checados em set/2026 · confirme horários na véspera</p>
    </div>
  );
}
