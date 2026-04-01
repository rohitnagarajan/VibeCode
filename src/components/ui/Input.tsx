import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#3e3e3c] uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0070D2] focus:border-[#0070D2] transition ${
          error ? 'border-[#c23934]' : 'border-[#dddbda]'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#c23934]">{error}</span>}
    </div>
  );
}
