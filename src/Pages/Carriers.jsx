import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Carriers() {
  const [carriers, setCarriers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    fetchCarriers();
  }, []);

  async function fetchCarriers() {
    const { data, error } = await supabase
      .from("carriers")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }

    setCarriers(data || []);
  }

  async function saveCarrier() {
    if (!form.name.trim()) {
      alert("Βάλε όνομα μεταφορέα");
      return;
    }

    const { error } = await supabase
      .from("carriers")
      .insert([form]);

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      name: "",
      phone: "",
      email: "",
      notes: "",
    });

    fetchCarriers();
  }

  async function updateCarrier() {
    const { error } = await supabase
      .from("carriers")
      .update({
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
      })
      .eq("id", editingId);

    if (error) {
      alert(error.message);
      return;
    }

    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      email: "",
      notes: "",
    });

    fetchCarriers();
  }

  async function deleteCarrier(id) {
    if (!window.confirm("Να διαγραφεί ο μεταφορέας;")) {
      return;
    }

    const { error } = await supabase
      .from("carriers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchCarriers();
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-white mb-6">
        🚛 Μεταφορείς
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Επωνυμία
            </label>

            <input
              className="w-full bg-slate-800 rounded-xl p-3 text-white"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Τηλέφωνο
            </label>

            <input
              className="w-full bg-slate-800 rounded-xl p-3 text-white"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              className="w-full bg-slate-800 rounded-xl p-3 text-white"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Σημειώσεις
            </label>

            <input
              className="w-full bg-slate-800 rounded-xl p-3 text-white"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
            />
          </div>

        </div>

        <button
          onClick={
            editingId
              ? updateCarrier
              : saveCarrier
          }
          className="
            mt-5
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
          "
        >
          {editingId ? "Ενημέρωση" : "Αποθήκευση"}
        </button>
      </div>

      <div className="grid gap-3">
        {carriers.map((carrier) => (
          <div
            key={carrier.id}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-4
            "
          >
            <h3 className="text-white font-semibold text-lg">
              {carrier.name}
            </h3>

            <p className="text-slate-400">
              📞 {carrier.phone || "-"}
            </p>

            <p className="text-slate-400">
              📧 {carrier.email || "-"}
            </p>

            {carrier.notes && (
              <p className="text-slate-500 mt-2">
                {carrier.notes}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingId(carrier.id);

                  setForm({
                    name: carrier.name || "",
                    phone: carrier.phone || "",
                    email: carrier.email || "",
                    notes: carrier.notes || "",
                  });

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="
                  px-3
                  py-2
                  bg-blue-600
                  hover:bg-blue-700
                  rounded-lg
                  text-white
                "
              >
                ✏️ Επεξεργασία
              </button>

              <button
                onClick={() => deleteCarrier(carrier.id)}
                className="
                  px-3
                  py-2
                  bg-red-600
                  hover:bg-red-700
                  rounded-lg
                  text-white
                "
              >
                🗑️ Διαγραφή
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}