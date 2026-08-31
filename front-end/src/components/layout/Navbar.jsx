import React, { useState, useEffect } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_URL}/auth/users/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || '');
        }
      } catch (e) {}
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        <button 
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer" 
          onClick={onMenuClick} 
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {username && (
          <p className="hidden sm:block text-xs font-semibold text-slate-500 m-0">
            Bienvenue, <span className="font-extrabold text-slate-800">{username}</span> !
          </p>
        )}

        <NavLink 
          to="/profile" 
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all no-underline shrink-0"
        >
          <User size={15} className="text-slate-500" />
          <span>Profil</span>
        </NavLink>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shrink-0"
        >
          <LogOut size={15} />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
