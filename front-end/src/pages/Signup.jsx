import React from 'react';
import { Wallet, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { API_URL } from '../api';

const Field = ({ label, name, icon: Icon, type = 'text', placeholder, showToggle, show, onToggle, onChange, value }) => (
  <div>
    <label className="block text-sm font-semibold text-blue-600 mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
        <Icon size={18} />
      </div>
      <input
        name={name}
        type={showToggle ? (show ? 'text' : 'password') : type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={`w-full py-3.5 pl-12 bg-slate-50 border-2 border-slate-100 focus:bg-white rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 ${showToggle ? 'pr-12' : 'pr-4'}`}
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
          onClick={onToggle}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  </div>
);

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

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const response = await fetch(`${API_URL}/auth/google/?id_tokens=${tokenResponse.access_token}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        toast.success('Compte créé et connecté via Google !');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Échec de la connexion Google');
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error('Erreur lors de la connexion Google');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Connexion Google échouée'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerResponse = await fetch(`${API_URL}/auth/users/`, {
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

        const loginResponse = await fetch(`${API_URL}/auth/jwt/create/`, {
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
          localStorage.setItem('token', loginData.access);
          localStorage.setItem('refresh', loginData.refresh);
          toast.success('Compte créé avec succès !');
          navigate('/');
        } else {
          toast.error("Erreur de connexion après inscription");
        }
      } else {
        const errorData = await registerResponse.json();
        // Affiche le premier message d'erreur retourné par l'API
        const firstKey = Object.keys(errorData)[0];
        const firstError = errorData[firstKey];
        const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
        toast.error(`${firstKey}: ${message}`);
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_40px_rgba(37,99,235,0.1)] relative z-10 transition-all duration-300">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
            <Wallet size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 font-display text-center">Expense Manager</h1>
          <p className="text-sm font-medium text-blue-600 text-center">Create your account to get started</p>
        </div>

        {/* Social Login */}
        <button
          onClick={() => googleLogin()}
          type="button"
          className="w-full py-3.5 flex items-center justify-center gap-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500/20 transition-all mb-8 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-medium tracking-wider">Or continue with</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:opacity-95 transform hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;



