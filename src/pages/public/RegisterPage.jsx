import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  FileText,
  Eye,
  EyeOff,
} from 'lucide-react';
import { InlineLoader } from '../../components/common/Loader';

// ─── Step definitions ──────────────────────────────────────────
const STEPS = {
  1: 'Select Role',
  2: 'Personal Details',
  3: 'Role Details',
  4: 'Complete',
};

// ─── NDIS service categories ────────────────────────────────────
const SERVICE_CATEGORIES = [
  'Assistance with Daily Life',
  'Transport',
  'Consumables',
  'Assistive Technology',
  'Home Modifications',
  'Coordination of Supports',
  'Improved Living Arrangements',
  'Social & Community Participation',
  'Employment Support',
  'Therapeutic Supports',
  'Early Childhood Supports',
  'Behaviour Support',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ─── Form state ──────────────────────────────────────────────
  const [role, setRole] = useState(''); // 'provider' | 'participant'
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Shared fields
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',

    // Provider fields
    organisationName: '',
    abn: '',
    ndisRegistered: false,
    serviceCategories: [],
    description: '',
    website: '',

    // Participant fields
    ndisNumber: '',
    planStartDate: '',
    planEndDate: '',
    supportCoordinator: '',
    primaryDisability: '',
    goals: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleServiceCategory = (cat) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(cat)
        ? prev.serviceCategories.filter((c) => c !== cat)
        : [...prev.serviceCategories, cat],
    }));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!role) newErrors.role = 'Please select a role';
    }

    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (step === 3 && role === 'provider') {
      if (!formData.organisationName.trim()) newErrors.organisationName = 'Organisation name is required';
      if (formData.serviceCategories.length === 0) newErrors.serviceCategories = 'Select at least one service';
    }

    if (step === 3 && role === 'participant') {
      // Participant step 3 fields are optional for now
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  // ─── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);

    // Build the payload that will go to the API
    const payload = {
      role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      location: formData.location,
      ...(role === 'provider'
        ? {
            organisationName: formData.organisationName,
            abn: formData.abn,
            ndisRegistered: formData.ndisRegistered,
            serviceCategories: formData.serviceCategories,
            description: formData.description,
            website: formData.website,
          }
        : {
            ndisNumber: formData.ndisNumber,
            planStartDate: formData.planStartDate,
            planEndDate: formData.planEndDate,
            supportCoordinator: formData.supportCoordinator,
            primaryDisability: formData.primaryDisability,
            goals: formData.goals,
          }),
    };

    // Simulate API call
    console.log('Registration payload:', payload);
    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);
    setCurrentStep(4);
  };

  // ─── Input component ─────────────────────────────────────────
  const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, required }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
            errors[name] ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
          }`}
        />
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // Step 1: Role Selection
  // ═══════════════════════════════════════════════════════════════
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Join The Better Together Network</h2>
        <p className="text-slate-500 mt-2">How would you like to use the platform?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Provider Card */}
        <button
          onClick={() => { setRole('provider'); setErrors({}); }}
          className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg group ${
            role === 'provider'
              ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-200'
              : 'border-slate-200 hover:border-purple-300 bg-white'
          }`}
        >
          {role === 'provider' && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          )}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Register as a Provider</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            List your services, connect with participants, grow your NDIS business, and access professional development tools.
          </p>
          <ul className="mt-4 space-y-2">
            {['Business directory listing', 'Service request management', 'Events & networking', 'Marketing tools'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </button>

        {/* Participant Card */}
        <button
          onClick={() => { setRole('participant'); setErrors({}); }}
          className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg group ${
            role === 'participant'
              ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
              : 'border-slate-200 hover:border-blue-300 bg-white'
          }`}
        >
          {role === 'participant' && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Register as a Participant</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Find quality NDIS providers, access community resources, manage your plan, and connect with other participants.
          </p>
          <ul className="mt-4 space-y-2">
            {['Find & connect with providers', 'Learning hub & resources', 'Community message board', 'Plan buddy support'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </button>
      </div>
      {errors.role && <p className="text-sm text-red-500 text-center">{errors.role}</p>}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // Step 2: Personal Details
  // ═══════════════════════════════════════════════════════════════
  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Personal Details</h2>
        <p className="text-slate-500 mt-1">Tell us about yourself</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField label="First Name" name="firstName" icon={User} placeholder="John" required />
        <InputField label="Last Name" name="lastName" icon={User} placeholder="Doe" required />
      </div>

      <InputField label="Email Address" name="email" type="email" icon={Mail} placeholder="you@example.com" required />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                errors.password ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-slate-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField label="Phone Number" name="phone" type="tel" icon={Phone} placeholder="04XX XXX XXX" required />
        <InputField label="Location" name="location" icon={MapPin} placeholder="e.g. Melbourne, VIC" required />
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // Step 3: Role-specific Details
  // ═══════════════════════════════════════════════════════════════
  const renderStep3Provider = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Provider Details</h2>
        <p className="text-slate-500 mt-1">Tell us about your organisation</p>
      </div>

      <InputField label="Organisation Name" name="organisationName" icon={Building2} placeholder="Your company name" required />

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField label="ABN" name="abn" placeholder="XX XXX XXX XXX" />
        <InputField label="Website" name="website" type="url" placeholder="https://yoursite.com.au" />
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <input
          type="checkbox"
          id="ndisRegistered"
          name="ndisRegistered"
          checked={formData.ndisRegistered}
          onChange={handleChange}
          className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
        />
        <label htmlFor="ndisRegistered" className="text-sm text-slate-700">
          I am a registered NDIS provider
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Service Categories <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleServiceCategory(cat)}
              className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                formData.serviceCategories.includes(cat)
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-slate-200 text-slate-600 hover:border-purple-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.serviceCategories && <p className="text-xs text-red-500 mt-1">{errors.serviceCategories}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          About Your Services
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Brief description of the services you provide..."
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderStep3Participant = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Participant Details</h2>
        <p className="text-slate-500 mt-1">Help us personalise your experience (all fields optional)</p>
      </div>

      <InputField label="NDIS Number" name="ndisNumber" icon={FileText} placeholder="XXX XXX XXXX" />

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField label="Plan Start Date" name="planStartDate" type="date" />
        <InputField label="Plan End Date" name="planEndDate" type="date" />
      </div>

      <InputField label="Support Coordinator Name" name="supportCoordinator" icon={User} placeholder="Your coordinator's name" />
      <InputField label="Primary Disability" name="primaryDisability" placeholder="e.g. Intellectual, Physical, Psychosocial" />

      <div>
        <label htmlFor="goals" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Your NDIS Goals
        </label>
        <textarea
          id="goals"
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          rows={3}
          placeholder="What are you hoping to achieve with your NDIS plan?"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
        />
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // Step 4: Success
  // ═══════════════════════════════════════════════════════════════
  const renderStep4 = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-3">Registration Successful!</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        Your account has been created as a <span className="font-semibold capitalize text-slate-700">{role}</span>.
        You can now log in and start exploring the platform.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
        >
          Go to Login <ArrowRight className="w-4 h-4" />
        </button>
        <Link to="/" className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/uploads/logo.jpg" alt="Logo" className="h-14 mx-auto" />
          </Link>
        </div>

        {/* Progress Steps */}
        {currentStep < 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step < currentStep
                      ? 'bg-purple-600 text-white'
                      : step === currentStep
                        ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 sm:w-20 h-1 rounded-full ${step < currentStep ? 'bg-purple-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Labels */}
        {currentStep < 4 && (
          <p className="text-center text-sm text-slate-500 mb-6">
            Step {currentStep} of 3 — <span className="font-medium text-slate-700">{STEPS[currentStep]}</span>
          </p>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && (role === 'provider' ? renderStep3Provider() : renderStep3Participant())}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <InlineLoader className="text-white" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login Link */}
        {currentStep < 4 && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
