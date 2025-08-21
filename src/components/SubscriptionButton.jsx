import { activateSubscription } from "../api/subscription";

export default function SubscriptionButton() {
  const handleSubscribe = async () => {
    const res = await activateSubscription();
    alert(res.message);
    window.location.reload();
  };

  return (
    <button 
      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  );
}
