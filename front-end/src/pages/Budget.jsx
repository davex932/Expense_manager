import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, CheckCircle2, AlertTriangle, Pencil, Trash2,
  AlertCircle, ChevronDown, Folder, TrendingDown, Wallet, X,
  Search, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../api';

// Custom Dropdown Component for designing options (General Purpose)
const CustomSelect = ({ value, onChange, options, variant = 'blue', icon: Icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(o => String(o.value || o.id) === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isBlue = variant === 'blue';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-800 flex items-center justify-between cursor-pointer border-2 transition-all duration-200 
          ${isBlue 
            ? `bg-blue-50 ${isOpen ? 'border-blue-600' : 'border-blue-200 hover:border-blue-300'}` 
            : `bg-white ${isOpen ? 'border-slate-300' : 'border-slate-200 hover:border-slate-300'}`
          } 
          ${variant === 'header' ? 'min-w-[160px]' : 'min-w-fit'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={16} className={isBlue ? 'text-blue-600' : 'text-slate-500'} />}
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.color && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedOption.color }} />}
              <span className="font-semibold text-[13px] text-slate-800">{selectedOption.label || selectedOption.name}</span>
            </div>
          ) : (
            <span className="font-semibold text-[13px] text-slate-400">{placeholder || 'Sélectionner'}</span>
          )}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isBlue ? 'text-blue-500' : 'text-slate-400'} ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-[calc(100%+8px)] right-0 ${variant === 'header' ? 'left-auto w-auto' : 'left-0 w-full'} min-w-[200px] bg-white rounded-2xl border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] z-[1100] max-h-[280px] overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200`}>
          {options.length === 0 ? (
            <div className="p-3 text-center text-slate-400 text-[13px] font-medium">Aucun élément</div>
          ) : (
            options.map(opt => (
              <div 
                key={opt.value || opt.id} 
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
                  ${String(value) === String(opt.value || opt.id) ? 'bg-slate-100' : 'hover:bg-slate-50'}
                `}
                onClick={() => { onChange(opt.value || opt.id); setIsOpen(false); }}
              >
                {opt.color && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />}
                <span className="text-[13px] font-semibold text-slate-800">{opt.label || opt.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const DefineBudgetModal = ({ isOpen, onClose, selectedMonth, selectedYear, categories, onSave, editingBudget }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        amount: editingBudget.amount,
      });
    } else {
      setFormData({
        category: '',
        amount: '',
      });
    }
  }, [editingBudget, isOpen]);

  if (!isOpen) return null;

  const monthLabel = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ][selectedMonth - 1];

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5 font-sans animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden p-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[12px] bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-slate-800 mb-0.5">{editingBudget ? 'Modifier le Budget' : 'Définir un Budget'}</h2>
              <p className="text-[13px] font-semibold text-slate-400">{monthLabel} {selectedYear}</p>
            </div>
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-slate-500 mb-2">Mois</label>
            <input className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed" value={monthLabel} disabled />
          </div>
          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-slate-500 mb-2">Année</label>
            <input className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed" value={selectedYear} disabled />
          </div>
        </div>

        <div className="flex flex-col mb-5">
          <label className="text-[13px] font-bold text-slate-500 mb-2">Catégorie <span className="text-red-500">*</span></label>
          <CustomSelect 
            variant="white"
            value={formData.category} 
            onChange={(val) => setFormData({ ...formData, category: val })}
            options={categories}
            placeholder="Sélectionner une catégorie"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-[13px] font-bold text-slate-500 mb-2">Montant du Budget <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all pr-10"
              type="number"
              placeholder="ex : 1500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">€</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button 
            className="flex-1 py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-blue-500/20 transition-all"
            onClick={() => onSave(formData, editingBudget?.id)}
          >
            {editingBudget ? <CheckCircle2 size={18} /> : <Plus size={18} />}
            {editingBudget ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const months = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' }, { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' }, { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
  ];

  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    try {
      const verification = await fetch(`${API_URL}/auth/jwt/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (!verification.ok) {
        const refresh = localStorage.getItem('refresh');
        if (refresh) {
          const refreshRes = await fetch(`${API_URL}/auth/jwt/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh })
          });
          if (refreshRes.ok) {
            token = (await refreshRes.json()).access;
            localStorage.setItem("token", token);
          }
        }
      }
    } catch (e) {}
    
    return fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [budRes, catRes] = await Promise.all([
        authFetch(`${API_URL}/budgets/?month=${selectedMonth}&year=${currentYear}`),
        authFetch(`${API_URL}/categories/`)
      ]);

      if (budRes.ok) {
        const data = await budRes.json();
        setBudgets(data);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data);
      }
    } catch (err) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const handleSaveBudget = async (formData, budgetId = null) => {
    if (!formData.category || !formData.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation: Check for duplicates (same category and month)
    const isDuplicate = budgets.some(b => 
      String(b.category) === String(formData.category) && 
      b.id !== budgetId
    );

    if (isDuplicate) {
      toast.error("Un budget existe déjà pour cette catégorie ce mois-ci");
      return;
    }

    try {
      const url = budgetId 
        ? `${API_URL}/budgets/${budgetId}/`
        : `${API_URL}/budgets/`;
      
      const method = budgetId ? 'PATCH' : 'POST';

      const response = await authFetch(url, {
        method,
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          month: selectedMonth,
          year: currentYear,
          category: parseInt(formData.category)
        })
      });

      if (response.ok) {
        toast.success(budgetId ? "Budget mis à jour" : "Budget créé avec succès");
        setIsModalOpen(false);
        setEditingBudget(null);
        loadData(); 
      } else {
        const error = await response.json();
        toast.error(error.detail || `Erreur lors de la ${budgetId ? 'modification' : 'création'} du budget`);
      }
    } catch (err) {
      toast.error("Une erreur est survenue");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      const response = await authFetch(`${API_URL}/budgets/${budgetId}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Budget supprimé");
        loadData();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (err) {
      toast.error("Une erreur est survenue");
    }
  };

  const fmt = (val) =>
    `${parseFloat(val || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €`;

  const totalBudget = budgets.reduce((s, b) => s + parseFloat(b.amount), 0);
  const totalSpent = budgets.reduce((s, b) => s + parseFloat(b.expense_total || 0), 0);
  const remaining = totalBudget - totalSpent;
  const isPositive = remaining >= 0;
  const exceededCats = budgets.filter(b => parseFloat(b.expense_total) > parseFloat(b.amount));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm font-medium gap-3">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Chargement du budget...
      </div>
    );
  }

  return (
    <div className="pb-10 font-sans">
      
      <DefineBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        selectedMonth={selectedMonth}
        selectedYear={currentYear}
        categories={categories}
        onSave={handleSaveBudget}
        editingBudget={editingBudget}
      />

      {/* Alert Banner */}
      {exceededCats.length > 0 && (
        <div className="flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 shadow-sm">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-extrabold text-red-600 mb-0.5">Attention : Budget dépassé</p>
            <p className="text-[13px] font-medium text-red-500">
              Vous avez dépassé votre budget pour {exceededCats.length} catégorie{exceededCats.length > 1 ? 's' : ''} ({exceededCats.map(b => b.category_name).join(', ')}).
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800 font-display mb-1">Planification Budgétaire</h1>
          <p className="text-[13px] text-slate-500">Définissez vos limites de dépenses mensuelles par catégorie</p>
        </div>

        <div className="flex items-center gap-3">
          <CustomSelect 
            variant="header"
            icon={Calendar}
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={months.map(m => ({ ...m, label: `${m.label} ${currentYear}` }))}
          />

          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all outline-none"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Créer un Budget
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
          <div>
            <p className="text-[13px] font-semibold text-slate-500 mb-2">Budget Total</p>
            <p className="text-[28px] font-bold text-slate-800 mb-1 tracking-tight">{fmt(totalBudget)}</p>
            <p className="text-[12px] font-medium text-slate-400">{budgets.length} budgets configurés</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex-1 mr-4">
            <p className="text-[13px] font-semibold text-slate-500 mb-2">Dépenses Actuelles</p>
            <p className="text-[28px] font-bold text-slate-800 mb-2 tracking-tight">{fmt(totalSpent)}</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((totalSpent / (totalBudget || 1)) * 100, 100)}%` }} 
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
          <div>
            <p className="text-[13px] font-semibold text-slate-500 mb-2">Reste à Vivre</p>
            <p className={`text-[28px] font-bold mb-1 tracking-tight ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '' : '-'}{fmt(Math.abs(remaining))}
            </p>
            <p className={`text-[12px] font-medium flex items-center gap-1.5 ${isPositive ? 'text-green-500' : 'text-red-400'}`}>
              {isPositive ? 'Vous êtes dans les limites 🎉' : 'Budget global dépassé'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
            {isPositive ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <h2 className="text-[16px] font-extrabold text-slate-800 mb-5">Détails par Catégorie</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((bud) => {
          const pct = parseFloat(bud.percentage_used || 0);
          const isOver = pct > 100;
          const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f97316' : '#3b82f6';
          const budRemaining = parseFloat(bud.amount) - parseFloat(bud.expense_total);
          
          let tailwindColorClass = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-orange-500' : 'bg-blue-500';
          let tailwindTextColorClass = pct >= 90 ? 'text-red-500' : pct >= 70 ? 'text-orange-500' : 'text-blue-500';

          return (
            <div key={bud.id} className="bg-white rounded-[20px] border border-slate-100 p-5 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center cursor-default bg-opacity-20 shadow-sm"
                    style={{ backgroundColor: `${bud.category_color || '#3b82f6'}20`, color: bud.category_color || '#3b82f6' }}
                  >
                    <Folder size={18} />
                  </div>
                  <span className="text-[14px] font-extrabold text-slate-800">{bud.category_name}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setEditingBudget(bud);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                    onClick={() => handleDeleteBudget(bud.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-3.5">
                <span className="text-[22px] font-extrabold text-slate-800 tracking-tight">{parseFloat(bud.expense_total || 0).toLocaleString('fr-FR')} €</span>
                <span className="text-[13px] font-medium text-slate-400">/ {parseFloat(bud.amount).toLocaleString('fr-FR')} €</span>
              </div>

              <div className="mb-4">
                <div className={`flex justify-between text-[11px] font-bold mb-1.5 ${tailwindTextColorClass}`}>
                  <span>{pct.toFixed(0)}%</span>
                  {isOver && <span>Dépassé !</span>}
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${tailwindColorClass}`} 
                    style={{ width: `${Math.min(pct, 100)}%` }} 
                  />
                </div>
              </div>

              <div className={`text-[12px] font-semibold mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5 ${isOver ? 'text-red-500' : 'text-slate-500'}`}>
                {isOver && <AlertCircle size={14} />}
                {isOver
                  ? `Dépassement de ${fmt(Math.abs(budRemaining))}`
                  : `Il vous reste ${fmt(budRemaining)} ce mois`}
              </div>
            </div>
          );
        })}

        <div 
          className="border-2 border-dashed border-slate-200 bg-transparent rounded-[20px] p-6 min-h-[220px] flex flex-col items-center justify-center cursor-pointer text-center group hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-3 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-colors">
            <Plus size={22} />
          </div>
          <p className="text-[14px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Ajouter un Budget</p>
        </div>
      </div>
    </div>
  );
};

export default Budget;
