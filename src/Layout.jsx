import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, User, Server, RefreshCw, Clock3, Menu } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/profile', label: 'Master Profile', icon: User },
  { to: '/entities', label: 'Entities', icon: Server },
  { to: '/sync-engine', label: 'Sync Engine', icon: RefreshCw },
  { to: '/sync-history', label: 'History', icon: Clock3 },
];

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="logo">AS</div><div>
          <div className="brand-title">AddressSync</div>
          <div className="brand-sub">Investor Ops</div>
        </div></div>
        <button className="menu-btn" onClick={() => setOpen((v) => !v)}><Menu size={18} /></button>
      </header>
      <div className="layout">
        <aside className={open ? 'sidebar' : 'sidebar collapsed'}>
          <div className="sidebar-head">Quick Navigator</div>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <Icon size={16} /> {item.label}
              </NavLink>
            );
          })}
        </aside>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
