import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

const SuccessStep = ({ role, onGoToLogin }) => (
  <div className="text-center py-8">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
      <Clock className="w-10 h-10 text-white" />
    </div>
    <h2 className="text-3xl font-bold text-slate-800 mb-3">
      Registration Submitted!
    </h2>
    <p className="text-slate-500 max-w-md mx-auto mb-4">
      Your{" "}
      <span className="font-semibold capitalize text-slate-700">{role}</span>{" "}
      account has been created successfully.
    </p>
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto mb-8">
      <p className="text-sm text-amber-800 font-medium">
        Your account is pending admin approval. Once approved, you will be able
        to use all features on the platform.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        onClick={onGoToLogin}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
      >
        Go to Login <ArrowRight className="w-4 h-4" />
      </button>
      <Link
        to="/"
        className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default SuccessStep;
