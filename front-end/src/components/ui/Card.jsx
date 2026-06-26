import React from 'react';

const Card = ({ children, title, subtitle, className = '', headerAction }) => {
  return (
    <div className={`bg-white rounded-xl border border-border overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <div>
            {title && <h3 className="text-xl font-bold text-text-main font-heading">{title}</h3>}
            {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
