import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-main mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full bg-[#f1f3f5] border-transparent rounded-lg py-2.5 px-3 
            placeholder:text-text-light text-text-main transition-all
            focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10
            ${Icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-danger/50 focus:border-danger focus:ring-danger/10' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
};

export default Input;
