import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Modal from '../components/ui/Modal';

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316',
];

const AddExpenseModal = ({ isOpen, onClose }) => {
  const today = new Date().toLocaleDateString('fr-FR');

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <form onSubmit={e => { e.preventDefault(); onClose(); }}>
        <div style={s.field}>
          <label style={s.label}>Amount *</label>
          <input style={s.input} type="number" step="0.01" placeholder="0.00" onFocus={onF} onBlur={onB} />
        </div>

        <div style={s.field}>
          <label style={s.label}>Category *</label>
          <select style={s.input} onFocus={onF} onBlur={onB}>
            <option value="">Select a category</option>
            <option>Food &amp; Drinks</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Healthcare</option>
            <option>Shopping</option>
            <option>Housing</option>
          </select>
        </div>

        <div style={s.field}>
          <label style={s.label}>Date *</label>
          <input style={s.input} type="text" defaultValue={today} onFocus={onF} onBlur={onB} />
        </div>

        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea style={s.textarea} placeholder="Add a note about this expense..." onFocus={onF} onBlur={onB} />
        </div>

        <div style={s.btnRow}>
          <button type="submit" style={s.submitBtn}>Add Expense</button>
          <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);

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
  };

  return (
    <div style={s.page}>
      <AddExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div style={s.header}>
        <div>
          <h2 style={s.title}>Expenses</h2>
          <p style={s.subtitle}>Manage all your expenses</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div style={s.filterBar}>
        <div style={s.searchWrap}>
          <div style={s.searchIcon}><Search size={16} /></div>
          <input style={s.searchInput} placeholder="Search expenses..." />
        </div>
        <select style={s.select}>
          <option>All Categories</option>
          <option>Food &amp; Drinks</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Healthcare</option>
        </select>
      </div>

      <div style={s.emptyCard}>
        <p style={s.emptyTitle}>No expenses found</p>
        <p style={s.emptyText}>Add your first expense to get started</p>
        <button style={s.emptyBtn} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Expense
        </button>
      </div>
    </div>
  );
};

export default Expenses;
