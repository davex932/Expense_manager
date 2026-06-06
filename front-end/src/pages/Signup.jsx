import React from 'react';
import { Wallet, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 48%, #f5f3ff 100%)',
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
    borderRadius: '26px',
    padding: '44px 44px 40px',
    boxShadow: '0 28px 80px rgba(37, 99, 235, 0.16), 0 8px 30px rgba(15, 23, 42, 0.06)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  logoBox: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #5b7af9 0%, #2563eb 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.28)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  fieldWrapper: {
    marginBottom: '16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '8px',
  },
  inputWrap: {
    position: 'relative',
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
    padding: '12px 14px 12px 40px',
    background: '#f1f3f9',
    border: '1.5px solid #f1f3f9',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#0f172a',
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
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #7c3aed 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.02em',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '12px',
    color: '#64748b',
  },
  footerLink: {
    fontWeight: '800',
    color: '#2563eb',
    textDecoration: 'none',
  },
};

const onFocus = (e) => {
  e.target.style.background = '#ffffff';
  e.target.style.border = '1.5px solid rgba(37,99,235,0.35)';
  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
};

const onBlur = (e) => {
  e.target.style.background = '#f1f3f9';
  e.target.style.border = '1.5px solid #f1f3f9';
  e.target.style.boxShadow = 'none';
};

const Field = ({ label, name, icon, type = 'text', placeholder, showToggle, show, onToggle, onChange, value }) => {
  const Icon = icon;

  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.inputWrap}>
        <div style={styles.inputIcon}><Icon size={16} /></div>
        <input
          name={name}
          type={showToggle ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          style={{ ...styles.input, paddingRight: showToggle ? '40px' : '14px' }}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
        />
        {showToggle && (
          <button type="button" style={styles.eyeBtn} onClick={onToggle}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [status, setStatus] = React.useState({
    username: '',
    email: '',
    password: '',
    re_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus({
      ...status,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerResponse = await fetch("http://127.0.0.1:8000/auth/users/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });

      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        console.log("Registration Success:", registerData);

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
          console.error("Login failed after registration");
        }
      } else {
        const errorData = await registerResponse.json();
        console.error("Registration failed:", errorData);
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
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
          <p style={styles.subtitle}>Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Field label="Username" name="username" icon={User} placeholder="Choose a username" onChange={handleChange} value={status.username} />
          <Field label="Email Address" name="email" icon={Mail} type="email" placeholder="Enter your email" onChange={handleChange} value={status.email} />
          <Field
            label="Password" name="password" icon={Lock} placeholder="Create a password"
            showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)}
            onChange={handleChange} value={status.password}
          />
          <Field
            label="Confirm Password" name="re_password" icon={Lock} placeholder="Confirm your password"
            showToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
            onChange={handleChange} value={status.re_password}
          />

          <button
            type="submit"
            style={styles.submitBtn}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

