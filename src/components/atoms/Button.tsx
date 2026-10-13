import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-mono text-xs uppercase tracking-wider transition-all duration-200 inline-flex items-center justify-center space-x-2 cursor-pointer border rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-95';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-xs font-semibold',
    lg: 'px-6 py-3 text-sm font-extrabold',
  };

  const variantStyles = {
    primary:
      'bg-amber-500 border-amber-500 text-black font-bold hover:bg-amber-400 hover:border-amber-400 shadow-md shadow-amber-500/20',
    secondary:
      'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700 hover:text-white',
    outline:
      'bg-transparent border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-white hover:bg-amber-500/5',
    ghost:
      'bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-100',
    danger:
      'bg-rose-600 border-rose-600 text-white font-bold hover:bg-rose-500 shadow-md shadow-rose-600/20',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
