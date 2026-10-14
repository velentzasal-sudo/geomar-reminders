import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
export default function Loads() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoads();
  }, []);
const navigate = useNavigate();
  async function fetchLoads() {
    const { data, error } = await supabase
      .from("loads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setLoads(data || []);
    setLoading(false);
  }

  if (loading) return <p>Φόρτωση...</p>;

  return (
    
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Φορτία</h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.location.href = "/loads/new"}
        >
          Νέο Φορτίο
        </button>
      </div>
    <div
  key={load.id}
  onClick={() => navigate(`/loads/${load.id}`)}
  className="border rounded-lg p-4 shadow bg-white cursor-pointer"
></div>
      <div className="grid gap-4">
        {loads.map((load) => (
          <div
            key={load.id}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">
                {load.load_number}
              </h2>

              <span>{load.status}</span>
            </div>

            <p>{load.route}</p>

            <div className="mt-3">
              <p>
                Θέσεις: {load.occupied_units} / {load.max_units}
              </p>

              <p>
                Πληρότητα: {load.fill_rate}%
              </p>

              <p>
                Έσοδα: €{load.revenue}
              </p>

              <p>
                Κόστος: €{load.transport_cost}
              </p>

              <p className="font-bold">
                Κέρδος: €{load.profit}
              </p>
              
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}