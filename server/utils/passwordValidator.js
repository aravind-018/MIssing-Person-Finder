import { getSystemSettings } from "../services/settingsService.js";

export const validatePassword = async (password) => {
  const settings = await getSystemSettings();
  
  console.log("Settings ID:", settings._id.toString());
  console.log("Security:", settings.security);
  const security = settings.security;

  if (password.length < security.minPasswordLength) {
    return {
      valid: false,
      message: `Password must be at least ${security.minPasswordLength} characters long.`,
    };
  }

  if (security.requireStrongPassword) {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]+$/;

    if (!strongPassword.test(password)) {
      return {
        valid: false,
        message:
          "Password must contain an uppercase letter, lowercase letter, number and special character.",
      };
    }
  }

  return {
    valid: true,
  };
};