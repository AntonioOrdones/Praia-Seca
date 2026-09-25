import Icon from './Icon.jsx';
import Links from './Links.jsx';
import { GRUPOS, FAIXA_TXT, TURISMO } from '../lib/meta.js';
import { phones, instagram, isUnknown } from '../lib/text.js';

const Row = ({ k, v }) => (isUnknown(v) || v === '—' ? null : (<><dt>{k}</dt><dd>{v}</dd></>));

export default function PlaceDetail({ p, fav, onFav }) {
  const g = GRUPOS[p.grupo] ?? GRUPOS['Serviços & pernoite'];
  const tels = phones(p.contato);
  const insta = instagram(p.contato);
  const pending = ['func', 'preco', 'aval'].filter((k) => isUnknown(p[k]));
  return (
    <>
      <div className="sheet-cover" style={{ '--gcover': g.cover }} aria-hidden="true"><Icon name={g.icon} /></div>
      <div className="sheet-head">
        <div className="stack" style={{ gap: 4 }}>
          <span className="eyebrow">{p.cat} · {p.cidade}</span>
          <h2 id="sheet-title" style={{ fontSize: 'var(--fs-xl)' }}>{p.nome}</h2>
          {p.local && <span className="small muted">{p.local}</span>}
        </div>
        <button type="button" className="fav" aria-pressed={fav} aria-label={fav ? 'Tirar dos favoritos' : 'Favoritar'} onClick={() => onFav(p.id)}>
          <Icon name="heart" />
        </button>
      </div>
      <div className="t-meta">
        {p.faixa && !isUnknown(p.faixa) && <span className="badge sun">{p.faixa} · {FAIXA_TXT[p.faixa] ?? ''}</span>}
        {p.km != null && <span className="badge"><Icon name="car" /> ~{p.km} km · ~{p.min} min da casa</span>}
        {p.chuva && <span className="badge dusk"><Icon name="umbrella" /> bom com chuva</span>}
        {p.fechaSeg && <span className="badge hot">fecha segunda</span>}
        {p.fechaTer && <span className="badge hot">fecha terça</span>}
        {p.tags.map((t) => <span key={t} className="badge">{TURISMO[t] ?? t}</span>)}
      </div>
      {p.desc && <p>{p.desc}</p>}
      <Links rota={p.rota} mapa={p.mapa} fotos={p.fotos} fonte={p.fonte} />
      {(tels.length > 0 || insta) && (
        <div className="actions">
          {tels.map((t) => (
            <span key={t.tel} className="row">
              <a className="btn small" href={`tel:${t.tel}`}><Icon name="phone" /> {t.label}</a>
              {t.zap && <a className="btn small" href={t.zap} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            </span>
          ))}
          {insta && <a className="btn small" href={insta} target="_blank" rel="noopener noreferrer">Instagram</a>}
        </div>
      )}
      {p.dicas && (
        <div className="planb"><b>Dica: </b>{p.dicas}</div>
      )}
      <dl className="kv">
        <Row k="Funcionamento" v={p.func} />
        <Row k="Fecha em" v={p.fecha} />
        <Row k="Feriado 20/11" v={p.feriado} />
        <Row k="Preço" v={p.preco} />
        <Row k="Reserva" v={p.reserva} />
        <Row k="Melhor hora" v={p.melhor} />
        <Row k="Tempo" v={p.tempo} />
        <Row k="Avaliação" v={p.aval} />
        <Row k="Contato" v={p.contato} />
        <Row k="Endereço" v={p.end} />
        <Row k="Para quem" v={p.publico} />
        <Row k="Cuidados" v={p.cuidados} />
      </dl>
      {pending.length > 0 && (
        <p className="xsmall muted"><Icon name="info" style={{ display: 'inline', width: 14, verticalAlign: '-2px' }} /> Sem dado confirmado para {pending.map((k) => ({ func: 'horário', preco: 'preço', aval: 'avaliação' })[k]).join(', ')}. Confirme no Instagram ou no Google Maps. Confiança da informação: {p.conf || '—'}.</p>
      )}
    </>
  );
}
