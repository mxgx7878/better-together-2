// Reusable password field with a show/hide toggle.
// Supports an externally-controlled visibility state (so "Password" and
// "Confirm Password" can share the same eye toggle) or manages it internally.

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  label,
  name,
  placeholder = "••••••••",
  required = false,
  value,
  onChange,
  error,
  visible,
  onToggleVisible,
  className = "",
}) => {
  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = typeof visible === "boolean";
  const show = isControlled ? visible : internalVisible;

  const handleToggle = () => {
    if (isControlled) {
      onToggleVisible?.(!show);
    } else {
      setInternalVisible((v) => !v);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type={show ? "text" : "password"}
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
            error ? "border-red-300 bg-red-50/50" : "border-slate-200"
          }`}
        />
        <button
          type="button"
          onClick={handleToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          tabIndex={-1}
        >
          {show ? (
            <Eye className="w-4 h-4 text-slate-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PasswordField;
