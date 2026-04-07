const colorMap = {
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-700',
};

const Badge = ({ children, color = 'purple', className = '' }) => {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
