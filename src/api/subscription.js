export const activateSubscription = async () => {
  const res = await fetch("/api/subscription/activate", {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.json();
};
