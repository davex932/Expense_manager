import React from 'react';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // GoogleLogin component returns a credential (ID token JWT) directly
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const response = await fetch(
        `http://127.0.0.1:8000/auth/google/?id_tokens=${idToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        toast.success('Connexion réussie avec Google !');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Échec de la connexion Google');
      }
    } catch (err) {
      console.error('Google Login Error:', err);
      toast.error('Erreur lors de la connexion Google');
    }
  };

  const handleGoogleError = () => {
    toast.error('Connexion Google échouée');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await fetch('http://127.0.0.1:8000/auth/jwt/create/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem('token', loginData.access);
        localStorage.setItem('refresh', loginData.refresh);
        toast.success('Connexion réussie !');
        navigate('/');
      } else {
        toast.error('Identifiants invalides');
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_40px_rgba(37,99,235,0.1)] relative z-10 transition-all duration-300">

        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
            <Wallet size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 font-display text-center">Expense Manager</h1>
          <p className="text-sm font-medium text-blue-600 text-center">Sign in to manage your finances</p>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center mb-8">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="360"
          />
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-medium tracking-wider">Or continue with</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-blue-600 mb-2">Username</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 focus:bg-white rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-blue-600 mb-2">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-3.5 pl-12 pr-12 bg-slate-50 border-2 border-slate-100 focus:bg-white rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20 transition-all cursor-pointer"
              />
              <span className="group-hover:text-slate-700 transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:opacity-95 transform hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
