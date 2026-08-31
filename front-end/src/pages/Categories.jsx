import React, { useState } from 'react';
import { Plus, Coffee, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { API_URL } from '../api';

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316',
];

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded, categoryToEdit }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [status, setStatus] = React.useState({ name: '' });

  React.useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setStatus({ name: categoryToEdit.name || '' });
        setSelectedColor(categoryToEdit.iconColor || COLORS[0]);
      } else {
        setStatus({ name: '' });
        setSelectedColor(COLORS[0]);
      }
    }
  }, [isOpen, categoryToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus({ ...status, [name]: value });
  };

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
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`,
        ...options.headers
      }
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const url = categoryToEdit 
        ? `${API_URL}/categories/${categoryToEdit.id}/`
        : `${API_URL}/categories/`;
      const method = categoryToEdit ? 'PATCH' : 'POST';

      const res = await authFetch(url, {
        method: method,
        body: JSON.stringify({ name: status.name, color: selectedColor }),
      });

      if (res.ok) {
        toast.success(categoryToEdit ? 'Modification de la catégorie avec succès !' : 'Ajout de la catégorie avec succès !');
        setStatus({ name: '' });
        setSelectedColor(COLORS[0]);
        if (onCategoryAdded) onCategoryAdded();
        onClose();
      } else {
        toast.error(categoryToEdit ? 'Échec de la modification de la catégorie' : "Échec de l'ajout de la catégorie");
      }
    } catch (err) {
      toast.error(categoryToEdit ? 'Erreur lors de la modification de la catégorie' : "Erreur lors de l'ajout de la catégorie");
      console.error('Erreur:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={categoryToEdit ? 'Modifier la catégorie' : 'Ajouter une catégorie'}>
      <form onSubmit={handleSubmitPost} className="font-sans">
        <div className="mb-4">
          <label className="block text-[13px] font-bold text-slate-700 mb-2">Nom de la catégorie *</label>
          <input
            className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
            type="text"
            placeholder="Ex: Alimentation, Transport, Loisirs"
            name="name"
            value={status.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-[13px] font-bold text-slate-700 mb-3">Couleur</label>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-none cursor-pointer transition-all outline-none duration-200 ${selectedColor === color ? 'scale-110 shadow-md ring-2 ring-offset-2' : 'hover:scale-110 shadow-sm'}`}
                style={{ backgroundColor: color, ringColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-blue-500/20 transition-all">
            {categoryToEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
          <button type="button" className="flex-1 py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
};

const Categories = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const openAddModal = () => { setCategoryToEdit(null); setShowModal(true); };
  const openEditModal = (cat) => { setCategoryToEdit(cat); setShowModal(true); };

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
        'Authorization': `Bearer ${localStorage.getItem('token') || token}`,
        ...options.headers
      }
    });
  };

  const handleGet = async () => {
    try {
      const res = await authFetch(`${API_URL}/categories/`);

      if (res.ok) {
        const data = await res.json();
        setCategories(data.map((category) => ({
          name: category.name,
          icon: Coffee,
          count: category.number_transactions ?? 0,
          total: `${parseFloat(category.expense_total || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} FCFA`,
          budget: category.percentage_of_budget ?? 0,
          iconBg: '#fff7ed',
          iconColor: category.color || '#3b82f6',
          id: category.id,
        })));
      } else {
        console.error('Échec de la récupération des catégories');
        setCategories([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err);
      setCategories([]);
    }
  };

  React.useEffect(() => { handleGet(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/categories/${id}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Suppression de la catégorie avec succès !');
        handleGet();
      } else {
        toast.error('Échec de la suppression de la catégorie');
      }
    } catch (err) {
      toast.error('Erreur lors de la suppression de la catégorie');
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="font-sans pb-10">
      <AddCategoryModal isOpen={showModal} onClose={() => setShowModal(false)} onCategoryAdded={handleGet} categoryToEdit={categoryToEdit} />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[26px] font-bold text-slate-800 font-display mb-1">Catégories</h2>
          <p className="text-[13px] text-slate-500">Gérez vos catégories de dépenses et budgets</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all outline-none shrink-0" onClick={openAddModal}>
          <Plus size={16} /> Ajouter une catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((cat, i) => (
          <div key={i} className="group bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${cat.iconColor || '#3b82f6'}20`, color: cat.iconColor || '#3b82f6' }}>
                  <Coffee size={20} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-800 m-0 truncate leading-tight group-hover:text-blue-600 transition-colors">{cat.name}</p>
                  <p className="text-[12px] font-medium text-slate-400 m-0 leading-tight mt-0.5">{cat.count} transactions</p>
                </div>
              </div>
              <div className="flex gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-lg bg-slate-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors border-none cursor-pointer" onClick={(e) => { e.stopPropagation(); openEditModal(cat); }}>
                  <Pencil size={13} />
                </button>
                <button className="w-7 h-7 rounded-lg bg-slate-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Total Dépensé</p>
                <p className="text-[20px] font-bold text-slate-800 m-0 tracking-tight">{cat.total}</p>
              </div>
              <div className="w-[80px] text-right">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all duration-500 ease-out shadow-sm" style={{ width: `${Math.min(cat.budget, 100)}%`, backgroundColor: cat.iconColor || '#2563eb' }} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 m-0">{cat.budget}% du budget</p>
              </div>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-transparent min-h-[140px] transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 group outline-none" onClick={openAddModal}>
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-3 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-colors duration-300">
            <Plus size={20} />
          </div>
          <span className="text-[14px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors duration-300">Ajouter une catégorie</span>
        </button>
      </div>
    </div>
  );
};

export default Categories;
