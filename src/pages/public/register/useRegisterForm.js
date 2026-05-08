// Custom hook that owns all registration form state, validation, and submission.
// Keeping this logic outside the page component stops form state changes from
// redefining render helpers, which was causing input focus loss.

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  registerProvider,
  registerParticipant,
} from "../../../store/actions/authActions";

const INITIAL_FORM = {
  // Shared
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  location: "",

  // Provider
  organisationName: "",
  abn: "",
  ndisRegistered: false,
  serviceCategories: [],
  description: "",
  website: "",
};

const useRegisterForm = () => {
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    },
    [],
  );

  const toggleServiceCategory = useCallback((catId) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(catId)
        ? prev.serviceCategories.filter((c) => c !== catId)
        : [...prev.serviceCategories, catId],
    }));
  }, []);

  const selectRole = useCallback((newRole) => {
    setRole(newRole);
    setErrors({});
  }, []);

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      if (step === 1) {
        if (!role) newErrors.role = "Please select a role";
      }

      if (step === 2) {
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Invalid email format";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";
        if (!formData.phone.trim())
          newErrors.phone = "Phone number is required";
        if (!formData.location.trim())
          newErrors.location = "Location is required";
      }

      if (step === 3 && role === "provider") {
        if (!formData.organisationName.trim())
          newErrors.organisationName = "Organisation name is required";
        if (formData.serviceCategories.length === 0)
          newErrors.serviceCategories = "Select at least one service";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [role, formData],
  );

  const submit = useCallback(async () => {
    const finalStep = role === "provider" ? 3 : 2;
    if (!validateStep(finalStep)) return false;

    setSubmitting(true);
    try {
      if (role === "provider") {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          phone_number: formData.phone,
          location: formData.location,
          organisation_name: formData.organisationName,
          abn: formData.abn,
          website: formData.website,
          is_ndis_registered: formData.ndisRegistered,
          about_services: formData.description,
          categories: formData.serviceCategories,
        };
        await dispatch(registerProvider(payload)).unwrap();
      } else {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          phone_number: formData.phone,
          location: formData.location,
        };
        await dispatch(registerParticipant(payload)).unwrap();
      }
      // toast.info(
      //   "Your account is pending admin approval. Once approved you can use all features.",
      //   { duration: 6000 },
      // );
      toast.success(
      "Account created successfully! You can now log in and start using the platform.",
      { duration: 5000 },
    );
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, role, formData, validateStep]);

  return {
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
  };
};

export default useRegisterForm;
