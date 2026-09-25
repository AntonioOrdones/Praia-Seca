import { memo } from 'react';
import Icon from './Icon.jsx';
import { GRUPOS } from '../lib/meta.js';
import { rating } from '../lib/text.js';

function PlaceCard({ p, fav, onFav, onOpen, inPlan }) {
  const g = GRUPOS[p.grupo] ?? GRUPOS['Serviços & pernoite'];
  const r = rating(p.aval);
  return (
    <article className="place" style={{ '--gcolor': g.color, '--gcolor-soft': g.soft }}>
      <div className="place-ico" aria-hidden="true"><Icon name={g.icon} /></div>
      <button type="button" onClick={() => onOpen(p.id)} style={{ textAlign: 'left', display: 'grid', gap: 4 }} aria-label={`Ver detalhes de ${p.nome}`}>
        <h3>{p.nome}</h3>
        <span className="xsmall muted">{p.cat} · {p.cidade}{p.local ? ` · ${p.local}` : ''}</span>
        {p.desc && <p>{p.desc}</p>}
        <span className="t-meta">
          {inPlan && <span className="badge hot"><Icon name="calendar" /> no roteiro</span>}
          {r && <span className="badge sun"><Icon name="star" /> {r.nota.toFixed(1).replace('.', ',')}{r.n ? ` (${r.n.toLocaleString('pt-BR')})` : ''}</span>}
          {p.faixa && p.faixa !== 'a confirmar' && <span className="badge">{p.faixa}</span>}
          {p.min != null && <span className="badge"><Icon name="car" /> ~{p.min} min</span>}
          {p.chuva && <span className="badge dusk"><Icon name="umbrella" /> chuva ok</span>}
        </span>
      </button>
      <button type="button" className="fav" aria-pressed={fav} aria-label={fav ? `Tirar ${p.nome} dos favoritos` : `Favoritar ${p.nome}`} onClick={() => onFav(p.id)}>
        <Icon name="heart" />
      </button>
    </article>
  );
}
export default memo(PlaceCard);
