import React from 'react';

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
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
      <select
        className={`w-full rounded-lg bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 border border-slate-800 outline-none focus:border-amber-500/60 font-mono transition-all cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
