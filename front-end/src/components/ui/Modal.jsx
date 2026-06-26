import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const s = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    modal: {
      background: '#ffffff',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      animation: 'modalIn 0.2s ease-out',
    },
    header: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 24px 16px',
      borderBottom: '1px solid #f1f5f9',
    },
    title: {
      fontSize: '17px', fontWeight: '700', color: '#1e293b', margin: 0,
      fontFamily: "'Outfit', sans-serif",
    },
    closeBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '4px',
      borderRadius: '6px',
    },
    body: { padding: '20px 24px 24px' },
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.title}>{title}</h2>
          <button style={s.closeBtn} onClick={onClose}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <X size={18} />
          </button>
        </div>
        <div style={s.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
