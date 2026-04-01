import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-[#0070D2] text-white hover:bg-[#005fb2] border border-[#0070D2]',
  secondary: 'bg-white text-[#0070D2] hover:bg-[#f4f6f9] border border-[#dddbda]',
  danger: 'bg-white text-[#c23934] hover:bg-[#fef0ef] border border-[#dddbda]',
  ghost: 'bg-transparent text-[#0070D2] hover:bg-[#f4f6f9] border border-transparent',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
