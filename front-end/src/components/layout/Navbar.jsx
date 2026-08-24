import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="app-navbar">
      <div className="app-navbar__left">
        <button className="app-navbar__menu" onClick={onMenuClick} aria-label="Ouvrir le menu">
          <Menu size={22} />
        </button>
      </div>

      <div className="app-navbar__actions">
        <p className="app-navbar__welcome">
          Welcome, <span>davex932!</span>
        </p>

        <NavLink to="/profile" className="app-navbar__button"
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
        >
          <User size={15} />
          Profile
        </NavLink>

        <button className="app-navbar__button"
          aria-label="Se déconnecter"
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
