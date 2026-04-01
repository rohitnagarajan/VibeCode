import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>}
      <input
        className={`bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
        {...props}
      />
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>}
      <textarea
        className={`bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>}
      <select
        className={`bg-[#1a1f2e] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className}`}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
