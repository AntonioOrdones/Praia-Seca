import Icon from './Icon.jsx';

/** Botões de rota/mapa/fotos sempre abrindo fora (Google Maps abre o app no celular). */
export default function Links({ rota, mapa, fotos, fonte, compact }) {
  const cls = `btn${compact ? ' small' : ''}`;
  return (
    <div className="actions">
      {rota && (
        <a className={`${cls} pink`} href={rota} target="_blank" rel="noopener noreferrer">
          <Icon name="route" /> Como chegar
        </a>
      )}
      {mapa && (
        <a className={cls} href={mapa} target="_blank" rel="noopener noreferrer">
          <Icon name="pin" /> Mapa
        </a>
      )}
      {fotos && (
        <a className={cls} href={fotos} target="_blank" rel="noopener noreferrer">
          <Icon name="camera" /> Fotos
        </a>
      )}
      {fonte && (
        <a className={cls} href={fonte} target="_blank" rel="noopener noreferrer">
          <Icon name="external" /> Fonte
        </a>
      )}
    </div>
  );
}
