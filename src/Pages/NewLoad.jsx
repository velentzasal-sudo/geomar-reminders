import { useState } from "react";
import { supabase } from "../supabase";

export default function NewLoad() {
  const [loadNumber, setLoadNumber] = useState("");
  const [route, setRoute] = useState("");
  const [cost, setCost] = useState("");

  async function saveLoad() {
    const { error } = await supabase
      .from("loads")
      .insert([
        {
          load_number: loadNumber,
          route,
          transport_cost: Number(cost),
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Το φορτίο αποθηκεύτηκε");
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">
        Νέο Φορτίο
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="LOAD-001"
        value={loadNumber}
        onChange={(e) => setLoadNumber(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Γερμανία → Ελλάδα"
        value={route}
        onChange={(e) => setRoute(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full mb-3"
        placeholder="Κόστος φορτηγού"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />

      <button
        onClick={saveLoad}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Αποθήκευση
      </button>
    </div>
  );
}