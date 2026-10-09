import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function DashboardCards({
  records,
}) {
  const navigate = useNavigate();

  const [showExpected, setShowExpected] =
    useState(true);

  const [showOverdue, setShowOverdue] =
    useState(false);

  const [showUpcoming, setShowUpcoming] =
    useState(false);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "el-GR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const totalCustomers =
    records.length;

  const totalAmount =
    records.reduce(
      (sum, r) =>
        sum +
        Number(r.totalDebt || 0),
      0
    );

  const upcomingCards =
    records
      .filter(
        (customer) =>
          customer.nextCardDate &&
          customer.nextCardDate >= today
      )
      .sort(
        (a, b) =>
          new Date(a.nextCardDate) -
          new Date(b.nextCardDate)
      );

  const expectedPayments =
    records.flatMap(
      (customer) =>
        (customer.expectedPayments || [])
          .filter(
            (payment) =>
              payment.date >= today
          )
          .map((payment) => ({
            customer:
              customer.customer,
            ...payment,
          }))
    );

  const overduePayments =
    records.flatMap(
      (customer) =>
        (customer.expectedPayments || [])
          .filter(
            (payment) =>
              payment.date < today
          )
          .map((payment) => ({
            customer:
              customer.customer,
            ...payment,
          }))
    );

const [note, setNote] = useState("");

const loadNote = async () => {
  const { data, error } = await supabase
    .from("dashboard_notes")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    setNote(data.note || "");
  }
};

useEffect(() => {
  loadNote();
}, []);

