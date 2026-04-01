type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'xs' | 'sm' | 'md';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const V: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-600',
  secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  ghost: 'bg-transparent hover:bg-white/10 text-white/70 hover:text-white border border-transparent',
  danger: 'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-600',
};
const S: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-md font-medium cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${V[variant]} ${S[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
