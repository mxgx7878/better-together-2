import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordField from "./PasswordField";
import { changePassword } from "../../store/actions/userActions";
import { ASYNC_STATUS } from "../../constants";

const initialForm = {
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
};

const validate = (form) => {
  const errors = {};

  if (!form.current_password?.trim()) {
    errors.current_password = "Current password is required";
  }
  if (!form.new_password?.trim()) {
    errors.new_password = "New password is required";
  } else if (form.new_password.length < 8) {
    errors.new_password = "New password must be at least 8 characters";
  }
  if (!form.new_password_confirmation?.trim()) {
    errors.new_password_confirmation = "Confirm your new password";
  } else if (form.new_password_confirmation !== form.new_password) {
    errors.new_password_confirmation = "Passwords do not match";
  }

  return errors;
};

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const passwordStatus = useSelector((state) => state.user.passwordStatus);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (passwordStatus === ASYNC_STATUS.SUCCEEDED) {
      setSuccessMessage("Password updated successfully.");
      setForm(initialForm);
      setErrors({});
      const timeout = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [passwordStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(changePassword(form)).unwrap();
    } catch {
      // Error notifications are shown by the thunk.
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Security</h2>
        <p className="text-sm text-slate-600 mt-2">
          Update your account password to keep your provider or participant profile secure.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <PasswordField
          label="Current password"
          name="current_password"
          value={form.current_password}
          onChange={handleChange}
          error={errors.current_password}
          visible={visible.current}
          onToggleVisible={(value) => setVisible((prev) => ({ ...prev, current: value }))}
        />
        <PasswordField
          label="New password"
          name="new_password"
          value={form.new_password}
          onChange={handleChange}
          error={errors.new_password}
          visible={visible.new}
          onToggleVisible={(value) => setVisible((prev) => ({ ...prev, new: value }))}
        />
        <PasswordField
          label="Confirm new password"
          name="new_password_confirmation"
          value={form.new_password_confirmation}
          onChange={handleChange}
          error={errors.new_password_confirmation}
          visible={visible.confirm}
          onToggleVisible={(value) => setVisible((prev) => ({ ...prev, confirm: value }))}
        />
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={passwordStatus === ASYNC_STATUS.LOADING}
        className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold transition hover:bg-purple-700 disabled:opacity-60"
      >
        {passwordStatus === ASYNC_STATUS.LOADING ? "Updating password..." : "Update password"}
      </button>
    </div>
  );
};

export default ChangePasswordForm;
