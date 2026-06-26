import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const s = {
    header: {
      height: '60px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flexShrink: 0,
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
    },
    welcome: {
      fontSize: '13px',
      color: '#64748b',
    },
    welcomeSpan: {
      fontWeight: '600',
      color: '#1e293b',
    },
    btn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '7px 14px',
      borderRadius: '8px',
      border: '1.5px solid #e2e8f0',
      background: '#ffffff',
      fontSize: '13px',
      fontWeight: '500',
      color: '#1e293b',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.15s',
    },
  };

  return (
    <header style={s.header}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button style={s.menuBtn} onClick={onMenuClick}>
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
