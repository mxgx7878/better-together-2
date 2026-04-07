import ButtonLoader from './ButtonLoader';

const variants = {
  primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg',
  secondary: 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
  ghost: 'text-slate-600 hover:bg-slate-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <ButtonLoader size={size === 'sm' ? 12 : 16} />}
      {children}
    </button>
  );
};

export default Button;
