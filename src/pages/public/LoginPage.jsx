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
import { Lock, Zap, Target, User, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';
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

  // Quick login buttons for testing (uses real API credentials)
  const quickLogins = [
    { label: 'Admin', email: 'admin@together.com', password: '12345678' },
    { label: 'provider', email: 'johnprovider@example.com', password: '12345678' },
    { label: 'participant', email: 'participant@example.com', password: '12345678' },
  ];

  const features = [
    {
      icon: <Lock className="w-8 h-8 text-purple-400" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security',
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Quick Access',
      description: 'Sign in once and stay connected across all your devices',
    },
    {
      icon: <Target className="w-8 h-8 text-pink-400" />,
      title: 'Personalized Experience',
      description: 'Get recommendations tailored to your specific needs',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo & Header */}
          <div>
            <Link to="/" className="inline-block mb-8">
              <img src="/uploads/logo.jpg" alt="The Better Together Logo" className="h-16 w-auto" />
            </Link>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-lg text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Quick Demo Logins */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-3">Quick Demo Login:</p>
            <div className="flex flex-wrap gap-2">
              {quickLogins.map((q) => (
                <button
                  key={q.email}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, email: q.email, password: q.password });
                  }}
                  className="text-[11px] px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors font-medium"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-purple-600 cursor-pointer hover:text-purple-700 transition-colors">
                  Forgot password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <InlineLoader className="text-white mr-2" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-purple-600 hover:text-purple-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse [animation-delay:2s]" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse [animation-delay:4s]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="mb-12">
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              Connect with Quality
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                NDIS Providers
              </span>
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              Access thousands of verified providers, manage your services, and take control of your NDIS journey.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2"
              >
                <div className="mr-4 flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">10k+</div>
              <div className="text-sm text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">1.5k+</div>
              <div className="text-sm text-gray-300">Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">98%</div>
              <div className="text-sm text-gray-300">Satisfaction</div>
            </div>
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-bold">Sarah Johnson</div>
                <div className="text-sm text-gray-300">NDIS Participant</div>
              </div>
            </div>
            <p className="text-gray-200 italic">
              &ldquo;The Better Together Network made finding the right provider so much easier. I found my perfect match
              within days!&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
