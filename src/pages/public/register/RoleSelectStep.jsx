import { Briefcase, Heart, CheckCircle } from "lucide-react";

const providerFeatures = [
  "Business directory listing",
  "Service request management",
  "Events & networking",
  "Marketing tools",
];

const participantFeatures = [
  "Find & connect with providers",
  "Learning hub & resources",
  "Community message board",
  "Plan buddy support",
];

const RoleSelectStep = ({ role, onSelect, error }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-slate-800">
        Join The Better Together Network
      </h2>
      <p className="text-slate-500 mt-2">
        How would you like to use the platform?
      </p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      {/* Provider Card */}
      <button
        type="button"
        onClick={() => onSelect("provider")}
        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg group ${
          role === "provider"
            ? "border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-200"
            : "border-slate-200 hover:border-purple-300 bg-white"
        }`}
      >
        {role === "provider" && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
        )}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
          <Briefcase className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Register as a Business
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          List your services, connect with participants, grow your NDIS
          business, and access professional development tools.
        </p>
        <ul className="mt-4 space-y-2">
          {providerFeatures.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <CheckCircle className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </button>

      {/* Participant Card */}
      <button
        type="button"
        onClick={() => onSelect("participant")}
        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg group ${
          role === "participant"
            ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-200"
            : "border-slate-200 hover:border-blue-300 bg-white"
        }`}
      >
        {role === "participant" && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Looking for Services
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Find quality NDIS providers, access community resources, manage your
          plan, and connect with other participants.
        </p>
        <ul className="mt-4 space-y-2">
          {participantFeatures.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </button>
    </div>
    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
  </div>
);

export default RoleSelectStep;
