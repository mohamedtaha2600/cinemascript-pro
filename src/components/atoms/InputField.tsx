import React from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 border border-slate-800 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono ${
          error ? 'border-rose-500/60' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-mono text-rose-400 mt-1">{error}</p>}
    </div>
  );
};
