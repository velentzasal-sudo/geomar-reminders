import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Loads() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoads();
  }, []);

  async function fetchLoads() {
    const { data, error } = await supabase
      .from("loads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setLoads(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        Φόρτωση...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            🚚 Φορτία
          </h1>

          <p className="text-slate-400 mt-1">
            Διαχείριση φορτίων και πληρότητας
          </p>
        </div>

        <button
          onClick={() => navigate("/loads/new")}
          className="
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          + Νέο Φορτίο
        </button>
      </div>

      {loads.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-2">
            Δεν υπάρχουν φορτία
          </h2>

          <p className="text-slate-400">
            Δημιούργησε το πρώτο σου φορτίο.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {loads.map((load) => (
            <div
              key={load.id}
              onClick={() => navigate(`/loads/${load.id}`)}
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-5
                cursor-pointer
                hover:border-orange-500
                hover:shadow-xl
                transition
              "
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {load.load_number}
                </h2>

                <span className="text-orange-400 font-medium">
                  {load.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">
                    Θέσεις
                  </p>

                  <p className="text-white font-bold">
                    {load.occupied_units} / {load.max_units}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Πληρότητα
                  </p>

                  <p className="text-white font-bold">
                    {load.fill_rate}%
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Έσοδα
                  </p>

                  <p className="text-green-400 font-bold">
                    €{load.revenue || 0}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Κόστος
                  </p>

                  <p className="text-red-400 font-bold">
                    €{load.transport_cost || 0}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Κέρδος
                  </p>

                  <p className="text-orange-400 font-bold">
                    €{load.profit || 0}
                  </p>
                </div>
                <div>
  <p className="text-slate-400 text-sm">
    Ημερομηνία
  </p>

  <p className="text-white font-bold">
    {load.load_date || "-"}
  </p>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}