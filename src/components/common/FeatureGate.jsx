import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsPaid } from '../../store/slices/authSlice';
import { Lock, ArrowRight } from 'lucide-react';

// Wraps content that requires a paid subscription
const FeatureGate = ({ children, fallback }) => {
  const isPaid = useSelector(selectIsPaid);

  if (isPaid) return children;

  if (fallback) return fallback;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Premium Feature</h2>
      <p className="text-slate-500 max-w-md mb-6">
        This feature is available on paid plans. Upgrade to unlock full access
        to all tools and features.
      </p>
      <Link
        to="/dashboard/upgrade"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
      >
        Upgrade Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default FeatureGate;
