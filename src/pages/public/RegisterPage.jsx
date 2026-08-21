import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

import { InlineLoader } from "../../components/common/Loader";
import { fetchPublicCategories } from "../../store/actions/categoryActions";
import { ASYNC_STATUS } from "../../constants";

import useRegisterForm from "./register/useRegisterForm";
import StepIndicator from "./register/StepIndicator";
import RoleSelectStep from "./register/RoleSelectStep";
import PersonalDetailsStep from "./register/PersonalDetailsStep";
import ProviderDetailsStep from "./register/ProviderDetailsStep";
import SuccessStep from "./register/SuccessStep";

const STEP_LABELS = {
  1: "Select Role",
  2: "Personal Details",
  3: "Role Details",
  4: "Complete",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { publicCategories, status: categoryStatus } = useSelector(
    (state) => state.category,
  );
  const categoriesLoading = categoryStatus === ASYNC_STATUS.LOADING;

  const {
    role,
    selectRole,
    formData,
    errors,
    showPassword,
    setShowPassword,
    submitting,
    handleChange,
    toggleServiceCategory,
    validateStep,
    submit,
  } = useRegisterForm();

  const [currentStep, setCurrentStep] = useState(1);

  // Participants only have 2 form steps (role, personal). Providers have 3.
  const totalSteps = role === "provider" ? 3 : 2;
  const submitStep = totalSteps;

  // Fetch categories when the provider lands on step 3
  useEffect(() => {
    if (
      role === "provider" &&
      currentStep === 3 &&
      publicCategories.length === 0
    ) {
      dispatch(fetchPublicCategories());
    }
  }, [role, currentStep, publicCategories.length, dispatch]);

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    const ok = await submit();
    if (ok) setCurrentStep(submitStep + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelectStep
            role={role}
            onSelect={selectRole}
            error={errors.role}
          />
        );
      case 2:
        return (
          <PersonalDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            showPassword={showPassword}
            onToggleShowPassword={setShowPassword}
            role={role}
          />
        );
      case 3:
        return role === "provider" ? (
          <ProviderDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            categories={publicCategories}
            categoriesLoading={categoriesLoading}
            onToggleCategory={toggleServiceCategory}
          />
        ) : <SuccessStep role={role} onGoToLogin={() => navigate("/login")} />;;
      default:
        return <SuccessStep role={role} onGoToLogin={() => navigate("/login")} />;
    }
  };

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
        {currentStep <= submitStep && (
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabel={STEP_LABELS[currentStep]}
          />
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          {currentStep <= submitStep && (
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

              {currentStep < submitStep ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
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
        {currentStep <= submitStep && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
