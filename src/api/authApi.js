import api from "./axiosConfig";

// Login
export const loginUser = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};

// Register
export const registerUser = async (userData) => {
  const res = await api.post("/users/register", userData);
  return res.data;
};

// Send OTP (for login/signup or forgot password)
export const sendOtp = async (email) => {
  const res = await api.post("/users/send-otp", { email });
  return res.data;
};

// Verify OTP
export const verifyOtp = async ({ email, otp }) => {
  const res = await api.post("/users/verify-otp", { email, otp });
  return res.data;
};

// Reset password
export const resetPassword = async ({ email, otp, newPassword }) => {
  const res = await api.post("/users/reset-password", {
  email: email,
  otp: otp,
  newPassword: newPassword
});

  return res.data;
};
