export const getCombos = async () => {
  const res = await fetch("/api/combos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.json();
};

export const getCombo = async (id) => {
  const res = await fetch(`/api/combos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.json();
};