const saveNote = async () => {
  const { error } = await supabase
    .from("dashboard_notes")
    .update({
      note,
      updated_at: new Date(),
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    alert("Σφάλμα αποθήκευσης");
    return;
  }

  alert("✅ Αποθηκεύτηκε");
};

const clearNote = async () => {
  if (!window.confirm("Διαγραφή σημείωσης;"))
    return;

  const { error } = await supabase
    .from("dashboard_notes")
    .update({
      note: "",
      updated_at: new Date(),
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    alert("Σφάλμα διαγραφής");
    return;
  }

  setNote("");
};
useEffect(() => {
  loadNote();
}, []);
  return (
    <>
 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">

  <h2 className="text-xl font-bold mb-3">
    📝 Σημείωση για Αύριο
  </h2>

  <textarea
    rows={4}
    value={note}
    onChange={(e) =>
      setNote(e.target.value)
    }
    placeholder="Γράψε εδώ ότι πρέπει να θυμηθείς..."
    className="
      w-full
      bg-slate-800
      rounded-xl
      p-4
      outline-none
      resize-none
      text-white
      placeholder:text-slate-500
    "
  />

  <div className="flex gap-3 mt-4">

    <button
      onClick={saveNote}
      className="
        bg-cyan-600
        hover:bg-cyan-700
        px-5
        py-2
        rounded-xl
        font-semibold
      "
    >
      💾 Αποθήκευση
    </button>

    <button
      onClick={clearNote}
      className="
        bg-red-600
        hover:bg-red-700
        px-5
        py-2
        rounded-xl
        font-semibold
      "
    >
      🗑 Διαγραφή
    </button>

  </div>

</div>

  <p className="text-xs text-slate-500 mt-2">
    Προσωρινή σημείωση dashboard.
  </p>
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">

  <h2 className="text-xl font-bold mb-3">
    📝 Σημείωση για Αύριο
  </h2>

  <textarea
    rows={4}
    value={note}
    onChange={(e) =>
      saveNote(e.target.value)
    }
    placeholder="Γράψε εδώ ότι πρέπει να θυμηθείς..."
    className="
      w-full
      bg-slate-800
      rounded-xl
      p-4
      outline-none
      resize-none
      text-white
      placeholder:text-slate-500
    "
  />

  <p className="text-xs text-slate-500 mt-2">
    Αποθηκεύεται αυτόματα.
  </p>

</div>
          <div className="space-y-4">

        <div className="bg-slate-900 rounded-3xl p-5">

          <button
            onClick={() =>
              setShowExpected(
                !showExpected
              )
            }
            className="w-full flex justify-between items-center"
          >
            <div className="flex items-center gap-3">

              <span>⏰</span>

              <span className="font-semibold">
                Αναμενόμενες Πληρωμές
              </span>

                  </div>

            <span className="text-slate-500">
              {showExpected
                ? "−"
                : "+"}
            </span>

          </button>

          {showExpected && (
            <div className="mt-4 space-y-2">

              {expectedPayments.length === 0 ? (
                <p className="text-slate-400">
                  Δεν υπάρχουν αναμενόμενες πληρωμές.
                </p>
              ) : (
                expectedPayments.map(
                  (payment, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(
                          `/customers/${encodeURIComponent(
                            payment.customer
                          )}`
                        )
                      }
                      className="
                        bg-slate-800
                        hover:bg-slate-700
                        rounded-xl
                        p-3
                        cursor-pointer
                        transition
                      "
                    >
                      <div className="font-medium">
                        {payment.customer}
                      </div>

                      <div className="text-sm text-slate-400">
                        {formatMoney(
                          payment.amount
                        )}
                        €
                        {" • "}
                        {payment.date}
                      </div>

                    </div>
                  )
                )
              )}

            </div>
          )}

        </div>

        <div className="bg-slate-900 rounded-3xl p-5">

          <button
            onClick={() =>
              setShowOverdue(
                !showOverdue
              )
            }
            className="w-full flex justify-between items-center"
          >
            <div className="flex items-center gap-3">

              <span>🚨</span>

              <span className="font-semibold">
                Ληξιπρόθεσμες Πληρωμές
              </span>

              <span className="
                bg-slate-800
                text-slate-400
                text-xs
                px-2
                py-1
                rounded-full
              ">
                {
                  overduePayments.length
                }
              </span>

            </div>

            <span className="text-slate-500">
              {showOverdue
                ? "−"
                : "+"}
            </span>

          </button>

          {showOverdue && (
            <div className="mt-4 space-y-2">

              {overduePayments.length === 0 ? (
                <p className="text-slate-400">
                  Δεν υπάρχουν ληξιπρόθεσμες πληρωμές.
                </p>
              ) : (
                overduePayments.map(
                  (payment, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(
                          `/customers/${encodeURIComponent(
                            payment.customer
                          )}`
                        )
                      }
                      className="
                        bg-slate-800
                        hover:bg-slate-700
                        rounded-xl
                        p-3
                        cursor-pointer
                        transition
                      "
                    >
                      <div className="font-medium">
                        {payment.customer}
                      </div>

                      <div className="text-sm text-slate-400">
                        {formatMoney(
                          payment.amount
                        )}
                        €
                        {" • "}
                        {payment.date}
                      </div>
                    </div>
                  )
                )
              )}

            </div>
          )}

        </div>

        <div className="bg-slate-900 rounded-3xl p-5">

          <button
            onClick={() =>
              setShowUpcoming(
                !showUpcoming
              )
            }
            className="w-full flex justify-between items-center"
          >
            <div className="flex items-center gap-3">

              <span>🔔</span>

              <span className="font-semibold">
                Επερχόμενες Καρτέλες
              </span>

              <span className="
                bg-slate-800
                text-slate-400
                text-xs
                px-2
                py-1
                rounded-full
              ">
                {upcomingCards.length}
              </span>

            </div>

            <span className="text-slate-500">
              {showUpcoming
                ? "−"
                : "+"}
            </span>

          </button>

          {showUpcoming && (
            <div className="mt-4 space-y-2">

              {upcomingCards.length === 0 ? (
                <p className="text-slate-400">
                  Δεν υπάρχουν επερχόμενες καρτέλες.
                </p>
              ) : (
                upcomingCards.map(
                  (
                    customer,
                    index
                  ) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(
                          `/customers/${encodeURIComponent(
                            customer.customer
                          )}`
                        )
                      }
                      className="
                        bg-slate-800
                        hover:bg-slate-700
                        rounded-xl
                        p-3
                        cursor-pointer
                        transition
                      "
                    >
                      <div className="font-medium">
                        {customer.customer}
                      </div>

                      <div className="text-sm text-slate-400">
                        {
                          customer.nextCardDate
                        }
                      </div>

                    </div>
                  )
                )
              )}

            </div>
          )}

        </div>

      </div>
    </>
  );
}