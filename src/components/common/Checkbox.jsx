// Reusable checkbox component with two display modes.
//
// - inline variant: simple <input> + label, used in lists, forms, filter rows
// - row variant: bordered card with label + description on left, checkbox on right
//
// Auto-promotes to row variant when a `description` is supplied, so callers
// rarely need to pass `variant` explicitly.

const Checkbox = ({
  label,
  description,
  checked = false,
  onChange,
  name,
  disabled = false,
  readOnly = false,
  variant,
  className = "",
}) => {
  const handleChange = (e) => {
    if (disabled || readOnly) return;
    onChange?.(e.target.checked);
  };

  const useRowVariant = variant === "row" || (variant !== "inline" && description);

  if (useRowVariant) {
    return (  
      <label
        className={`flex items-center justify-between p-4 border border-slate-200 rounded-xl gap-4 transition-colors ${
          disabled || readOnly
            ? "opacity-60 cursor-not-allowed bg-slate-50"
            : "cursor-pointer hover:border-slate-300"
        } ${className}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled || readOnly}
          className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
        />
      </label>
    );
  }

  return (
    <label
      className={`inline-flex items-center gap-2.5 ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled || readOnly}
        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer disabled:cursor-not-allowed"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
};

export default Checkbox;