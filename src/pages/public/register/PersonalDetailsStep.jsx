import { User, Mail, Phone, MapPin } from "lucide-react";
import InputField from "../../../components/common/InputField";
import PasswordField from "../../../components/common/PasswordField";

const PersonalDetailsStep = ({
  formData,
  errors,
  onChange,
  showPassword,
  onToggleShowPassword,
  role
}) => (
  <div className="space-y-5">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-slate-800">{role === "provider" ? "Business Details" : "Looking for Services"} </h2>
      <p className="text-slate-500 mt-1">{role === "provider" ? "Tell us about your business" : "Tell us about the services you're looking for"}</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <InputField
        label="First Name"
        name="firstName"
        icon={User}
        placeholder="John"
        required
        value={formData.firstName}
        onChange={onChange}
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        name="lastName"
        icon={User}
        placeholder="Doe"
        required
        value={formData.lastName}
        onChange={onChange}
        error={errors.lastName}
      />
    </div>

    <InputField
      label="Email Address"
      name="email"
      type="email"
      icon={Mail}
      placeholder="you@example.com"
      required
      value={formData.email}
      onChange={onChange}
      error={errors.email}
    />

    <div className="grid sm:grid-cols-2 gap-4">
      <PasswordField
        label="Password"
        name="password"
        placeholder="Min 8 characters"
        required
        value={formData.password}
        onChange={onChange}
        error={errors.password}
        visible={showPassword}
        onToggleVisible={onToggleShowPassword}
      />
      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Re-enter password"
        required
        value={formData.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
        visible={showPassword}
        onToggleVisible={onToggleShowPassword}
      />
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <InputField
        label="Phone Number"
        name="phone"
        type="tel"
        icon={Phone}
        placeholder="04XX XXX XXX"
        required
        value={formData.phone}
        onChange={onChange}
        error={errors.phone}
      />
      <InputField
        label="Location"
        name="location"
        icon={MapPin}
        placeholder="e.g. Melbourne, VIC"
        required
        value={formData.location}
        onChange={onChange}
        error={errors.location}
      />
    </div>
  </div>
);

export default PersonalDetailsStep;
