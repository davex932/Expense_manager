import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const s = {
    header: {
      minHeight: '60px',
      background: 'rgba(255, 255, 255, 0.78)',
      backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.78)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 34px',
      flexShrink: 0,
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.035)',
      gap: '16px',
    },
    menuBtn: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
      padding: '4px',
    },
    rightGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    welcome: {
      fontSize: '13px',
      color: '#64748b',
    },
    welcomeSpan: {
      fontWeight: '600',
      color: '#0f172a',
    },
    btn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '999px',
      border: '1px solid #e2e8f0',
      background: 'rgba(255, 255, 255, 0.82)',
      fontSize: '13px',
      fontWeight: '800',
      color: '#0f172a',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.15s',
    },
  };

  return (
    <header style={s.header}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="navbar-menu-button" style={s.menuBtn} onClick={onMenuClick}>
          <Menu size={22} />
        </button>
      </div>

      <div style={s.rightGroup}>
        <p style={s.welcome}>
          Welcome, <span style={s.welcomeSpan}>davex932!</span>
        </p>

        <NavLink to="/profile" style={s.btn}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
        >
          <User size={15} />
          Profile
        </NavLink>

        <button style={s.btn}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
