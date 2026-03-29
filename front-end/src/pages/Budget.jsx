import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, CheckCircle2, AlertTriangle, Pencil,
  AlertCircle, ChevronDown, Folder, TrendingDown, Wallet, X,
  Search, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Dropdown Component for designing options (General Purpose)
const CustomSelect = ({ value, onChange, options, variant = 'blue', icon: Icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ds = {
    wrapper: { position: 'relative', width: '100%' },
    trigger: {
      width: '100%', padding: '10px 14px', 
      background: variant === 'blue' ? '#eff6ff' : '#ffffff', 
      border: `1.5px solid ${isOpen ? (variant === 'blue' ? '#2563eb' : '#cbd5e1') : (variant === 'blue' ? '#bfdbfe' : '#e2e8f0')}`, 
      borderRadius: '12px', fontSize: '14px', color: '#1e293b', 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: 'pointer', boxSizing: 'border-box', transition: 'all 0.2s',
      minWidth: variant === 'header' ? '160px' : 'auto'
    },
    menu: {
      position: 'absolute', top: 'calc(100% + 8px)', right: 0, left: variant === 'header' ? 'auto' : 0,
      minWidth: '200px', width: variant === 'header' ? 'auto' : '100%',
      background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      zIndex: 1100, overflow: 'hidden', padding: '6px',
      maxHeight: '280px', overflowY: 'auto'
    },
    option: (isActive) => ({
      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
      borderRadius: '10px', cursor: 'pointer', background: isActive ? '#f1f5f9' : 'transparent',
      transition: 'background 0.15s'
    }),
    colorCircle: (color) => ({
      width: '10px', height: '10px', borderRadius: '50%', background: color || '#3b82f6'
    }),
    label: { fontSize: '13px', fontWeight: '600', color: '#1e293b' }
  };

  return (
    <div style={ds.wrapper} ref={dropdownRef}>
      <div style={ds.trigger} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {Icon && <Icon size={16} color={variant === 'blue' ? '#2563eb' : '#64748b'} />}
          {selectedOption ? (
            <>
              {selectedOption.color && <div style={ds.colorCircle(selectedOption.color)} />}
              <span style={ds.label}>{selectedOption.label || selectedOption.name}</span>
            </>
          ) : (
            <span style={{ ...ds.label, color: '#94a3b8' }}>{placeholder || 'Sélectionner'}</span>
          )}
        </div>
        <ChevronDown size={16} color={variant === 'blue' ? '#3b82f6' : '#94a3b8'} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div style={ds.menu}>
          {options.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Aucun élément</div>
          ) : (
            options.map(opt => (
              <div 
                key={opt.value || opt.id} 
                style={ds.option(String(value) === String(opt.value || opt.id))}
                onClick={() => { onChange(opt.value || opt.id); setIsOpen(false); }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => { if (String(value) !== String(opt.value || opt.id)) e.currentTarget.style.background = 'transparent'; else e.currentTarget.style.background = '#f1f5f9'; }}
              >
                {opt.color && <div style={ds.colorCircle(opt.color)} />}
                <span style={ds.label}>{opt.label || opt.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const DefineBudgetModal = ({ isOpen, onClose, selectedMonth, selectedYear, categories, onSave }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  if (!isOpen) return null;

  const ms = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "'Inter', system-ui, sans-serif",
    },
    modal: {
      background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '440px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden', padding: '24px',
    },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
    titleBox: { display: 'flex', alignItems: 'center', gap: '14px' },
    iconBox: { width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' },
    title: { fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 },
    subtitle: { fontSize: '13px', color: '#9ca3af', fontWeight: '500', marginTop: '1px' },
    closeBtn: { background: '#f9fafb', border: 'none', borderRadius: '10px', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' },

    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
    field: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' },
    input: { width: '100%', padding: '12px 14px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', color: '#111827', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
    
    btnRow: { display: 'flex', gap: '12px', marginTop: '12px' },
    cancelBtn: { flex: 1, padding: '12px', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: '#4b5563', cursor: 'pointer' },
    saveBtn: { flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  };

  const monthLabel = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ][selectedMonth - 1];

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        {/* Header */}
        <div style={ms.header}>
          <div style={ms.titleBox}>
            <div style={ms.iconBox}><Wallet size={20} /></div>
            <div>
              <h2 style={ms.title}>Définir un Budget</h2>
              <p style={ms.subtitle}>{monthLabel} {selectedYear}</p>
            </div>
          </div>
          <button style={ms.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Form */}
        <div style={ms.grid2}>
          <div style={ms.field}>
            <label style={ms.label}>Mois</label>
            <input style={ms.input} value={monthLabel} disabled />
          </div>
          <div style={ms.field}>
            <label style={ms.label}>Année</label>
            <input style={ms.input} value={selectedYear} disabled />
          </div>
        </div>

        <div style={ms.field}>
          <label style={ms.label}>Catégorie <span style={{ color: '#ef4444' }}>*</span></label>
          <CustomSelect 
            value={formData.category} 
            onChange={(val) => setFormData({ ...formData, category: val })}
            options={categories}
            placeholder="Sélectionner une catégorie"
          />
        </div>

        <div style={ms.field}>
          <label style={ms.label}>Montant du Budget <span style={{ color: '#ef4444' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              style={ms.input}
              type="number"
              placeholder="ex : 1500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>€</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={ms.btnRow}>
          <button style={ms.cancelBtn} onClick={onClose}>Annuler</button>
          <button style={ms.saveBtn} onClick={() => onSave(formData)}>
            <Plus size={18} />
            Enregistrer
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

  const s = {
    page: { fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: '40px' },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" },
    subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
    
    actions: { display: 'flex', alignItems: 'center', gap: '12px' },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
    },

    alert: { display: 'flex', gap: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px' },
    alertTitle: { fontSize: '14px', fontWeight: '700', color: '#b91c1c', margin: '0 0 2px 0' },
    alertText: { fontSize: '12px', color: '#ef4444', margin: 0 },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
    statCard: { background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statLabel: { fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' },
    statAmount: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0' },
    statSub: { fontSize: '12px', color: '#94a3b8', marginTop: '6px' },
    iconBox: (bg, color) => ({ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }),
    
    progressBg: { width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', marginTop: '12px', overflow: 'hidden' },
    progressFill: (w, c) => ({ width: `${w}%`, height: '100%', background: c, borderRadius: '100px', transition: 'width 0.4s ease' }),

    sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '18px' },
    
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
    catCard: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', transition: 'box-shadow 0.2s' },
    catHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', width: '100%' },
    catInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    catIcon: (c) => ({ width: '40px', height: '40px', borderRadius: '12px', background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    catName: { fontSize: '14px', fontWeight: '700', color: '#1e293b' },
    catEdit: { width: '30px', height: '30px', borderRadius: '8px', background: '#f8fafc', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    catAmounts: { display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '14px' },
    spentVal: { fontSize: '22px', fontWeight: '700', color: '#1e293b' },
    budgetVal: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
    catProgressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '6px' },
    footerText: (isOver) => ({ fontSize: '11px', fontWeight: '500', color: isOver ? '#ef4444' : '#64748b', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }),

    addCard: { 
      border: '2px dashed #e2e8f0', background: 'transparent', borderRadius: '16px', padding: '20px', minHeight: '180px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center'
    },
    addIconCircle: { width: '44px', height: '44px', borderRadius: '50%', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', margin: '0 auto 12px' }
  };

  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    try {
      const verification = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (!verification.ok) {
        const refresh = localStorage.getItem('refresh');
        if (refresh) {
          const refreshRes = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
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
        authFetch(`http://127.0.0.1:8000/budgets/?month=${selectedMonth}&year=${currentYear}`),
        authFetch("http://127.0.0.1:8000/categories/")
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

  const handleSaveBudget = async (formData) => {
    if (!formData.category || !formData.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await authFetch("http://127.0.0.1:8000/budgets/", {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          month: selectedMonth,
          year: currentYear,
          category: parseInt(formData.category)
        })
      });

      if (response.ok) {
        toast.success("Budget créé avec succès");
        setIsModalOpen(false);
        loadData(); 
      } else {
        const error = await response.json();
        toast.error(error.detail || "Erreur lors de la création du budget");
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Chargement du budget...</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      
      <DefineBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={currentYear}
        categories={categories}
        onSave={handleSaveBudget}
      />

      {/* Alert Banner */}
      {exceededCats.length > 0 && (
        <div style={s.alert}>
          <AlertTriangle size={16} color="#ef4444" style={{ marginTop: '2px' }} />
          <div>
            <p style={s.alertTitle}>Attention : Budget dépassé</p>
            <p style={s.alertText}>
              Vous avez dépassé votre budget pour {exceededCats.length} catégorie{exceededCats.length > 1 ? 's' : ''} ({exceededCats.map(b => b.category_name).join(', ')}).
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Planification Budgétaire</h1>
          <p style={s.subtitle}>Définissez vos limites de dépenses mensuelles par catégorie</p>
        </div>

        <div style={s.actions}>
          <CustomSelect 
            variant="header"
            icon={Calendar}
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={months.map(m => ({ ...m, label: `${m.label} ${currentYear}` }))}
          />

          <button style={s.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Créer un Budget
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div>
            <p style={s.statLabel}>Budget Total</p>
            <p style={s.statAmount}>{fmt(totalBudget)}</p>
            <p style={s.statSub}>{budgets.length} budgets configurés</p>
          </div>
          <div style={s.iconBox('#eff6ff', '#2563eb')}><Wallet size={22} /></div>
        </div>

        <div style={s.statCard}>
          <div>
            <p style={s.statLabel}>Dépenses Actuelles</p>
            <p style={s.statAmount}>{fmt(totalSpent)}</p>
            <div style={s.progressBg}>
              <div style={s.progressFill(Math.min((totalSpent / (totalBudget || 1)) * 100, 100), '#f97316')} />
            </div>
          </div>
          <div style={s.iconBox('#fff7ed', '#f97316')}><TrendingDown size={22} /></div>
        </div>

        <div style={s.statCard}>
          <div>
            <p style={s.statLabel}>Reste à Vivre</p>
            <p style={{ ...s.statAmount, color: isPositive ? '#10b981' : '#ef4444' }}>
              {isPositive ? '' : '-'}{fmt(Math.abs(remaining))}
            </p>
            <p style={{ ...s.statSub, color: isPositive ? '#10b981' : '#f87171' }}>
              {isPositive ? 'Vous êtes dans les limites 🎉' : 'Budget global dépassé'}
            </p>
          </div>
          <div style={s.iconBox(isPositive ? '#f0fdf4' : '#fef2f2', isPositive ? '#10b981' : '#ef4444')}>
            {isPositive ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <h2 style={s.sectionTitle}>Détails par Catégorie</h2>
      <div style={s.grid}>
        {budgets.map((bud) => {
          const pct = parseFloat(bud.percentage_used || 0);
          const isOver = pct > 100;
          const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f97316' : '#3b82f6';
          const budRemaining = parseFloat(bud.amount) - parseFloat(bud.expense_total);

          return (
            <div key={bud.id} style={s.catCard}>
              <div style={s.catHeader}>
                <div style={s.catInfo}>
                  <div style={s.catIcon(bud.category_color || '#3b82f6')}><Folder size={18} /></div>
                  <span style={s.catName}>{bud.category_name}</span>
                </div>
                <button style={s.catEdit}><Pencil size={12} /></button>
              </div>

              <div style={s.catAmounts}>
                <span style={s.spentVal}>{parseFloat(bud.expense_total || 0).toLocaleString('fr-FR')} €</span>
                <span style={s.budgetVal}>/ {parseFloat(bud.amount).toLocaleString('fr-FR')} €</span>
              </div>

              <div>
                <div style={{ ...s.catProgressLabel, color: barColor }}>
                  <span>{pct.toFixed(0)}%</span>
                  {isOver && <span>Dépassé !</span>}
                </div>
                <div style={s.progressBg}>
                  <div style={s.progressFill(Math.min(pct, 100), barColor)} />
                </div>
              </div>

              <div style={s.footerText(isOver)}>
                {isOver && <AlertCircle size={12} />}
                {isOver
                  ? `Dépassement de ${fmt(Math.abs(budRemaining))}`
                  : `Il vous reste ${fmt(budRemaining)} ce mois`}
              </div>
            </div>
          );
        })}

        <div style={s.addCard} onClick={() => setIsModalOpen(true)} onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
          <div style={s.addIconCircle}><Plus size={20} /></div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', margin: 0 }}>Ajouter un Budget</p>
        </div>
      </div>
    </div>
  );
};

export default Budget;