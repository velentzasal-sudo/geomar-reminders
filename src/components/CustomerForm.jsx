import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";

export default function CustomerForm({
  records,
  setRecords,
}) {
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState("");

  const [totalDebt, setTotalDebt] =
    useState("");

  const [
    nextCardDate,
    setNextCardDate,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [sortType, setSortType] =
    useState("remaining");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "el-GR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const addCustomer = async () => {
    if (!customer || !totalDebt) {
      alert(
        "Συμπλήρωσε πελάτη και υπόλοιπο"
      );
      return;
    }

    const customerForDb = {
      customer,

      total_debt: Number(
        String(totalDebt).replace(
          ",",
          "."
        )
      ),

      next_card_date:
        nextCardDate || null,

      notes,

      monthly_card_repeat:
        false,
    };

    const { data, error } =
      await supabase
        .from("customers")
        .insert([customerForDb])
        .select();

    if (error) {
      console.error(error);
      alert(
        "Σφάλμα αποθήκευσης στο Supabase"
      );
      return;
    }

    const newCustomer = {
      ...data[0],

      totalDebt:
        data[0].total_debt,

      nextCardDate:
        data[0].next_card_date,

      monthlyCardRepeat:
        data[0]
          .monthly_card_repeat,

      payments: [],
      expectedPayments: [],
    };

    setRecords([
      ...records,
      newCustomer,
    ]);

    setCustomer("");
    setTotalDebt("");
    setNextCardDate("");
    setNotes("");
  };

  const importExcel = (event) => {
    const file =
      event.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = async (e) => {
      const workbook =
        XLSX.read(
          e.target.result,
          {
            type: "binary",
          }
        );

      const worksheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      const importedCustomers =
        jsonData.map((row) => ({
          customer:
            row.customer ||
            row.Customer ||
            row.Επωνυμία ||
            "",

          totalDebt: Number(
            String(
              row.Υπόλοιπο ||
                row.Amount ||
                row.amount ||
                0
            ).replace(",", ".")
          ),

          nextCardDate: "",

          monthlyCardRepeat:
            false,

          notes: "",

          payments: [],

          expectedPayments: [],
        }));

      const updatedRecords = [
        ...records,
      ];

      importedCustomers.forEach(
        (importedCustomer) => {
          const existingIndex =
            updatedRecords.findIndex(
              (c) =>
                c.customer
                  .trim()
                  .toLowerCase() ===
                importedCustomer.customer
                  .trim()
                  .toLowerCase()
            );

          if (
            existingIndex !== -1
          ) {
            updatedRecords[
              existingIndex
            ] = {
              ...updatedRecords[
                existingIndex
              ],

              totalDebt:
                importedCustomer.totalDebt,
            };
          } else {
            updatedRecords.push(
              importedCustomer
            );
          }
        }
      );

  for (const customerData of importedCustomers) {

  const existingCustomer =
    records.find(
      (c) =>
        c.customer
          .trim()
          .toLowerCase() ===
        customerData.customer
          .trim()
          .toLowerCase()
    );

  if (existingCustomer) {

    const { error } =
      await supabase
        .from("customers")
        .update({
          total_debt:
            customerData.totalDebt,
        })
        .eq(
          "id",
          existingCustomer.id
        );

    if (error) {
      console.error(error);
    }

  } else {

    const { error } =
      await supabase
        .from("customers")
        .insert([
          {
            customer:
              customerData.customer,

            total_debt:
              customerData.totalDebt,

            next_card_date: null,

            monthly_card_repeat:
              false,

            notes: "",
          },
        ]);

    if (error) {
      console.error(error);
    }
  }
}
const { data } =
  await supabase
    .from("customers")
    .select("*")
    .order("customer");

const mappedCustomers =
  (data || []).map((row) => ({
    ...row,
    totalDebt:
      row.total_debt,
    nextCardDate:
      row.next_card_date,
    monthlyCardRepeat:
      row.monthly_card_repeat,
  }));

setRecords(mappedCustomers);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Νέος Πελάτης
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          className="bg-slate-800 p-3 rounded-xl"
          placeholder="Επωνυμία"
          value={customer}
          onChange={(e) =>
            setCustomer(
              e.target.value
            )
          }
        />

        <input
          className="bg-slate-800 p-3 rounded-xl"
          placeholder="Συνολικό Χρέος (€)"
          value={totalDebt}
          onChange={(e) =>
            setTotalDebt(
              e.target.value
            )
          }
        />

        <div>
          <label className="block mb-2 text-slate-400">
            📨 Επόμενη Αποστολή
            Καρτέλας
          </label>

          <input
            type="date"
            className="w-full bg-slate-800 p-3 rounded-xl"
            value={nextCardDate}
            onChange={(e) =>
              setNextCardDate(
                e.target.value
              )
            }
          />
        </div>

        <textarea
          className="bg-slate-800 p-3 rounded-xl md:col-span-3"
          placeholder="📝 Σημειώσεις"
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
        />
      </div>

      <div className="flex gap-3 mt-5 flex-wrap">
        <button
          onClick={addCustomer}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold"
        >
          ➕ Προσθήκη Πελάτη
        </button>

        <label className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl cursor-pointer font-bold">
          📥 Import Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={importExcel}
          />
        </label>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">
          Πελάτες
        </h3>

        <input
          type="text"
          placeholder="🔍 Αναζήτηση πελάτη..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full bg-slate-800 p-3 rounded-xl mb-4"
        />

        <div className="flex gap-3 mb-4 flex-wrap">
          <select
            value={sortType}
            onChange={(e) =>
              setSortType(
                e.target.value
              )
            }
            className="bg-slate-800 p-3 rounded-xl"
          >
            <option value="remaining">
              💸 Υπόλοιπο
            </option>

            <option value="debt">
              💰 Χρέος
            </option>

            <option value="name">
              🔤 Όνομα
            </option>
          </select>

          <button
            onClick={() =>
              setSortDirection(
                sortDirection === "asc"
                  ? "desc"
                  : "asc"
              )
            }
            className="bg-slate-800 px-4 rounded-xl"
          >
            {sortDirection === "asc"
              ? "⬆ Αύξουσα"
              : "⬇ Φθίνουσα"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[...records]
            .filter((customerData) =>
              (
                customerData.customer ||
                ""
              )
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .sort((a, b) => {
              let result = 0;

              if (sortType === "name") {
                result =
                  a.customer.localeCompare(
                    b.customer,
                    "el"
                  );
              }

              if (sortType === "debt") {
                result =
                  Number(
                    a.totalDebt || 0
                  ) -
                  Number(
                    b.totalDebt || 0
                  );
              }

              if (
                sortType ===
                "remaining"
              ) {
                const paidA =
                  (
                    a.payments || []
                  ).reduce(
                    (sum, p) =>
                      sum +
                      Number(
                        p.amount || 0
                      ),
                    0
                  );

                const paidB =
                  (
                    b.payments || []
                  ).reduce(
                    (sum, p) =>
                      sum +
                      Number(
                        p.amount || 0
                      ),
                    0
                  );

                result =
                  (Number(
                    a.totalDebt || 0
                  ) -
                    paidA) -
                  (Number(
                    b.totalDebt || 0
                  ) -
                    paidB);
              }

              return sortDirection ===
                "asc"
                ? result
                : -result;
            })
            .map(
              (
                customerData,
                index
              ) => (
                <div
                  key={index}
                  onClick={() =>
                    navigate(
                      `/customers/${encodeURIComponent(
                        customerData.customer
                      )}`
                    )
                  }
                  className="bg-slate-800 rounded-xl p-4 cursor-pointer hover:bg-slate-700 transition"
                >
                  <h4 className="font-bold text-sm mb-2">
                    {
                      customerData.customer
                    }
                  </h4>

                  <p className="text-sm">
                    💸{" "}
                    {formatMoney(
                      customerData.totalDebt
                    )}
                    €
                  </p>

                  <p className="text-sm">
                    📨{" "}
                    {customerData.nextCardDate ||
                      "-"}
                  </p>

                  <p className="text-sm">
                    💳{" "}
                    {customerData
                      .payments
                      ?.length || 0}
                  </p>

                  <p className="text-xs text-slate-400 mt-2 truncate">
                    📝{" "}
                    {(
                      customerData.notes ||
                      "-"
                    ).slice(0, 40)}
                  </p>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}