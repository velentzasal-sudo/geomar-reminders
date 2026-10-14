import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LoadDetails() {
  const { id } = useParams();

  const [load, setLoad] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchLoad();
  }, []);

  async function fetchLoad() {
    const { data: loadData } = await supabase
      .from("loads")
      .select("*")
      .eq("id", id)
      .single();

    setLoad(loadData);

    const { data: itemsData } = await supabase
      .from("load_items")
      .select(`
        *,
        customers(name)
      `)
      .eq("load_id", id);

    setItems(itemsData || []);
  }

  if (!load) return <p>Φόρτωση...</p>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-2">
        {load.load_number}
      </h1>

      <div className="bg-white p-4 rounded shadow mb-5">
        <p>
          Πληρότητα: {load.occupied_units} / {load.max_units}
        </p>

        <p>
          Ποσοστό: {load.fill_rate}%
        </p>

        <p>
          Έσοδα: €{load.revenue}
        </p>

        <p>
          Κόστος: €{load.transport_cost}
        </p>

        <p className="font-bold text-green-600">
          Κέρδος: €{load.profit}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-3">
        Πελάτες στο φορτίο
      </h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Πελάτης</th>
            <th className="p-2">EUR</th>
            <th className="p-2">IND</th>
            <th className="p-2">Units</th>
            <th className="p-2">Έσοδο</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">
                {item.customers?.name}
              </td>

              <td className="border p-2">
                {item.eur_pallets}
              </td>

              <td className="border p-2">
                {item.industrial_pallets}
              </td>

              <td className="border p-2">
                {item.loading_units}
              </td>

              <td className="border p-2">
                €{item.revenue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}