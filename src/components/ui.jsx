import React, { useEffect, useState } from 'react';

export function Logo({ small }) {
  return (
    <div className="logo" style={small ? { fontSize: '1rem' } : null}>
      <svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#141c2b" /><path d="M290 64 136 288h104l-26 160 162-232H270z" fill="#f5b83d" /></svg>
      Switched On
    </div>
  );
}

/** Tiny hash router: #/path/parts */
export function useRoute() {
  const get = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [r, setR] = useState(get);
  useEffect(() => { const f = () => { setR(get()); window.scrollTo(0, 0); }; window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  return r;
}
export const go = path => { window.location.hash = '#/' + path; };

const icons = {
  today: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  practice: <><path d="M4 5h16M4 12h16M4 19h10" /></>,
  progress: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01" /></>,
  writing: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M14 6l4 4" /></>,
  chats: <><path d="M4 5h16v11H8l-4 4z" /></>,
  alerts: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>,
};
export function Tabs({ items, current }) {
  return (
    <div className="tabs"><nav>
      {items.map(([id, label]) => (
        <a key={id} href={'#/' + id} className={current === id ? 'on' : ''} aria-current={current === id ? 'page' : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[id]}</svg>
          {label}
        </a>
      ))}
    </nav></div>
  );
}

export const pct = x => x == null ? '–' : Math.round(x * 100) + '%';
export const when = iso => new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
