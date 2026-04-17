import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectIsPending, selectIsAdmin } from "../../store/slices/authSlice";

/**
 * Drop-in replacement for <button> that blocks clicks when user is pending.
 * All props are forwarded to the underlying <button>.
 *
 * Usage: <PendingGuardButton onClick={handleSave} className="...">Save</PendingGuardButton>
 */
const PendingGuardButton = ({ onClick, disabled, children, ...rest }) => {
  const isPending = useSelector(selectIsPending);
  const isAdmin = useSelector(selectIsAdmin);
  const blocked = isPending && !isAdmin;

  const handleClick = (e) => {
    if (blocked) {
      e.preventDefault();
      toast.warning(
        "Your account is pending approval. You cannot perform this action yet.",
      );
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      onClick={handleClick}
      disabled={disabled || blocked}
      className={`${rest.className || ""} ${blocked ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default PendingGuardButton;
