import { useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { selectIsPending, selectIsAdmin } from "../store/slices/authSlice";

/**
 * Returns { isPending, guardAction }.
 *
 * guardAction(fn) — wraps any callback. If user is pending, shows toast
 * and blocks the action. Otherwise runs fn().
 *
 * Usage:
 *   const { isPending, guardAction } = usePendingGuard();
 *   <button onClick={guardAction(() => navigate('/create'))} disabled={isPending}>
 */
const usePendingGuard = () => {
  const isPending = useSelector(selectIsPending);
  const isAdmin = useSelector(selectIsAdmin);

  // Admins are never blocked
  const blocked = isPending && !isAdmin;

  const guardAction = useCallback(
    (fn) => () => {
      if (blocked) {
        toast.warning(
          "Your account is pending approval. You cannot perform this action yet.",
        );
        return;
      }
      fn();
    },
    [blocked],
  );

  return { isPending: blocked, guardAction };
};

export default usePendingGuard;
