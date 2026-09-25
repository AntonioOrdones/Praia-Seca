import { toMin } from '../lib/time.js';

const W = 320;

/** Arco do sol: nascer → pôr, com horas douradas e posição atual (se for hoje). */
export function SunArc({ sol, nowMin }) {
  const H = 150, pad = 24, base = 118;
  const a = toMin(sol.nasce), b = toMin(sol.poe);
  const x = (m) => pad + ((m - a) / (b - a)) * (W - 2 * pad);
  const y = (m) => {
    const t = (m - a) / (b - a);
    return base - Math.sin(Math.PI * Math.min(1, Math.max(0, t))) * 92;
  };
  const pts = Array.from({ length: 41 }, (_, i) => a + (i / 40) * (b - a));
  const path = pts.map((m, i) => `${i ? 'L' : 'M'}${x(m).toFixed(1)},${y(m).toFixed(1)}`).join(' ');
  const gold = [[a, toMin(sol.douradaAm)], [toMin(sol.douradaPm), b]];
  const showNow = nowMin != null && nowMin > a && nowMin < b;
  return (
    <svg className="sun-arc" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Sol nasce às ${sol.nasce} e se põe às ${sol.poe}`}>
      <defs>
        <linearGradient id="arcg" x1="0" x2="1">
          <stop offset="0" stopColor="#ff8a5b" /><stop offset=".5" stopColor="#ffb65c" /><stop offset="1" stopColor="#e2467c" />
        </linearGradient>
      </defs>
      <line x1="8" x2={W - 8} y1={base} y2={base} stroke="var(--line)" strokeWidth="2" />
      <path d={path} fill="none" stroke="url(#arcg)" strokeWidth="4" strokeLinecap="round" />
      {gold.map(([s, e], i) => (
        <path key={i} d={pts.filter((m) => m >= s && m <= e).map((m, j) => `${j ? 'L' : 'M'}${x(m)},${y(m)}`).join(' ')}
          fill="none" stroke="#ffd08a" strokeWidth="10" strokeLinecap="round" opacity=".55" />
      ))}
      {showNow && <circle cx={x(nowMin)} cy={y(nowMin)} r="9" fill="#ffb65c" stroke="var(--surface)" strokeWidth="3" />}
      <text x={x(a)} y={base + 18} textAnchor="middle">{sol.nasce}</text>
      <text x={x(b)} y={base + 18} textAnchor="middle">{sol.poe}</text>
      <text x={W / 2} y={base - 98} textAnchor="middle">meio-dia solar {sol.meio}</text>
    </svg>
  );
}

/** Curva de maré do dia (interpolação cossenoidal entre preamares e baixa-mares). */
export function TideChart({ mares }) {
  if (!mares?.length || mares.length < 2) return null;
  const H = 130, top = 16, bot = 96;
  const pts = mares.map((m) => ({ t: toMin(m.h), v: m.alt, tipo: m.tipo }));
  const vmin = Math.min(...pts.map((p) => p.v)) - 0.05, vmax = Math.max(...pts.map((p) => p.v)) + 0.05;
  const X = (t) => 12 + (t / 1440) * (W - 24);
  const Y = (v) => bot - ((v - vmin) / (vmax - vmin)) * (bot - top);
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1];
    for (let k = 0; k <= 20; k++) {
      const f = k / 20, t = p.t + f * (q.t - p.t);
      const v = p.v + (q.v - p.v) * (1 - Math.cos(Math.PI * f)) / 2;
      d += `${d ? 'L' : 'M'}${X(t).toFixed(1)},${Y(v).toFixed(1)} `;
    }
  }
  const fillD = `${d} L${X(pts.at(-1).t)},${bot} L${X(pts[0].t)},${bot} Z`;
  return (
    <svg className="tide" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Marés: ${mares.map((m) => `${m.tipo} ${m.h} ${m.alt} m`).join(', ')}`}>
      <path d={fillD} fill="var(--lagoon-soft)" />
      <path d={d} fill="none" stroke="var(--lagoon)" strokeWidth="2.5" />
      {pts.map((p) => (
        <g key={p.t}>
          <circle cx={X(p.t)} cy={Y(p.v)} r="4" fill={p.tipo === 'alta' ? 'var(--lagoon)' : 'var(--flamingo)'} />
          <text x={X(p.t)} y={p.tipo === 'alta' ? Y(p.v) - 8 : Y(p.v) + 16} textAnchor="middle">{p.v.toFixed(2).replace('.', ',')} m</text>
        </g>
      ))}
      {[0, 6, 12, 18, 24].map((h) => <text key={h} x={X(h * 60)} y={H - 6} textAnchor="middle">{String(h).padStart(2, '0')}h</text>)}
    </svg>
  );
}

/** Lua crescente vista do hemisfério sul (parte iluminada à esquerda). */
export function Moon({ ilum, size = 56 }) {
  const f = ilum / 100, r = 24, c = 28;
  const k = Math.abs(1 - 2 * f) * r; // semieixo do terminador
  const lit = `M${c},${c - r} A${r},${r} 0 0 0 ${c},${c + r} A${k},${r} 0 0 ${f > 0.5 ? 0 : 1} ${c},${c - r} Z`;
  return (
    <svg className="moon" viewBox="0 0 56 56" width={size} height={size} role="img" aria-label={`Lua ${ilum}% iluminada`}>
      <circle cx={c} cy={c} r={r} fill="var(--surface-2)" stroke="var(--line)" />
      <path d={lit} fill="#ffe7b0" />
    </svg>
  );
}
