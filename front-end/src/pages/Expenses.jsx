import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, ChevronDown, Coffee, Pencil, Trash2 } from 'lucide-react';

import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

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
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '10px 14px',
          background: isFilter ? '#ffffff' : '#f8fafc',
          border: isOpen ? '1px solid #2563eb' : (isFilter ? '1px solid #e2e8f0' : '1.5px solid #e2e8f0'),
          borderRadius: '8px', fontSize: '13px',
          color: selectedOption ? '#1e293b' : (isFilter ? '#64748b' : '#94a3b8'),
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxSizing: 'border-box', transition: 'all 0.2s', minHeight: '42px',
          fontWeight: selectedOption ? '500' : '400',
          minWidth: isFilter ? '180px' : 'auto'
        }}
        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.borderColor = '#2563eb'; if (!isFilter) e.currentTarget.style.background = '#fff'; } }}
        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.borderColor = isFilter ? '#e2e8f0' : '#e2e8f0'; if (!isFilter) e.currentTarget.style.background = '#f8fafc'; } }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} color={isFilter ? "#64748b" : "#94a3b8"} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
          background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          zIndex: 50, maxHeight: '220px', overflowY: 'auto',
          padding: '6px',
        }}>
          {placeholder && (
            <div
              onClick={() => { onChange(""); setIsOpen(false); }}
              style={{
                padding: '10px 12px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer',
                borderRadius: '6px', background: value === "" ? '#f8fafc' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.background = value === "" ? '#f8fafc' : 'transparent'}
            >
              {placeholder}
            </div>
          )}
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{
                padding: '10px 12px', fontSize: '13px', color: '#1e293b', cursor: 'pointer',
                borderRadius: '6px', background: value === opt.value ? '#eff6ff' : 'transparent',
                fontWeight: value === opt.value ? '600' : '500',
                transition: 'background 0.2s',
                marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.target.style.background = value === opt.value ? '#eff6ff' : '#f8fafc'}
              onMouseLeave={(e) => e.target.style.background = value === opt.value ? '#eff6ff' : 'transparent'}
            >
              {opt.label}
              {value === opt.value && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />
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

  const s = {
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' },
    input: {
      width: '100%', padding: '10px 14px',
      background: '#f8fafc', border: '1.5px solid #e2e8f0',
      borderRadius: '8px', fontSize: '13px', color: '#1e293b',
      outline: 'none', boxSizing: 'border-box',
    },
    textarea: {
      width: '100%', padding: '10px 14px',
      background: '#f8fafc', border: '1.5px solid #e2e8f0',
      borderRadius: '8px', fontSize: '13px', color: '#1e293b',
      outline: 'none', boxSizing: 'border-box',
      resize: 'vertical', minHeight: '80px',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    btnRow: { display: 'flex', gap: '10px', marginTop: '20px' },
    submitBtn: {
      flex: 1, padding: '11px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    },
    cancelBtn: {
      padding: '11px 20px', background: '#fff',
      border: '1.5px solid #e2e8f0', borderRadius: '10px',
      fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer',
    },
  };

  const onF = e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; };
  const onB = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; };

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

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh');
    const refreshResponse = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh: refresh
      })
    })
    const data = await refreshResponse.json();
    localStorage.setItem("token", data.access)

    return data.access
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      let access = localStorage.getItem('token');
      const verification = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: access
        })
      });

      const verificationData = await verification.json();
      if (!verificationData) {
        access = await refreshAccessToken();
        localStorage.setItem("token", access);
      }

      const method = expenseToEdit ? 'PATCH' : 'POST';
      const url = expenseToEdit 
        ? `http://127.0.0.1:8000/expenses/${expenseToEdit.id}/`
        : "http://127.0.0.1:8000/expenses/";

      const response = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
    <Modal isOpen={isOpen} onClose={onClose} title={expenseToEdit ? "Edit Expense" : "Add Expense"}>

      <form onSubmit={handleSubmitPost}>
        <div style={s.field}>
          <label style={s.label}>Amount *</label>
          <input style={s.input} type="number" step="0.01" placeholder="0.00" onFocus={onF} onBlur={onB} onChange={handleChange} name="amount" value={status.amount} />
        </div>

        <div style={s.field}>
          <label style={s.label}>Category *</label>
          <CustomSelect
            variant="form"
            placeholder="Select a category"
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            onChange={(val) => setStatus(prev => ({ ...prev, category: val }))}
            name="category"
            value={status.category}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Date *</label>
          <input
            style={s.input}
            type="date"
            max={today}
            onFocus={onF}
            onBlur={onB}
            onChange={handleChange}
            name="date"
            value={status.date}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} placeholder="Add a note about this expense..." onFocus={onF} onBlur={onB} onChange={handleChange} name="description" value={status.description} />
        </div>

        <div style={s.btnRow}>
          <button type="submit" style={s.submitBtn}>{expenseToEdit ? "Save Changes" : "Add Expense"}</button>

          <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

