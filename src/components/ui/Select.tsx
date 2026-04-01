import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#3e3e3c] uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0070D2] focus:border-[#0070D2] transition ${
          error ? 'border-[#c23934]' : 'border-[#dddbda]'
        } ${className}`}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-[#c23934]">{error}</span>}
    </div>
  );
}
