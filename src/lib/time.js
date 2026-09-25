// Tudo no fuso da viagem (America/Sao_Paulo, UTC−3, sem horário de verão em 2026).
const TZ = 'America/Sao_Paulo';
export const TRIP_START = '2026-11-16';
export const TRIP_END = '2026-11-23';

/** Minutos desde 00:00 de uma string "HH:MM". */
export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Data/hora "agora" no fuso da viagem.
 * Para testar: adicione ?agora=2026-11-17T15:30 na URL.
 */
export function nowInTrip() {
  const override = new URLSearchParams(location.search).get('agora');
  if (override && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(override)) {
    const [date, time] = override.split('T');
    return { date, minutes: toMin(time), stamp: Date.parse(`${override}:00-03:00`) };
  }
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: +parts.hour * 60 + +parts.minute, stamp: Date.now() };
}

export function countdown(stamp) {
  const target = Date.parse(`${TRIP_START}T14:00:00-03:00`);
  const diff = Math.max(0, target - stamp);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  return { dias: d, horas: h, passou: diff === 0 };
}

const fmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
export const longDate = (iso) => fmt.format(new Date(`${iso}T12:00:00Z`));
const wk = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' });
export const shortWeekday = (iso) => wk.format(new Date(`${iso}T12:00:00Z`)).replace('.', '');
export const dayNum = (iso) => iso.slice(8, 10);

/** Duração legível entre dois "HH:MM" (atravessa a meia-noite). */
export function duration(ini, fim) {
  let d = toMin(fim) - toMin(ini);
  if (d < 0) d += 1440;
  const h = Math.floor(d / 60), m = d % 60;
  return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`;
}

/** Itens da madrugada (00h–04h59 listados no fim do dia) contam como "depois da meia-noite". */
export const isLateNight = (item, index, arr) => index > 0 && toMin(item.ini) < 300 && toMin(arr[index - 1].ini) > toMin(item.ini);
