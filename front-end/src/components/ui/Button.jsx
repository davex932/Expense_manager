import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon, 
  iconPosition = 'left',
  loading = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover shadow-sm',
    outline: 'bg-white border border-border text-text-main hover:bg-slate-50 shadow-sm',
    ghost: 'bg-transparent text-text-muted hover:bg-slate-100 hover:text-text-main',
    danger: 'bg-danger text-white hover:bg-red-600 shadow-sm',
  };
  
  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
};

export default Button;
