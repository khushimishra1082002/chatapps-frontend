export const validateSignup = (formData) => {
  let errors = {};

  if (!formData.name || formData.name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!formData.email || !formData.email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!formData.phoneNo || formData.phoneNo.length !== 10) {
    errors.phoneNo = "Phone number must be 10 digits";
  }

  return errors;
};
