import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'cyan' | 'emerald' | 'error' | 'outline' | 'yellow' | 'pink';
  className?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'sm',
  dot = false,
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  const variantClasses = {
    default: 'bg-slate-900 border border-slate-800 text-slate-300',
    primary: 'border border-amber-500/30 text-amber-400 bg-amber-500/10 font-bold',
    cyan: 'border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 font-bold',
    emerald: 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold',
    error: 'border border-rose-500/30 text-rose-300 bg-rose-500/10 font-bold',
    outline: 'border border-slate-700 text-slate-400 bg-transparent',
    yellow: 'border border-amber-400/30 text-amber-300 bg-amber-500/10',
    pink: 'border border-pink-500/30 text-pink-400 bg-pink-500/10',
  };

  return (
    <span
      className={`font-mono uppercase tracking-wider inline-flex items-center space-x-1.5 rounded-full backdrop-blur-sm select-none ${sizeClass} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      <span>{children}</span>
    </span>
  );
};
