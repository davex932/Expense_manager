import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  LayoutDashboard, 
  DollarSign, 
  Folder, 
  Target, 
  BarChart2, 
  User, 
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { API_URL } from '../../api';

const menuItems = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Dépenses', path: '/expenses', icon: DollarSign },
  { title: 'Catégories', path: '/categories', icon: Folder },
  { title: 'Budget', path: '/budget', icon: Target },
  { title: 'Statistiques', path: '/statistiques', icon: BarChart2 },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: 'Chargement...', email: '' });

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/auth/users/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (err) {
      console.error("Erreur récup user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden lg:hidden'}`} 
        onClick={onClose} 
      />
      
      <aside className={`fixed lg:relative w-[260px] min-w-[260px] h-full bg-white border-r border-slate-100 flex flex-col shrink-0 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.2)] shrink-0">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-[18px] font-extrabold text-slate-800 tracking-tight font-display">
            Davex Finance
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 px-4 py-3 flex flex-col gap-1 overflow-y-auto">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-2">Menu Principal</p>
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={({ isActive: linkActive }) => `
                      flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border-none
                      ${isActive || linkActive 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-blue-600 shadow-[inset_4px_0_0_-2px_#4f46e5]' 
                        : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }
                    `}
                >
                    <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.title}</span>
                </NavLink>
                );
            })}

            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-6 pb-2">Préférences</p>
            <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-blue-600 shadow-[inset_4px_0_0_-2px_#4f46e5]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                <Settings size={19} className="text-slate-400" />
                <span>Paramètres</span>
            </NavLink>
            <div className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer">
                <HelpCircle size={19} className="text-slate-400" />
                <span>Aide & Support</span>
            </div>
        </div>

        {/* User Profile */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-slate-100/80">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {userData.username ? userData.username.slice(0, 2).toUpperCase() : '??'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[13px] font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{userData.username}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{userData.email}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="mt-4 w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-red-100 bg-white text-red-500 text-[13px] font-semibold cursor-pointer transition-all hover:bg-red-50 hover:border-red-200"
            >
                <LogOut size={16} />
                Déconnexion
            </button>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;

