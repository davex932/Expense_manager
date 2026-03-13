import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Wallet, LayoutDashboard, DollarSign, Folder } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Expenses', path: '/expenses', icon: DollarSign },
  { title: 'Categories', path: '/categories', icon: Folder },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const s = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 40,
      background: 'rgba(0,0,0,0.2)',
      display: isOpen ? 'block' : 'none',
    },
    aside: {
      width: '220px',
      minWidth: '220px',
      height: '100%',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    },
    logoArea: {
      padding: '20px 20px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid #f1f5f9',
    },
    logoBox: {
      width: '36px', height: '36px',
      background: 'linear-gradient(135deg, #5b7af9 0%, #2563eb 100%)',
      borderRadius: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    logoText: {
      fontSize: '15px', fontWeight: '700', color: '#1e293b',
      fontFamily: "'Outfit', sans-serif",
    },
    nav: {
      padding: '16px 12px',
      display: 'flex', flexDirection: 'column', gap: '4px',
      flex: 1,
    },
    navItemBase: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 14px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none',
      transition: 'all 0.15s',
      cursor: 'pointer',
      border: 'none',
    },
    navItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      fontWeight: '600',
    },
    navItemInactive: {
      background: 'transparent',
      color: '#64748b',
    },
  };

  return (
    <>
      <div style={s.overlay} onClick={onClose} />
      <aside style={s.aside}>
        {/* Logo */}
        <div style={s.logoArea}>
          <div style={s.logoBox}>
            <Wallet size={18} color="#fff" />
          </div>
          <span style={s.logoText}>Expense Manager</span>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
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
