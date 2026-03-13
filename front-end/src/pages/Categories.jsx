import React, { useState } from 'react';
import { Plus, ShoppingBag, Truck, Monitor, Heart, Home, Coffee, MoreVertical } from 'lucide-react';
import Modal from '../components/ui/Modal';

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316',
];

const AddCategoryModal = ({ isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const s = {
    field: { marginBottom: '18px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '7px' },
    input: {
      width: '100%', padding: '10px 14px',
      background: '#f8fafc', border: '1.5px solid #e2e8f0',
      borderRadius: '8px', fontSize: '13px', color: '#1e293b',
      outline: 'none', boxSizing: 'border-box',
    },
    colorRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Category">
      <form onSubmit={e => { e.preventDefault(); onClose(); }}>
        <div style={s.field}>
          <label style={s.label}>Category Name *</label>
          <input
            style={s.input} type="text"
            placeholder="e.g., Food, Transport, Entertainment"
            onFocus={onF} onBlur={onB}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Color</label>
          <div style={s.colorRow}>
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: color, border: 'none', cursor: 'pointer',
                  outline: selectedColor === color ? `3px solid ${color}` : 'none',
                  outlineOffset: '2px',
                  transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        <div style={s.btnRow}>
          <button type="submit" style={s.submitBtn}>Add Category</button>
          <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

const categories = [
  { name: 'Food & Drinks',  icon: Coffee,      count: 42, total: '$1,240', budget: 75, iconBg: '#fff7ed', iconColor: '#f97316' },
  { name: 'Transport',      icon: Truck,        count: 28, total: '$450',   budget: 45, iconBg: '#eff6ff', iconColor: '#3b82f6' },
  { name: 'Entertainment',  icon: Monitor,      count: 12, total: '$320',   budget: 75, iconBg: '#faf5ff', iconColor: '#a855f7' },
  { name: 'Healthcare',     icon: Heart,        count: 5,  total: '$180',   budget: 30, iconBg: '#fff1f2', iconColor: '#f43f5e' },
  { name: 'Shopping',       icon: ShoppingBag,  count: 15, total: '$850',   budget: 55, iconBg: '#fdf4ff', iconColor: '#d946ef' },
  { name: 'Housing',        icon: Home,         count: 4,  total: '$2,400', budget: 70, iconBg: '#f0fdf4', iconColor: '#22c55e' },
];

const Categories = () => {
  const [showModal, setShowModal] = useState(false);

  const s = {
    page: { fontFamily: "'Inter', system-ui, sans-serif" },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" },
    subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer', flexShrink: 0,
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', cursor: 'pointer', transition: 'box-shadow 0.2s' },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    catInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
    iconBox: (bg, color) => ({ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }),
    catName: { fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' },
    catCount: { fontSize: '11px', color: '#94a3b8', margin: 0 },
    moreBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', alignItems: 'center' },
    cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    totalLabel: { fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px 0' },
    totalAmount: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 },
    progressWrap: { width: '80px', textAlign: 'right' },
    progressBg: { height: '4px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden', marginBottom: '4px' },
    progressFill: (pct) => ({ height: '100%', width: `${pct}%`, background: '#2563eb', borderRadius: '99px' }),
    progressLabel: { fontSize: '10px', color: '#94a3b8', margin: 0 },
    addCard: { border: '2px dashed #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: 'transparent', minHeight: '120px', transition: 'all 0.2s' },
    addIcon: { width: '32px', height: '32px', borderRadius: '50%', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' },
    addLabel: { fontSize: '13px', fontWeight: '600', color: '#94a3b8' },
  };

  return (
    <div style={s.page}>
      <AddCategoryModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div style={s.header}>
        <div>
          <h2 style={s.title}>Categories</h2>
          <p style={s.subtitle}>Manage your spending categories and budgets</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div style={s.grid}>
        {categories.map((cat, i) => (
          <div key={i} style={s.card}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={s.cardTop}>
              <div style={s.catInfo}>
                <div style={s.iconBox(cat.iconBg, cat.iconColor)}><cat.icon size={18} /></div>
                <div>
                  <p style={s.catName}>{cat.name}</p>
                  <p style={s.catCount}>{cat.count} transactions</p>
                </div>
              </div>
              <button style={s.moreBtn}><MoreVertical size={16} /></button>
            </div>
            <div style={s.cardBottom}>
              <div>
                <p style={s.totalLabel}>Total Spent</p>
                <p style={s.totalAmount}>{cat.total}</p>
              </div>
              <div style={s.progressWrap}>
                <div style={s.progressBg}><div style={s.progressFill(cat.budget)} /></div>
                <p style={s.progressLabel}>{cat.budget}% of budget</p>
              </div>
            </div>
          </div>
        ))}

        <button style={s.addCard}
          onClick={() => setShowModal(true)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <div style={s.addIcon}><Plus size={16} /></div>
          <span style={s.addLabel}>Add New Category</span>
        </button>
      </div>
    </div>
  );
};

export default Categories;
