import Icon from './Icon.jsx';

const TABS = [
  { path: 'hoje', label: 'Hoje', icon: 'home' },
  { path: 'roteiro', label: 'Roteiro', icon: 'calendar' },
  { path: 'explorar', label: 'Explorar', icon: 'compass' },
  { path: 'ceu', label: 'Céu & mar', icon: 'waves' },
  { path: 'mais', label: 'Mais', icon: 'more' },
];

export default function TabBar({ current }) {
  const active = current === 'lugar' ? 'explorar' : current;
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      <ul role="list">
        {TABS.map((t) => (
          <li key={t.path}>
            <a href={`#/${t.path}`} aria-current={active === t.path ? 'page' : undefined}>
              <Icon name={t.icon} />
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
