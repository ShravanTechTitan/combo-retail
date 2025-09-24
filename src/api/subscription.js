import api from "./axiosConfig";

export const activateSubscription = async () => {
  const res = await api.post("/subscription/activate");
  return res.data;
};
