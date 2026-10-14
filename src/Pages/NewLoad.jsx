import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function NewLoad() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    load_number: "",
    supplier_name: "",
    customer_name: "",
    carrier_name: "",
    truck_registration: "",
    eur_pallets: 0,
    industrial_pallets: 0,
    status: "Planning",
  });

  const loadingUnits =
    Number(form.eur_pallets) +
    Number(form.industrial_pallets) * 1.5;

  async function saveLoad() {
    const { error } = await supabase
      .from("loads")
      .insert([form]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Το φορτίο αποθηκεύτηκε");

    navigate("/loads");
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-6">
        🚚 Νέο Φορτίο
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">

        <input
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
          placeholder="Αριθμός Φορτίου"
          value={form.load_number}
          onChange={(e) =>
            setForm({
              ...form,
              load_number: e.target.value,
            })
          }
        />

        <input
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
          placeholder="Παραλαβή από"
          value={form.supplier_name}
          onChange={(e) =>
            setForm({
              ...form,
              supplier_name: e.target.value,
            })
          }
        />

        <input
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
          placeholder="Για ποιον είναι"
          value={form.customer_name}
          onChange={(e) =>
            setForm({
              ...form,
              customer_name: e.target.value,
            })
          }
        />

        <input
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
          placeholder="Μεταφορέας"
          value={form.carrier_name}
          onChange={(e) =>
            setForm({
              ...form,
              carrier_name: e.target.value,
            })
          }
        />

        <input
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
          placeholder="Πινακίδα Φορτηγού"
          value={form.truck_registration}
          onChange={(e) =>
            setForm({
              ...form,
              truck_registration: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            className="p-3 rounded-xl bg-slate-800 text-white"
            placeholder="EUR Παλέτες"
            value={form.eur_pallets}
            onChange={(e) =>
              setForm({
                ...form,
                eur_pallets: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="p-3 rounded-xl bg-slate-800 text-white"
            placeholder="Βιομηχανικές Παλέτες"
            value={form.industrial_pallets}
            onChange={(e) =>
              setForm({
                ...form,
                industrial_pallets: e.target.value,
              })
            }
          />
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-300">
            EUR: {form.eur_pallets}
          </p>

          <p className="text-slate-300">
            Βιομηχανικές: {form.industrial_pallets}
          </p>

          <p className="text-orange-400 font-bold text-lg">
            Loading Units: {loadingUnits}
          </p>

          <p className="text-white">
            Πληρότητα: {((loadingUnits / 33) * 100).toFixed(2)}%
          </p>
        </div>

        <button
          onClick={saveLoad}
          className="
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >
          Αποθήκευση Φορτίου
        </button>

      </div>
    </div>
  );
}