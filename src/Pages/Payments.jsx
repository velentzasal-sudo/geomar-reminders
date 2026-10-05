import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

export default function CustomerDetails({
  records,
  setRecords,
}) {
  const { customerName } = useParams();
  const navigate = useNavigate();

  const customer = records.find(
    (c) =>
      c.customer ===
      decodeURIComponent(customerName)
  );

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState("");

  const [expectedAmount, setExpectedAmount] =
    useState("");

  const [expectedDate, setExpectedDate] =
    useState("");

  const [notes, setNotes] =
    useState(customer?.notes || "");

  const [cardDate, setCardDate] =
    useState(
      customer?.nextCardDate || ""
    );

  if (!customer) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          Ο πελάτης δεν βρέθηκε
        </h1>
      </div>
    );
  }

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      "el-GR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const totalPaid =
    (customer.payments || []).reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount || 0),
      0
    );

  const remainingDebt =
    Math.max(
      0,
      Number(customer.totalDebt || 0) -
        Number(totalPaid || 0)
    );

  const addPayment = () => {
    if (
      !paymentAmount ||
      !paymentDate
    )
      return;

    const updated = [...records];

    const customerIndex =
      records.findIndex(
        (c) =>
          c.customer ===
          customer.customer
      );

    updated[customerIndex] = {
      ...updated[customerIndex],

      payments: [
        ...(updated[customerIndex]
          .payments || []),

        {
          amount: Number(
            paymentAmount
          ),
          date: paymentDate,
        },
      ],
    };

    setRecords(updated);

    setPaymentAmount("");
    setPaymentDate("");
  };

  const deletePayment = (index) => {
    if (
      !window.confirm(
        "Διαγραφή πληρωμής;"
      )
    )
      return;

    const updated = [...records];

    const customerIndex =
      records.findIndex(
        (c) =>
          c.customer ===
          customer.customer
      );

    updated[customerIndex] = {
      ...updated[customerIndex],

      payments:
        updated[
          customerIndex
        ].payments.filter(
          (_, i) => i !== index
        ),
    };

    setRecords(updated);
  };

  const addExpectedPayment = () => {
    if (
      !expectedAmount ||
      !expectedDate
    )
      return;

    const updated = [...records];

    const customerIndex =
      records.findIndex(
        (c) =>
          c.customer ===
          customer.customer
      );

    updated[customerIndex] = {
      ...updated[customerIndex],

      expectedPayments: [
        ...(updated[customerIndex]
          .expectedPayments || []),

        {
          amount: Number(
            expectedAmount
          ),
          date: expectedDate,
        },
      ],
    };

    setRecords(updated);

    setExpectedAmount("");
    setExpectedDate("");
  };

  const saveCardDate = () => {
    const updated = [...records];

    const customerIndex =
      records.findIndex(
        (c) =>
          c.customer ===
          customer.customer
      );

    updated[customerIndex] = {
      ...updated[customerIndex],
      nextCardDate: cardDate,
    };

    setRecords(updated);
  };

  return (
    <div className="space-y-6">

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <h1 className="text-4xl font-bold mb-6">
          {customer.customer}
        </h1>

        <div className="flex flex-wrap gap-3">

          <div className="bg-orange-500 px-4 py-2 rounded-xl">
            💰 Χρέος:
            {" "}
            {formatMoney(
              customer.totalDebt
            )}
            €
          </div>

          <div className="bg-green-600 px-4 py-2 rounded-xl">
            ✅ Πληρωμένα:
            {" "}
            {formatMoney(totalPaid)}
            €
          </div>

          <div className="bg-red-600 px-4 py-2 rounded-xl">
            💸 Υπόλοιπο:
            {" "}
            {formatMoney(
              remainingDebt
            )}
            €
          </div>

          <div className="bg-blue-600 px-4 py-2 rounded-xl">
            📨 Καρτέλα:
            {" "}
            {customer.nextCardDate ||
              "Δεν ορίστηκε"}
          </div>

        </div>

        <div className="bg-slate-800 rounded-xl p-4 mt-4">

          <h3 className="font-bold mb-3">
            📝 Σημειώσεις
          </h3>

          <textarea
            value={notes}
            onChange={(e) => {
              const value =
                e.target.value;

              setNotes(value);

              const updated =
                [...records];

              const customerIndex =
                records.findIndex(
                  (c) =>
                    c.customer ===
                    customer.customer
                );

              updated[
                customerIndex
              ] = {
                ...updated[
                  customerIndex
                ],
                notes: value,
              };

              setRecords(updated);
            }}
            rows={6}
            className="w-full bg-slate-700 p-3 rounded-xl"
            placeholder="Γράψε σημειώσεις..."
          />

          <p className="text-xs text-slate-400 mt-2">
            Αποθηκεύεται αυτόματα
          </p>

        </div>

        <div className="bg-slate-800 rounded-xl p-4 mt-4">

          <h3 className="font-bold mb-3">
            📨 Ημερομηνία Αποστολής Καρτέλας
          </h3>

          <input
            type="date"
            value={cardDate}
            onChange={(e) =>
              setCardDate(
                e.target.value
              )
            }
            className="w-full bg-slate-700 p-3 rounded-xl"
          />

          <button
            onClick={saveCardDate}
            className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
          >
            💾 Αποθήκευση
          </button>

        </div>

        <div className="mt-5">

          <button
            onClick={() =>
              navigate("/customers")
            }
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-xl"
          >
            ← Επιστροφή
          </button>

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          💰 Καταχώρηση Πληρωμής
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="number"
            placeholder="Ποσό"
            value={paymentAmount}
            onChange={(e) =>
              setPaymentAmount(
                e.target.value
              )
            }
            className="bg-slate-800 p-3 rounded-xl"
          />

          <input
            type="date"
            value={paymentDate}
            onChange={(e) =>
              setPaymentDate(
                e.target.value
              )
            }
            className="bg-slate-800 p-3 rounded-xl"
          />

        </div>

        <button
          onClick={addPayment}
          className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
        >
          ➕ Πληρωμή
        </button>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          ⏰ Αναμενόμενη Πληρωμή
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="number"
            placeholder="Ποσό"
            value={expectedAmount}
            onChange={(e) =>
              setExpectedAmount(
                e.target.value
              )
            }
            className="bg-slate-800 p-3 rounded-xl"
          />

          <input
            type="date"
            value={expectedDate}
            onChange={(e) =>
              setExpectedDate(
                e.target.value
              )
            }
            className="bg-slate-800 p-3 rounded-xl"
          />

        </div>

        <button
          onClick={addExpectedPayment}
          className="mt-4 bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl font-bold"
        >
          ➕ Αναμενόμενη Πληρωμή
        </button>

        <div className="mt-6 space-y-3">

          {(customer.expectedPayments || [])
            .sort(
              (a, b) =>
                new Date(a.date) -
                new Date(b.date)
            )
            .map(
              (payment, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-xl p-4"
                >
                  <p>
                    📅 {payment.date}
                  </p>

                  <p>
                    💰{" "}
                    {formatMoney(
                      payment.amount
                    )}
                    €
                  </p>
                </div>
              )
            )}

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          Ιστορικό Πληρωμών
        </h2>

        {customer.payments?.length ===
        0 ? (
          <p>
            Δεν υπάρχουν πληρωμές.
          </p>
        ) : (
          <div className="space-y-3">

            {customer.payments
              .sort(
                (a, b) =>
                  new Date(b.date) -
                  new Date(a.date)
              )
              .map(
                (payment, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-xl p-4"
                  >
                    <p>
                      📅 {payment.date}
                    </p>

                    <p>
                      💰{" "}
                      {formatMoney(
                        payment.amount
                      )}
                      €
                    </p>

                    <button
                      onClick={() =>
                        deletePayment(
                          index
                        )
                      }
                      className="mt-3 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                    >
                      🗑 Διαγραφή
                    </button>
                  </div>
                )
              )}

          </div>
        )}

      </div>

    </div>
  );
}