// Metadados de apresentação: rótulos, ícones e cores por tipo/grupo.
export const TIPOS = {
  desl: { label: 'Deslocamento', icon: 'car', color: 'var(--t-desl)' },
  comida: { label: 'Comer & beber', icon: 'food', color: 'var(--t-comida)' },
  ativ: { label: 'Programa', icon: 'star', color: 'var(--t-ativ)' },
  descanso: { label: 'Descanso', icon: 'bed', color: 'var(--t-descanso)' },
  noite: { label: 'Noite', icon: 'moon', color: 'var(--t-noite)' },
  logistica: { label: 'Logística', icon: 'list', color: 'var(--t-logistica)' },
};

export const GRUPOS = {
  Praias: { icon: 'beach', color: 'var(--lagoon)', soft: 'var(--lagoon-soft)', cover: 'linear-gradient(135deg,#56d6de,#0a7481)' },
  'Comer & beber': { icon: 'food', color: 'var(--warn)', soft: 'var(--sun-soft)', cover: 'linear-gradient(135deg,#ffb65c,#e2467c)' },
  'História & cultura': { icon: 'landmark', color: 'var(--dusk)', soft: 'var(--dusk-soft)', cover: 'linear-gradient(135deg,#a58bff,#3b2f8f)' },
  'Natureza & trilhas': { icon: 'leaf', color: 'var(--ok)', soft: 'var(--lagoon-soft)', cover: 'linear-gradient(135deg,#5fd69a,#0a7481)' },
  'Passeios & aventura': { icon: 'boat', color: 'var(--lagoon)', soft: 'var(--lagoon-soft)', cover: 'linear-gradient(135deg,#56d6de,#6443d6)' },
  Noite: { icon: 'music', color: 'var(--flamingo)', soft: 'var(--flamingo-soft)', cover: 'linear-gradient(135deg,#6443d6,#e2467c)' },
  Descanso: { icon: 'bed', color: 'var(--dusk)', soft: 'var(--dusk-soft)', cover: 'linear-gradient(135deg,#ffd3e2,#a58bff)' },
  'Serviços & pernoite': { icon: 'bag', color: 'var(--ink-2)', soft: 'var(--surface-2)', cover: 'linear-gradient(135deg,#8a86a3,#1d1b33)' },
};

export const TURISMO = {
  praia: 'Praia', gastronomia: 'Gastronomia', historia: 'História', cultura: 'Cultura', ecologia: 'Ecologia', trilha: 'Trilha',
  paisagem: 'Paisagem', descanso: 'Descanso', aventura: 'Aventura', noite: 'Noite', compras: 'Compras', familia: 'Família',
  religioso: 'Religioso', esporte: 'Esporte', luxo: 'Luxo',
};

export const FAIXAS = ['Grátis', '$', '$$', '$$$', '$$$$'];
export const FAIXA_TXT = { Grátis: 'grátis', $: 'até R$ 60', $$: 'R$ 60–150', $$$: 'R$ 150–300', $$$$: 'acima de R$ 300' };
