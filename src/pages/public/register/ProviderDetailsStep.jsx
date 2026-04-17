import { Building2, Loader2 } from "lucide-react";
import InputField from "../../../components/common/InputField";

const ProviderDetailsStep = ({
  formData,
  errors,
  onChange,
  categories,
  categoriesLoading,
  onToggleCategory,
}) => (
  <div className="space-y-5">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Provider Details</h2>
      <p className="text-slate-500 mt-1">Tell us about your organisation</p>
    </div>

    <InputField
      label="Organisation Name"
      name="organisationName"
      icon={Building2}
      placeholder="Your company name"
      required
      value={formData.organisationName}
      onChange={onChange}
      error={errors.organisationName}
    />

    <div className="grid sm:grid-cols-2 gap-4">
      <InputField
        label="ABN"
        name="abn"
        placeholder="XX XXX XXX XXX"
        value={formData.abn}
        onChange={onChange}
        error={errors.abn}
      />
      <InputField
        label="Website"
        name="website"
        type="url"
        placeholder="https://yoursite.com.au"
        value={formData.website}
        onChange={onChange}
        error={errors.website}
      />
    </div>

    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <input
        type="checkbox"
        id="ndisRegistered"
        name="ndisRegistered"
        checked={formData.ndisRegistered}
        onChange={onChange}
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
      {categoriesLoading && categories.length === 0 ? (
        <div className="flex items-center justify-center py-8 bg-slate-50 rounded-xl border border-slate-200">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          <span className="ml-2 text-sm text-slate-500">
            Loading categories...
          </span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">No categories available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
              className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                formData.serviceCategories.includes(cat.id)
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-slate-200 text-slate-600 hover:border-purple-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      {errors.serviceCategories && (
        <p className="text-xs text-red-500 mt-1">{errors.serviceCategories}</p>
      )}
    </div>

    <div>
      <label
        htmlFor="description"
        className="block text-sm font-semibold text-slate-700 mb-1.5"
      >
        About Your Services
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={onChange}
        rows={3}
        placeholder="Brief description of the services you provide..."
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
      />
    </div>
  </div>
);

export default ProviderDetailsStep;
