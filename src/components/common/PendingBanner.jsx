import { useSelector } from "react-redux";
import { selectIsPending, selectIsAdmin } from "../../store/slices/authSlice";

const PendingBanner = () => {
  const isPending = useSelector(selectIsPending);
  const isAdmin = useSelector(selectIsAdmin);

  if (!isPending || isAdmin) return null;

  return (
    <div className="bg-amber-500 text-white overflow-hidden relative z-50">
      <div className="animate-marquee whitespace-nowrap py-2 text-sm font-medium">
        <span className="mx-8">
          Your account is pending admin approval. You can browse the platform but
          cannot create, edit, or delete anything until your account is approved.
        </span>
        <span className="mx-8">
          Your account is pending admin approval. You can browse the platform but
          cannot create, edit, or delete anything until your account is approved.
        </span>
        <span className="mx-8">
          Your account is pending admin approval. You can browse the platform but
          cannot create, edit, or delete anything until your account is approved.
        </span>
      </div>
    </div>
  );
};

export default PendingBanner;
