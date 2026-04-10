import { CheckCircle } from "lucide-react";

const StepIndicator = ({ currentStep, totalSteps = 3, stepLabel }) => (
  <>
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step < currentStep
                ? "bg-purple-600 text-white"
                : step === currentStep
                  ? "bg-purple-600 text-white ring-4 ring-purple-200"
                  : "bg-slate-200 text-slate-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 sm:w-20 h-1 rounded-full ${
                step < currentStep ? "bg-purple-600" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
    <p className="text-center text-sm text-slate-500 mb-6">
      Step {currentStep} of {totalSteps} —{" "}
      <span className="font-medium text-slate-700">{stepLabel}</span>
    </p>
  </>
);

export default StepIndicator;
