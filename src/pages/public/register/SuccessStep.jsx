import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const SuccessStep = ({ role, onGoToLogin }) => (
  <div className="text-center py-8">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-10 h-10 text-white" />
    </div>
    <h2 className="text-3xl font-bold text-slate-800 mb-3">
      Registration Successful!
    </h2>
    <p className="text-slate-500 max-w-md mx-auto mb-8">
      Your account has been created as a{" "}
      <span className="font-semibold capitalize text-slate-700">{role}</span>.
      You can now log in and start exploring the platform.
    </p>
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
