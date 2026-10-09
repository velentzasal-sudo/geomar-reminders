import { useEffect, useState } from "react";  
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function CustomerDetails({
  records,
  setRecords,
}) {
  const [payments, setPayments] =
  useState([]);

const [
  expectedPayments,
  setExpectedPayments,
] = useState([]);
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
 const loadPayments = async () => {
  const { data, error } =
    await supabase
      .from("payments")
      .select("*")
      .eq(
        "customer_id",
        customer.id
      )
      .order("payment_date", {
        ascending: false,
      });

  if (!error) {
    setPayments(
      (data || []).map((p) => ({
        id: p.id,
        amount: p.amount,
        date: p.payment_date,
      }))
    );
  }
};

const loadExpectedPayments = async () => {
  const { data, error } =
    await supabase
      .from("expected_payments")
      .select("*")
      .eq(
        "customer_id",
        customer.id
      )
      .order("payment_date", {
        ascending: true,
      });

  if (!error) {
    setExpectedPayments(
      (data || []).map((p) => ({
        id: p.id,
        amount: p.amount,
        date: p.payment_date,
      }))
    );
  }
  };
  
const [
  monthlyCardRepeat,
  setMonthlyCardRepeat,
] = useState(
  customer?.monthlyCardRepeat ||
    false
);

  
useEffect(() => {
  if (!customer?.id) return;

  loadPayments();
  loadExpectedPayments();
}, [customer?.id]);

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

 const totalPaid = payments.reduce(
  (sum, payment) =>
    sum + Number(payment.amount || 0),
  0
);

const remainingDebt =
  Number(customer.totalDebt || 0) -
  totalPaid;

const addPayment = async () => {
  if (!paymentAmount || !paymentDate) return;

  const amount = Number(paymentAmount);

  const { error } = await supabase
    .from("payments")
    .insert([
      {
        customer_id: customer.id,
        amount,
        payment_date: paymentDate,
      },
    ]);

  if (error) {
    console.error(error);
    alert(JSON.stringify(error));
    return;
  }

  const updated = [...records];

  const customerIndex = records.findIndex(
    (c) => c.id === customer.id
  );

  updated[customerIndex] = {
    ...updated[customerIndex],

    payments: [
      ...(updated[customerIndex].payments || []),
      {
        amount,
        date: paymentDate,
      },
    ],
  };

  setRecords(updated);

  setPaymentAmount("");
  setPaymentDate("");

  await loadPayments();
};

  const deletePayment = async (
  paymentId
) => {
  if (
    !window.confirm(
      "Διαγραφή πληρωμής;"
    )
  )
    return;

  const { error } =
    await supabase
      .from("payments")
      .delete()
      .eq("id", paymentId);

  if (error) {
    console.error(error);
    return;
  }

  await loadPayments();
};
const addExpectedPayment = async () => {
  if (
    !expectedAmount ||
    !expectedDate
  )
    return;

  const { error } =
    await supabase
      .from("expected_payments")
      .insert([
        {
          customer_id:
            customer.id,
          amount: Number(
            expectedAmount
          ),
          payment_date:
            expectedDate,
        },
      ]);

  if (error) {
    console.error(error);
    alert(JSON.stringify(error));
    return;
  }

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
  await loadExpectedPayments();
};

const completeExpectedPayment =
  async (payment) => {
    const { error: insertError } =
      await supabase
        .from("payments")
        .insert([
          {
            customer_id:
              customer.id,
            amount:
              payment.amount,
            payment_date:
              payment.date,
          },
        ]);

    if (insertError) {
      console.error(insertError);
      return;
    }

    const { error: deleteError } =
      await supabase
        .from(
          "expected_payments"
        )
        .delete()
        .eq("id", payment.id);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    await loadPayments();
    await loadExpectedPayments();
  };
const deleteExpectedPayment =
  async (paymentId) => {
    if (
      !window.confirm(
        "Διαγραφή αναμενόμενης πληρωμής;"
      )
    )
      return;

    const { error } =
      await supabase
        .from(
          "expected_payments"
        )
        .delete()
        .eq("id", paymentId);

    if (error) {
      console.error(error);
      return;
    }

    await loadExpectedPayments();
  };

  const saveCardDate = async () => {
  const { error } =
    await supabase
      .from("customers")
      .update({
        next_card_date: cardDate,
        monthly_card_repeat:
          monthlyCardRepeat,
      })
      .eq("id", customer.id);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  const updated = [...records];

  const customerIndex =
    records.findIndex(
      (c) =>
        c.id === customer.id
    );

  updated[customerIndex] = {
    ...updated[customerIndex],
    nextCardDate: cardDate,
    monthlyCardRepeat,
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
  💸 Τρέχον Υπόλοιπο:
  {formatMoney(remainingDebt)} €
</div>

<div className="bg-green-600 px-4 py-2 rounded-xl">
  ✅ Πληρωμές CRM:
  {formatMoney(totalPaid)} €
</div>

<div className="bg-blue-600 px-4 py-2 rounded-xl">
  📨 Καρτέλα:
  {customer.nextCardDate || "Δεν ορίστηκε"}
</div>

        </div>

        <div className="bg-slate-800 rounded-xl p-4 mt-4">

          <h3 className="font-bold mb-3">
            📝 Σημειώσεις
          </h3>

          <textarea
            value={notes}
            onChange={async (e) => {
  const value = e.target.value;

  setNotes(value);

  const { error } =
    await supabase
      .from("customers")
      .update({
        notes: value,
      })
      .eq("id", customer.id);

  if (error) {
    console.error(error);
  }

  const updated = [...records];

  const customerIndex =
    records.findIndex(
      (c) =>
        c.id === customer.id
    );

  updated[customerIndex] = {
    ...updated[customerIndex],
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

  <div className="bg-slate-700 rounded-xl p-3 mt-3">

    <label className="flex items-center gap-3 cursor-pointer">

      <input
        type="checkbox"
        checked={monthlyCardRepeat}
        onChange={(e) =>
          setMonthlyCardRepeat(
            e.target.checked
          )
        }
      />

      <span>
        🔁 Μηνιαία επανάληψη καρτέλας
      </span>

    </label>

  </div>

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
<button
  onClick={async () => {
    if (
      !window.confirm(
        `Διαγραφή πελάτη "${customer.customer}";`
      )
    )
      return;

    const { error } =
      await supabase
        .from("customers")
        .delete()
        .eq("id", customer.id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setRecords(
      records.filter(
        (c) =>
          c.id !== customer.id
      )
    );

    navigate("/customers");
  }}
  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl ml-3"
>
  🗑 Διαγραφή Πελάτη
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

          {expectedPayments 
          
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

  <div className="flex gap-2 mt-3">

    <button
      onClick={() =>
completeExpectedPayment(
payment
)
}
      className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
    >
      ✅ Ολοκληρώθηκε
    </button>

    <button
      onClick={() =>
deleteExpectedPayment(
payment.id
)
}
      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
    >
      🗑 Διαγραφή
    </button>

  </div>

</div>

              )
            )}

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          Ιστορικό Πληρωμών
        </h2>

        {payments.length === 0 ? (
          <p>
            Δεν υπάρχουν πληρωμές.
          </p>
        ) : (
          <div className="space-y-3">

            {payments 
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
  deletePayment(payment.id)
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
