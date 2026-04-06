const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
