import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    const { data } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    setSuppliers(data || []);
  }

  async function addSupplier() {
    if (!name.trim()) return;

    const { error } = await supabase
      .from("suppliers")
      .insert([{ name }]);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    fetchSuppliers();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          🏭 Αποστολέας
        </h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

        <label className="block text-slate-300 mb-2">
          Όνομα Αποστολέα
        </label>

        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              flex-1
              bg-slate-800
              text-white
              rounded-xl
              px-3
              py-2
            "
          />

          <button
            onClick={addSupplier}
            className="
              bg-orange-500
              hover:bg-orange-600
              px-4
              rounded-xl
              text-white
            "
          >
            Προσθήκη
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-4
            "
          >
            <h3 className="text-white font-semibold">
              {supplier.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}