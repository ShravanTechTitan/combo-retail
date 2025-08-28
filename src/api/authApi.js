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
