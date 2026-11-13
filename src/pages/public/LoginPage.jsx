import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../store/actions/authActions';
import {
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
  selectUser,
  clearError,
} from '../../store/slices/authSlice';
import { ASYNC_STATUS } from '../../constants';
import { Lock, Target, Users, ShieldCheck, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';
import { NAVY, LIME, PURPLE } from '../../components/public/ui';
import { InlineLoader } from '../../components/common/Loader';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);
  const loading = status === ASYNC_STATUS.LOADING;
  const error = useSelector(selectAuthError);
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = {
        admin: '/admin',
        provider: '/provider',
        participant: '/participant',
      };
      navigate(redirectMap[user.role] || '/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

 

  const features = [
    { icon: ShieldCheck, title: 'Secure & private', description: 'Your details stay private. You choose who to contact, and when.' },
    { icon: Users, title: 'One community', description: 'Participants, families and providers — connected locally.' },
    { icon: Target, title: 'Made for you', description: 'Dashboards and tools tailored to your role and goals.' },
  ];

  const inputCls =
    'block w-full rounded-xl border border-slate-200 bg-white py-3.5 text-[15px] text-slate-800 placeholder:text-slate-400 transition focus:border-[#1F6FD8] focus:outline-none focus:ring-4 focus:ring-[#1F6FD8]/10';

  return (
    <div className="btn-site flex min-h-screen bg-white">
      {/* Left — form */}
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-8 lg:px-16 xl:px-24">
        <Link to="/" className="inline-block self-start">
          <img src="/uploads/logo.png" alt="The Better Together Network" className="h-14 w-auto" />
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: PURPLE }}>
            Welcome back
          </p>
          <h1 className="text-3xl font-extrabold md:text-4xl" style={{ color: NAVY }}>Sign in to your account</h1>
          <p className="mt-3 text-[15px] text-slate-500">Good to see you again. Pick up right where you left off.</p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold" style={{ color: NAVY }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`${inputCls} pl-12 pr-4`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: NAVY }}>
                  Password
                </label>
                <span className="cursor-pointer text-sm font-semibold transition hover:opacity-80" style={{ color: PURPLE }}>
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className={`${inputCls} pl-12 pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-full py-3.5 text-[15px] font-bold text-white shadow-sm transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: NAVY }}
            >
              {loading ? (
                <>
                  <InlineLoader className="mr-2 text-white" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold" style={{ color: NAVY }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Right — showcase */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[46%]" style={{ background: NAVY }}>
        <img
          src="/uploads/web/hero-leadership.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2352] via-[#0E2352]/70 to-[#14306B]/40" />
        <div className="h-1 absolute inset-x-0 top-0 bg-gradient-to-r from-[#2D3FD8] via-[#D6267E] to-[#7BC043]" />

        <div className="relative z-10 mt-auto flex flex-col p-12 text-white xl:p-16">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: LIME }}>
            The Better Together Network
          </p>
          <h2 className="text-4xl font-extrabold leading-tight xl:text-[44px]">
            Connect with quality NDIS providers
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-blue-100/90">
            Find trusted local services, manage your plan and take control of your NDIS journey —
            led by people with lived experience.
          </p>

          <div className="mt-10 space-y-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 backdrop-blur">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: LIME }}>
                  <Icon className="h-5 w-5" style={{ color: NAVY }} />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-0.5 text-sm text-blue-100/80">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
