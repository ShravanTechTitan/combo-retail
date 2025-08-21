import { useEffect, useState } from "react";
import { getCombos } from "../api/combos";
import ComboCard from "./ComboCard";
import { activateSubscription } from "../api/subscription";

export default function ComboList() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getCombos();
      setCombos(data);
    })();
  }, []);

  const handleSubscribe = async () => {
    const res = await activateSubscription();
    alert(res.message);
    window.location.reload();
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {combos.map(combo => (
        <ComboCard 
          key={combo.id} 
          combo={combo} 
          onSubscribe={handleSubscribe} 
        />
      ))}
    </div>
  );
}

