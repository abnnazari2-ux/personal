import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#b8f53a' : 'none'} stroke={active ? '#b8f53a' : '#6b7a99'} strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: 'schedule', label: 'Today', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8f53a' : '#6b7a99'} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )},
  { id: 'workout', label: 'Workout', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8f53a' : '#6b7a99'} strokeWidth="2">
      <path d="M6.5 6.5h11v11h-11z" strokeWidth="0"/><rect x="2" y="10" width="4" height="4" rx="1"/><rect x="18" y="10" width="4" height="4" rx="1"/><line x1="6" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="18" y2="12"/><path d="M8 8h8M8 16h8M8 8v8M16 8v8"/>
    </svg>
  )},
  { id: 'nutrition', label: 'Nutrition', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8f53a' : '#6b7a99'} strokeWidth="2">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/>
    </svg>
  )},
  { id: 'progress', label: 'Progress', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8f53a' : '#6b7a99'} strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )},
];

export default function NavBar({ active, onNav }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bottom-nav z-50" style={{ background: '#090c11', borderTop: '1px solid #1a2235' }}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-smooth"
            style={{ color: active === item.id ? '#b8f53a' : '#6b7a99' }}
          >
            {item.icon(active === item.id)}
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