const mockExpenses = [
  { id: 1, description: 'Courses alimentaires', amount: '45.50', date: '2026-03-18', category_name: 'Alimentation', category_color: '#3b82f6' },
  { id: 2, description: 'Loyer Mars', amount: '1200.00', date: '2026-03-01', category_name: 'Logement', category_color: '#ef4444' },
  { id: 3, description: 'Abonnement Netflix', amount: '15.99', date: '2026-03-15', category_name: 'Divertissement', category_color: '#22c55e' },
];

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
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



  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh');
    const refreshResponse = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh: refresh
      })
    })
    const data = await refreshResponse.json();
    localStorage.setItem("token", data.access)

    return data.access
  }

  const handleGetCategories = async () => {
    try {
      let access = localStorage.getItem('token');
      if (!access) return;

      const verification = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: access
        })
      })
      const verificationData = await verification.json();
      if (!verificationData) {
        access = await refreshAccessToken()
        localStorage.setItem("token", access)
      }

      const AddCategoryResponse = await fetch("http://127.0.0.1:8000/categories/", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (AddCategoryResponse.ok) {
        const AddCategoryData = await AddCategoryResponse.json();
        setCategories(AddCategoryData);
      } else {
        console.error("Échec de la récupération des categories");
      }

    } catch (err) {
      console.error("Erreur lors de la récupération des categories:", err);
    }
  };

  const handleGetExpenses = async (categoryId = "", search = "") => {
    try {
      let access = localStorage.getItem('token');
      if (!access) return;

      const verification = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: access })
      });

      const verificationData = await verification.json();
      if (!verificationData) {
        access = await refreshAccessToken();
        localStorage.setItem("token", access);
      }

      const params = new URLSearchParams();
      if (categoryId) params.append('category', categoryId);
      if (search) params.append('search', search);

      const url = `http://127.0.0.1:8000/expenses/${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });



      if (response.ok) {
        const data = await response.json();
        setExpenses(data || []);
      }

    } catch (err) {
      console.error("Erreur lors de la récupération des depenses:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      let access = localStorage.getItem('token');
      const verification = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: access
        })
      });
      const verificationData = await verification.json();
      if (!verificationData) {
        access = await refreshAccessToken();
        localStorage.setItem("token", access);
      }

      const response = await fetch(`http://127.0.0.1:8000/expenses/${id}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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



  const s = {
    page: { fontFamily: "'Inter', system-ui, sans-serif" },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" },
    subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '10px 18px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer', flexShrink: 0,
    },
    filterBar: {
      background: '#f8fafc', border: '1px solid #e2e8f0',
      borderRadius: '12px', padding: '16px',
      display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px',
    },
    searchWrap: { flex: 1, position: 'relative' },
    searchIcon: {
      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
      color: '#94a3b8', display: 'flex', alignItems: 'center', pointerEvents: 'none',
    },
    searchInput: {
      width: '100%', padding: '10px 14px 10px 38px',
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px',
      fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box',
    },
    select: {
      padding: '10px 14px', background: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: '8px', fontSize: '13px', color: '#64748b', outline: 'none',
      cursor: 'pointer', minWidth: '180px',
    },
    emptyCard: {
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px',
      padding: '80px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '10px',
    },
    emptyTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
    emptyText: { fontSize: '13px', color: '#94a3b8', margin: 0 },
    emptyBtn: {
      display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
    },
    expenseList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    expenseItem: {
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
      padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
    },
    itemLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
    itemIcon: (bg) => ({
      width: '28px', height: '28px', borderRadius: '6px',
      background: bg || '#f8fafc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }),
    itemInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
    itemTitle: { fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: 0 },
    itemSubtitle: { fontSize: '12px', color: '#64748b', margin: 0 },
    itemRight: { textAlign: 'right' },
    itemAmount: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 },
    itemDate: { fontSize: '11px', color: '#94a3b8', margin: 0, textTransform: 'uppercase' },
    actions: { display: 'flex', gap: '8px', marginLeft: '16px' },
    actionBtn: (color) => ({
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      background: '#f8fafc',
      color: color,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    }),
  };


  return (
    <div style={s.page}>
      <AddExpenseModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        categories={categories} 
        expenseToEdit={expenseToEdit}
        onRefresh={() => handleGetExpenses(filterCategoryId, debouncedSearchQuery)}


      />

      <div style={s.header}>
        <div>
          <h2 style={s.title}>Expenses</h2>
          <p style={s.subtitle}>Manage all your expenses</p>
        </div>
        <button style={s.addBtn} onClick={handleOpenAddModal}>
          <Plus size={16} /> Add Expense
        </button>
      </div>


      <div style={s.filterBar}>
        <div style={s.searchWrap}>
          <div style={s.searchIcon}><Search size={16} /></div>
          <input 
            style={s.searchInput} 
            placeholder="Search expenses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <CustomSelect
          variant="filter"
          placeholder="All Categories"
          value={filterCategoryId}
          onChange={setFilterCategoryId}
          options={categories.map(c => ({ value: c.id, label: c.name }))}
          style={{ width: '180px' }}
        />
      </div>

      {expenses.length > 0 ? (
        <div style={s.expenseList}>
          {expenses.map((expense) => (
              <div 
                style={{ display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ ...s.expenseItem, flex: 1 }}>
                  <div style={s.itemLeft}>
                    <div style={s.itemIcon(expense.category_color)} />
                    <div style={s.itemInfo}>
                      <p style={s.itemTitle}>{expense.description || "Dépense"}</p>
                      <p style={s.itemSubtitle}>{expense.category_name || "Catégorie inconnue"}</p>
                    </div>
                  </div>
                  <div style={s.itemRight}>
                    <p style={s.itemAmount}>-{expense.amount || "0.00"} €</p>
                    <p style={s.itemDate}>{expense.date}</p>
                  </div>
                </div>
                <div style={s.actions}>
                  <button 
                    style={s.actionBtn('#2563eb')} 
                    onClick={() => handleEdit(expense)}
                    onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    style={s.actionBtn('#ef4444')} 
                    onClick={() => handleDelete(expense.id)}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

          ))}
        </div>
      ) : (
        <div style={s.emptyCard}>
          <p style={s.emptyTitle}>{(filterCategoryId || debouncedSearchQuery) ? "No expenses found for this search" : "No expenses found"}</p>
          <p style={s.emptyText}>{(filterCategoryId || debouncedSearchQuery) ? "Try adjusting your search or category filter" : "Add your first expense to get started"}</p>
          {(filterCategoryId || debouncedSearchQuery) ? (
            <button style={s.emptyBtn} onClick={() => { setFilterCategoryId(""); setSearchQuery(""); }}>
              Clear All Filters
            </button>
          ) : (
            <button style={s.emptyBtn} onClick={handleOpenAddModal}>
              <Plus size={16} /> Add Expense
            </button>
          )}
        </div>

      )}

    </div>
  );
};

export default Expenses;
