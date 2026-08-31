import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronDown, Coffee, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { API_URL } from '../api';

const CustomSelect = ({ options, value, onChange, placeholder, style, variant = 'form' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const isFilter = variant === 'filter';

  return (
    <div ref={containerRef} className="relative w-full" style={style}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] flex items-center justify-between cursor-pointer border-2 transition-all duration-200 min-h-[42px]
          ${isFilter ? 'bg-white border-slate-200 hover:border-slate-300 min-w-[180px]' : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'}
          ${isOpen ? (isFilter ? 'border-blue-500' : 'border-blue-500 bg-white') : ''}
          ${selectedOption ? 'text-slate-800 font-semibold' : 'text-slate-400 font-medium'}
        `}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-slate-200 rounded-[14px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] z-50 max-h-[220px] overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {placeholder && (
            <div
              onClick={() => { onChange(""); setIsOpen(false); }}
              className={`px-3 py-2.5 text-[13px] rounded-lg cursor-pointer transition-colors ${value === "" ? 'bg-slate-100 text-slate-800 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {placeholder}
            </div>
          )}
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`flex items-center justify-between px-3 py-2.5 text-[13px] rounded-lg cursor-pointer transition-colors mt-0.5
                ${value === opt.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 font-medium hover:bg-slate-50'}
              `}
            >
              {opt.label}
              {value === opt.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316',
];

const AddExpenseModal = ({ isOpen, onClose, categories, expenseToEdit, onRefresh }) => {

  const today = new Date().toISOString().split('T')[0];

  const [status, setStatus] = React.useState({
    amount: '',
    category: '',
    date: today,
    description: '',
  });

  useEffect(() => {
    if (expenseToEdit) {
      setStatus({
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || '',
        date: expenseToEdit.date || today,
        description: expenseToEdit.description || '',
      });
    } else {
      setStatus({
        amount: '',
        category: '',
        date: today,
        description: '',
      });
    }
  }, [expenseToEdit, isOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus({
      ...status,
      [name]: value
    })
  }

  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("token");
    try {
      const v = await fetch(`${API_URL}/auth/jwt/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      if (!v.ok) {
        const r = localStorage.getItem("refresh");
        if (r) {
          const res = await fetch(`${API_URL}/auth/jwt/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: r })
          });
          if (res.ok) {
            const data = await res.json();
            token = data.access;
            localStorage.setItem("token", token);
          }
        }
      }
    } catch (e) {
      console.error("Auth verify error", e);
    }

    return fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || token}`,
        ...options.headers
      }
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const method = expenseToEdit ? 'PATCH' : 'POST';
      const url = expenseToEdit 
        ? `${API_URL}/expenses/${expenseToEdit.id}/`
        : `${API_URL}/expenses/`;

      const response = await authFetch(url, {
        method: method,
        body: JSON.stringify({
          amount: status.amount,
          category: status.category,
          date: status.date,
          description: status.description,
        })
      });

      if (response.ok) {
        toast.success(expenseToEdit ? "Modification de la dépense avec succès !" : "Ajout de la dépense avec succès !");
        onRefresh();
        onClose();
      } else {
        toast.error(expenseToEdit ? "Échec de la modification de la dépense" : "Échec de l'ajout de la dépense");
      }
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement de la dépense");
      console.error("Erreur:", err);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expenseToEdit ? "Modifier la dépense" : "Ajouter une dépense"}>

      <form onSubmit={handleSubmitPost} className="font-sans">
        <div className="mb-4">
          <label className="block text-[13px] font-bold text-slate-700 mb-2">Montant *</label>
          <div className="relative">
            <input 
              className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all pl-9" 
              type="number" step="0.01" placeholder="0.00" 
              onChange={handleChange} name="amount" value={status.amount} required 
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">€</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-bold text-slate-700 mb-2">Catégorie *</label>
          <CustomSelect
            variant="form"
            placeholder="Sélectionner une catégorie"
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            onChange={(val) => setStatus(prev => ({ ...prev, category: val }))}
            name="category"
            value={status.category}
          />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-bold text-slate-700 mb-2">Date *</label>
          <input
            className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
            type="date"
            max={today}
            onChange={handleChange}
            name="date"
            value={status.date}
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-bold text-slate-700 mb-2">Description</label>
          <textarea 
            className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all resize-y min-h-[90px]" 
            placeholder="Ajouter une note..." 
            onChange={handleChange} name="description" value={status.description} 
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-blue-500/20 transition-all">
            {expenseToEdit ? "Enregistrer" : "Ajouter la dépense"}
          </button>

          <button type="button" className="flex-1 py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
};

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("token");
    try {
      const v = await fetch(`${API_URL}/auth/jwt/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      if (!v.ok) {
        const r = localStorage.getItem("refresh");
        if (r) {
          const res = await fetch(`${API_URL}/auth/jwt/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: r })
          });
          if (res.ok) {
            const data = await res.json();
            token = data.access;
            localStorage.setItem("token", token);
          }
        }
      }
    } catch (e) {
      console.error("Auth verify error", e);
    }

    return fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || token}`,
        ...options.headers
      }
    });
  };

  const handleGetCategories = async () => {
    try {
      const response = await authFetch(`${API_URL}/categories/`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      } else {
        console.error("Échec de la récupération des catégories");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories:", err);
    }
  };

  const handleGetExpenses = async (categoryId = "", search = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryId) params.append('category', categoryId);
      if (search) params.append('search', search);

      const url = `${API_URL}/expenses/${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await authFetch(url);

      if (response.ok) {
        const data = await response.json();
        setExpenses(data || []);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des dépenses:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`${API_URL}/expenses/${id}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Suppression de la dépense avec succès !");
        handleGetExpenses(filterCategoryId, debouncedSearchQuery);
      } else {
        toast.error("Échec de la suppression de la dépense");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression de la dépense");
      console.error("Erreur:", err);
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setShowModal(true);
  };

  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setShowModal(true);
  };

  React.useEffect(() => {
    handleGetCategories();
  }, []);

  React.useEffect(() => {
    handleGetExpenses(filterCategoryId, debouncedSearchQuery);
  }, [filterCategoryId, debouncedSearchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm font-medium gap-3">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Chargement des dépenses...
      </div>
    );
  }

  return (
    <div className="font-sans pb-10">
      <AddExpenseModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        categories={categories} 
        expenseToEdit={expenseToEdit}
        onRefresh={() => handleGetExpenses(filterCategoryId, debouncedSearchQuery)}
      />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[26px] font-bold text-slate-800 font-display mb-1">Dépenses</h2>
          <p className="text-[13px] text-slate-500">Gérez toutes vos dépenses</p>
        </div>
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all outline-none" 
          onClick={handleOpenAddModal}
        >
          <Plus size={16} /> Ajouter une dépense
        </button>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex-1 relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={18} />
          </div>
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
            placeholder="Rechercher des dépenses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto">
          <CustomSelect
            variant="filter"
            placeholder="Toutes les catégories"
            value={filterCategoryId}
            onChange={setFilterCategoryId}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {expenses.length > 0 ? (
        <div className="flex flex-col gap-3">
          {expenses.map((expense) => (
              <div 
                key={expense.id}
                className="group flex flex-col sm:flex-row items-center bg-white border border-slate-100 rounded-[16px] p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-200 gap-4"
              >
                <div className="flex-1 w-full flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 shrink-0"
                      style={{ backgroundColor: `${expense.category_color || '#f8fafc'}20`, color: expense.category_color || '#94a3b8' }}
                    >
                      {/* You can add dynamic icons here if available, fallback to Coffee */}
                      <Coffee size={20} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[15px] font-bold text-slate-800 m-0">{expense.description || "Dépense"}</p>
                      <p className="text-[13px] font-semibold text-slate-400 m-0">{expense.category_name || "Catégorie inconnue"}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-[16px] font-extrabold text-slate-800 m-0 tracking-tight">-{parseFloat(expense.amount || "0").toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
                    <p className="text-[11px] font-bold text-slate-400 m-0 uppercase mt-0.5">{new Date(expense.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:ml-4 w-full sm:w-auto justify-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    className="p-2.5 rounded-xl border-none bg-slate-50 text-blue-500 cursor-pointer flex items-center justify-center transition-all hover:bg-blue-50"
                    onClick={() => handleEdit(expense)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    className="p-2.5 rounded-xl border-none bg-slate-50 text-red-500 cursor-pointer flex items-center justify-center transition-all hover:bg-red-50"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[20px] py-16 px-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
             <Coffee size={32} />
          </div>
          <p className="text-[18px] font-bold text-slate-800 m-0">{(filterCategoryId || debouncedSearchQuery) ? "Aucune dépense pour cette recherche" : "Aucune dépense trouvée"}</p>
          <p className="text-[14px] font-medium text-slate-500 m-0 max-w-sm mb-2">{(filterCategoryId || debouncedSearchQuery) ? "Essayez d'ajuster votre recherche ou filtre de catégorie" : "Ajoutez votre première dépense pour commencer"}</p>
          {(filterCategoryId || debouncedSearchQuery) ? (
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-200 transition-colors mt-2" 
              onClick={() => { setFilterCategoryId(""); setSearchQuery(""); }}
            >
              Effacer les filtres
            </button>
          ) : (
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all mt-2" 
              onClick={handleOpenAddModal}
            >
              <Plus size={18} /> Ajouter la première dépense
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default Expenses;


