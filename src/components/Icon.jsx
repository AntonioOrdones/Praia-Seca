// Conjunto de ícones em traço (24×24), desenhados para este projeto.
const P = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  sunrise: <><path d="M12 3v5M8.5 6.5 12 3l3.5 3.5M4.2 12.8l1.4 1.4M2 18h2M20 18h2M18.4 14.2l1.4-1.4M17 18a5 5 0 0 0-10 0M2 22h20" /></>,
  sunset: <><path d="M12 8V3M8.5 4.5 12 8l3.5-3.5M4.2 12.8l1.4 1.4M2 18h2M20 18h2M18.4 14.2l1.4-1.4M17 18a5 5 0 0 0-10 0M2 22h20" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  waves: <path d="M2 7c2 0 2-1.5 4-1.5S8 7 10 7s2-1.5 4-1.5S16 7 18 7s2-1.5 4-1.5M2 12.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5S16 18 18 18s2-1.5 4-1.5" />,
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  more: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
  pin: <><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  route: <><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" /><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v12H4Z" /><circle cx="12" cy="13.5" r="3.5" /></>,
  heart: <path d="M12 20s-7.5-4.6-9-9.4C2 7.2 4.3 4.5 7.3 4.5c2 0 3.3 1.1 4.7 2.8 1.4-1.7 2.7-2.8 4.7-2.8 3 0 5.3 2.7 4.3 6.1-1.5 4.8-9 9.4-9 9.4Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3h-3M6 19H3v-3" /><circle cx="7.5" cy="13.5" r="1" /><circle cx="16.5" cy="13.5" r="1" /></>,
  food: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10" /><path d="M17 21V3c-2 1-3.5 3.5-3.5 7s1.5 4 3.5 4" /></>,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" />,
  sparkle: <path d="M12 3c.5 4.5 2 6.5 7 7-5 .5-6.5 2.5-7 7-.5-4.5-2-6.5-7-7 5-.5 6.5-2.5 7-7ZM19 16c.2 1.6.8 2.3 2.5 2.5-1.7.2-2.3.9-2.5 2.5-.2-1.6-.8-2.3-2.5-2.5 1.7-.2 2.3-.9 2.5-2.5Z" />,
  bed: <><path d="M3 18v-8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="11" r="2" /></>,
  compassNight: <path d="M4 20c2-3 5-4 8-4s6 1 8 4M12 3v2M5.6 5.6l1.4 1.4M3 12h2M19 12h2M17 7l1.4-1.4M8 12a4 4 0 0 1 8 0" />,
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  umbrella: <><path d="M3 12a9 9 0 0 1 18 0Z" /><path d="M12 12v7a2 2 0 0 1-4 0" /></>,
  filter: <path d="M4 5h16l-6 8v5l-4 2v-7Z" />,
  ticket: <><path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3Z" /><path d="M14 6v12" strokeDasharray="2 2" /></>,
  alert: <><path d="M12 3 2 20h20Z" /><path d="M12 10v4M12 17h.01" /></>,
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" />,
  bag: <><path d="M5 8h14l-1 13H6Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5Z" /></>,
  wallet: <><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18M16 15h2" /></>,
  boat: <><path d="M3 17l2 3h14l2-3Z" /><path d="M12 3v14M12 4l6 9H12" /></>,
  mountain: <path d="M3 20 9.5 8l4 7 2.5-4 5 9Z" />,
  landmark: <><path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M3 10l9-6 9 6Z" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>,
  leaf: <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7" />,
  beach: <><path d="M3 20h18" /><path d="M12 20 9 9" /><path d="M3.5 10.5C5 6 9 4 13 5.5c-2 1-3 2.5-4 5-2-1.5-4-1.5-5.5 0Z" /><path d="M13 5.5c3 0 5.5 2 6 5-2-1-4-.5-5.5 1-.5-2.5-.5-4.5-.5-6Z" /></>,
  swap: <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
  theme: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>,
};

export default function Icon({ name, title, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} {...rest}>
      {title && <title>{title}</title>}
      {P[name] ?? P.info}
    </svg>
  );
}
