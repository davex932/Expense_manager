import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Wallet, LayoutDashboard, DollarSign, Folder, Target } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Expenses', path: '/expenses', icon: DollarSign },
  { title: 'Categories', path: '/categories', icon: Folder },
  { title: 'Budget', path: '/budget', icon: Target },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const s = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 40,
      background: 'rgba(15, 23, 42, 0.34)',
      backdropFilter: 'blur(4px)',
      display: isOpen ? 'block' : 'none',
    },
    aside: {
      width: '260px',
      minWidth: '260px',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(226, 232, 240, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'transform 0.25s ease',
    },
    logoArea: {
      padding: '24px 22px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid rgba(241, 245, 249, 0.9)',
    },
    logoBox: {
      width: '42px', height: '42px',
      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 58%, #7c3aed 100%)',
      borderRadius: '18px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 14px 28px rgba(37, 99, 235, 0.24)',
    },
    logoText: {
      fontSize: '16px', fontWeight: '800', color: '#0f172a',
      fontFamily: "'Outfit', sans-serif",
      letterSpacing: '-0.02em',
    },
    nav: {
      padding: '18px 14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      flex: 1,
    },
    navItemBase: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 14px',
      borderRadius: '18px',
      fontSize: '14px',
      fontWeight: '650',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid transparent',
    },
    navItemActive: {
      background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)',
      color: '#2563eb',
      fontWeight: '800',
      borderColor: '#dbeafe',
      boxShadow: '0 12px 24px rgba(37, 99, 235, 0.10)',
    },
    navItemInactive: {
      background: 'transparent',
      color: '#64748b',
    },
  };

  return (
    <>
      <div style={s.overlay} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} style={s.aside}>
        <div style={s.logoArea}>
          <div style={s.logoBox}>
            <Wallet size={20} color="#fff" />
          </div>
          <span style={s.logoText}>Expense Manager</span>
        </div>

        <nav style={s.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                className="sidebar-link"
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                style={{
                  ...s.navItemBase,
                  ...(isActive ? s.navItemActive : s.navItemInactive),
                }}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
