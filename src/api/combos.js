import api from "./axiosConfig";

export const getCombos = async () => {
  const res = await api.get("/combos");
  return res.data;
};

export const getCombo = async (id) => {
  const res = await api.get(`/combos/${id}`);
  return res.data;
};
