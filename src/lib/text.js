/** Normaliza para busca: minúsculas, sem acento. */
export const norm = (s = '') => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/** Primeira nota numérica encontrada ("Google 4,7 (2.345)" → 4.7). */
export function rating(txt = '') {
  const m = txt.match(/(Google|Tripadvisor|Civitatis)?\s*([0-5][,.]\d)\s*\(?([\d.]+)?/i);
  if (!m) return null;
  return { nota: parseFloat(m[2].replace(',', '.')), n: m[3] ? parseInt(m[3].replace(/\./g, ''), 10) : null, fonte: m[1] || '' };
}

/** Telefones brasileiros dentro de um texto de contato. */
export function phones(txt = '') {
  const out = [];
  const re = /(?:\+?55\s*)?\(?(\d{2})\)?\s*(9?\s?\d{4})[-\s]?(\d{4})/g;
  let m;
  while ((m = re.exec(txt))) {
    const digits = `${m[1]}${m[2].replace(/\s/g, '')}${m[3]}`;
    if (digits.length < 10) continue;
    const zap = /whats|zap|wa\b/i.test(txt.slice(Math.max(0, m.index - 20), m.index + 25)) || digits.length === 11;
    out.push({ label: m[0].trim(), tel: `+55${digits}`, zap: zap && digits.length === 11 ? `https://wa.me/55${digits}` : null });
  }
  return out;
}

/** @instagram → link */
export function instagram(txt = '') {
  const m = txt.match(/@([a-z0-9._]{3,30})/i);
  return m && !m[1].includes('@') ? `https://instagram.com/${m[1]}` : null;
}

export const isUnknown = (s) => !s || /^a confirmar/i.test(s.trim());
