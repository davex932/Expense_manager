import React from 'react';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';



  const styles = {
    page: {
      minHeight: '100vh',
      background: '#eef0f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    card: {
      width: '100%',
      maxWidth: '440px',
      background: '#ffffff',
      borderRadius: '20px',
      padding: '48px 44px',
      boxShadow: '0 8px 40px rgba(80, 100, 200, 0.10)',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '32px',
    },
    logoBox: {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(135deg, #5b7af9 0%, #2563eb 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.30)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 6px 0',
      fontFamily: "'Outfit', 'Inter', sans-serif",
    },
    subtitle: {
      fontSize: '13px',
      color: '#2563eb',
      margin: 0,
    },
    fieldLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#2563eb',
      marginBottom: '8px',
    },
    fieldWrapper: {
      position: 'relative',
      marginBottom: '16px',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '11px 14px 11px 40px',
      background: '#f1f3f9',
      border: '1.5px solid #f1f3f9',
      borderRadius: '10px',
      fontSize: '13px',
      color: '#1e293b',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s',
    },
    eyeBtn: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      padding: 0,
    },
    rememberRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      marginTop: '4px',
    },
    rememberLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: '#64748b',
      cursor: 'pointer',
    },
    forgotLink: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#2563eb',
      textDecoration: 'none',
    },
    signInBtn: {
      width: '100%',
      padding: '13px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      letterSpacing: '0.02em',
    },
    footer: {
      textAlign: 'center',
      marginTop: '28px',
      fontSize: '12px',
      color: '#64748b',
    },
    footerLink: {
      fontWeight: '700',
      color: '#2563eb',
      textDecoration: 'none',
    },
  };
const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState({
    username: '',
    password: '',
  })

  const handleChange= (e)=>{
    const {name, value} = e.target;
    setStatus({
      ...status,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
          const loginResponse = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: status.username,
            password: status.password
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log("Login Success:", loginData);
          localStorage.setItem('token', loginData.access);
          localStorage.setItem('refresh', loginData.refresh);
          navigate('/dashboard');
        } else {
          console.error("Login failed");
        }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleInputFocus = (e) => {
    e.target.style.background = '#ffffff';
    e.target.style.border = '1.5px solid rgba(37,99,235,0.35)';
    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
  };

  const handleInputBlur = (e) => {
    e.target.style.background = '#f1f3f9';
    e.target.style.border = '1.5px solid #f1f3f9';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Wallet size={26} color="#ffffff" />
          </div>
          <h1 style={styles.title}>Expense Manager</h1>
          <p style={styles.subtitle}>Sign in to manage your finances</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Username / Email */}
          <div style={styles.fieldWrapper}>
            <label style={styles.fieldLabel}>Username</label>
            <div style={{ position: 'relative' }}>
              <div style={styles.inputIcon}><Mail size={16} /></div>
              <input
                type="text"
                placeholder="Enter your username"
                style={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                name="username"
                value={status.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldWrapper}>
            <label style={styles.fieldLabel}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={styles.inputIcon}><Lock size={16} /></div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                style={{ ...styles.input, paddingRight: '40px' }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                name="password"
                value={status.password}
                onChange={handleChange}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div style={styles.rememberRow}>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                style={{ width: '14px', height: '14px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            style={styles.signInBtn}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.footerLink}>Create one now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login

