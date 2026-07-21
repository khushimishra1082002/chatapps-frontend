export const validatelogin = (formData) => {
  let errors = {};

  if (!formData.email || !formData.email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
