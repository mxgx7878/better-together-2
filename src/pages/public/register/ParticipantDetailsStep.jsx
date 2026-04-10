import { User, FileText } from "lucide-react";
import InputField from "../../../components/common/InputField";

const ParticipantDetailsStep = ({ formData, errors, onChange }) => (
  <div className="space-y-5">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Participant Details</h2>
      <p className="text-slate-500 mt-1">
        Help us personalise your experience (all fields optional)
      </p>
    </div>

    <InputField
      label="NDIS Number"
      name="ndisNumber"
      icon={FileText}
      placeholder="XXX XXX XXXX"
      value={formData.ndisNumber}
      onChange={onChange}
      error={errors.ndisNumber}
    />

    <InputField
      label="Support Coordinator Name"
      name="supportCoordinator"
      icon={User}
      placeholder="Your coordinator's name"
      value={formData.supportCoordinator}
      onChange={onChange}
      error={errors.supportCoordinator}
    />

    <InputField
      label="Primary Disability"
      name="primaryDisability"
      placeholder="e.g. Intellectual, Physical, Psychosocial"
      value={formData.primaryDisability}
      onChange={onChange}
      error={errors.primaryDisability}
    />

    <div>
      <label
        htmlFor="goals"
        className="block text-sm font-semibold text-slate-700 mb-1.5"
      >
        Your NDIS Goals
      </label>
      <textarea
        id="goals"
        name="goals"
        value={formData.goals}
        onChange={onChange}
        rows={3}
        placeholder="What are you hoping to achieve with your NDIS plan?"
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
      />
    </div>
  </div>
);

export default ParticipantDetailsStep;
