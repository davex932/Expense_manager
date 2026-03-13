import React, { useState } from 'react';
import { DollarSign, TrendingUp, Receipt, Plus } from 'lucide-react';
import Modal from '../components/ui/Modal';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const today = new Date().toLocaleDateString('fr-FR');
  const fs = {
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#1e293b', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px', fontFamily: "'Inter', sans-serif" },
    btnRow: { display: 'flex', gap: '10px', marginTop: '20px' },
    submitBtn: { flex: 1, padding: '11px', background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    cancelBtn: { padding: '11px 20px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer' },
  };
  const onF = e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; };
  const onB = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <form onSubmit={e => { e.preventDefault(); onClose(); }}>
        <div style={fs.field}><label style={fs.label}>Amount *</label><input style={fs.input} type="number" step="0.01" placeholder="0.00" onFocus={onF} onBlur={onB} /></div>
        <div style={fs.field}><label style={fs.label}>Category *</label><select style={fs.input} onFocus={onF} onBlur={onB}><option value="">Select a category</option><option>Food &amp; Drinks</option><option>Transport</option><option>Entertainment</option><option>Healthcare</option><option>Shopping</option><option>Housing</option></select></div>
        <div style={fs.field}><label style={fs.label}>Date *</label><input style={fs.input} type="text" defaultValue={today} onFocus={onF} onBlur={onB} /></div>
        <div style={fs.field}><label style={fs.label}>Description</label><textarea style={fs.textarea} placeholder="Add a note about this expense..." onFocus={onF} onBlur={onB} /></div>
        <div style={fs.btnRow}><button type="submit" style={fs.submitBtn}>Add Expense</button><button type="button" style={fs.cancelBtn} onClick={onClose}>Cancel</button></div>
      </form>
    </Modal>
  );
};

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const s = {
    page: { fontFamily: "'Inter', system-ui, sans-serif" },

    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '28px',
    },
    title: {
      fontSize: '26px', fontWeight: '700', color: '#1e293b',
      margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif",
    },
    subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },

    addBtn: {
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '10px 18px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      flexShrink: 0,
    },

    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '24px',
    },
    statCard: {
      background: '#ffffff',
      borderRadius: '14px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statLabel: { fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' },
    statAmount: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
    statSub: { fontSize: '12px', color: '#94a3b8', margin: 0 },
    iconBox: (bg, color) => ({
      width: '44px', height: '44px', borderRadius: '12px',
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color, flexShrink: 0,
    }),

    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    card: {
      background: '#ffffff',
      borderRadius: '14px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '18px 24px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 },
    viewAllBtn: {
      fontSize: '13px', fontWeight: '600', color: '#2563eb',
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    },
    cardBody: {
      padding: '24px',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      gap: '6px',
    },
    emptyTitle: { fontSize: '14px', color: '#94a3b8', margin: 0 },
    emptyText: { fontSize: '12px', color: '#b0bad3', margin: 0 },
  };

  const stats = [
    { label: 'Total Expenses', amount: '$0.00', sub: 'All time', icon: DollarSign, iconBg: '#eff6ff', iconColor: '#2563eb' },
    { label: 'This Month',     amount: '$0.00', sub: 'Current month', icon: TrendingUp, iconBg: '#f0fdf4', iconColor: '#22c55e' },
    { label: 'Transactions',   amount: '0',     sub: 'Total records', icon: Receipt, iconBg: '#faf5ff', iconColor: '#a855f7' },
  ];

  return (
    <div style={s.page}>
      <AddExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Dashboard</h2>
          <p style={s.subtitle}>Overview of your expenses</p>
        </div>
        <button style={s.addBtn}
          onClick={() => setShowModal(true)}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} style={s.statCard}>
            <div>
              <p style={s.statLabel}>{stat.label}</p>
              <p style={s.statAmount}>{stat.amount}</p>
              <p style={s.statSub}>{stat.sub}</p>
            </div>
            <div style={s.iconBox(stat.iconBg, stat.iconColor)}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Content cards */}
      <div style={s.contentGrid}>
        {/* Expenses by Category */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>Expenses by Category</h3>
          </div>
          <div style={s.cardBody}>
            <p style={s.emptyTitle}>No expense data available</p>
            <p style={s.emptyText}>Add your first expense to see the chart</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>Recent Transactions</h3>
            <button style={s.viewAllBtn}>View All</button>
          </div>
          <div style={s.cardBody}>
            <p style={s.emptyTitle}>No transactions yet</p>
            <p style={s.emptyText}>Start adding your expenses to see them here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
