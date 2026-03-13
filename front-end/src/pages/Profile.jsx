import React from 'react';
import { User, Lock } from 'lucide-react';

const Profile = () => {
  const s = {
    page: { fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '680px' },
    header: { marginBottom: '28px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" },
    subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
    card: {
      background: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: '14px', padding: '28px', marginBottom: '20px',
    },
    cardHeaderRow: {
      display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px',
    },
    iconBox: (bg, color) => ({
      width: '44px', height: '44px', borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color, flexShrink: 0,
    }),
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' },
    cardSub: { fontSize: '12px', color: '#64748b', margin: 0 },
    fieldLabel: {
      display: 'block', fontSize: '13px', fontWeight: '500',
      color: '#475569', marginBottom: '6px',
    },
    input: {
      width: '100%', padding: '11px 14px',
      background: '#f1f3f9', border: '1.5px solid #f1f3f9',
      borderRadius: '10px', fontSize: '13px', color: '#1e293b',
      outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
    },
    btnPrimary: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '10px 20px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
    btnSecondary: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '10px 20px',
      background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
  };

  const onFocus = e => { e.target.style.background = '#fff'; e.target.style.border = '1.5px solid rgba(37,99,235,0.35)'; };
  const onBlur  = e => { e.target.style.background = '#f1f3f9'; e.target.style.border = '1.5px solid #f1f3f9'; };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Profile Settings</h2>
        <p style={s.subtitle}>Manage your account information</p>
      </div>

      {/* Profile Information */}
      <div style={s.card}>
        <div style={s.cardHeaderRow}>
          <div style={s.iconBox('#eff6ff', '#2563eb')}><User size={20} /></div>
          <div>
            <p style={s.cardTitle}>Profile Information</p>
            <p style={s.cardSub}>Update your account details</p>
          </div>
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <label style={s.fieldLabel}>Username</label>
          <input style={s.input} defaultValue="davex932" onFocus={onFocus} onBlur={onBlur} />
          <label style={s.fieldLabel}>Email</label>
          <input style={s.input} defaultValue="davex932@example.com" onFocus={onFocus} onBlur={onBlur} />
          <button type="submit" style={s.btnPrimary}>Update Profile</button>
        </form>
      </div>

      {/* Change Password */}
      <div style={s.card}>
        <div style={s.cardHeaderRow}>
          <div style={s.iconBox('#faf5ff', '#9333ea')}><Lock size={20} /></div>
          <div>
            <p style={s.cardTitle}>Change Password</p>
            <p style={s.cardSub}>Update your password to keep your account secure</p>
          </div>
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <label style={s.fieldLabel}>Current Password</label>
          <input type="password" style={s.input} onFocus={onFocus} onBlur={onBlur} />
          <label style={s.fieldLabel}>New Password</label>
          <input type="password" style={s.input} onFocus={onFocus} onBlur={onBlur} />
          <label style={s.fieldLabel}>Confirm New Password</label>
          <input type="password" style={s.input} onFocus={onFocus} onBlur={onBlur} />
          <button type="submit" style={s.btnSecondary}>Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
