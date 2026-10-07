import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardCards({
  records,
}) {
  const navigate = useNavigate();

  const [showCards, setShowCards] =
    useState(true);

  const [
    showExpected,
    setShowExpected,
  ] = useState(true);

  const [
    showOverdue,
    setShowOverdue,
  ] = useState(false);

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
        Number(
          r.totalDebt || 0
        ),
      0
    );

  const todayCards =
    records.filter(
      (c) =>
        c.nextCardDate === today
    );

  const expectedPayments =
    records.flatMap(
      (customer) =>
        (customer.expectedPayments ||
          [])
          .filter(
            (payment) =>
              payment.date >=
              today
          )
          .map(
            (payment) => ({
              customer:
                customer.customer,
              ...payment,
            })
          )
    );

  const overduePayments =
    records.flatMap(
      (customer) =>
        (customer.expectedPayments ||
          [])
          .filter(
            (payment) =>
              payment.date <
              today
          )
          .map(
            (payment) => ({
              customer:
                customer.customer,
              ...payment,
            })
          )
    );

  return (
    <>
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-900 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Καρτέλες Σήμερα
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {todayCards.length}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Αναμενόμενες
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {expectedPayments.length}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Πελάτες
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalCustomers}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Σύνολο €
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {formatMoney(
              totalAmount
            )}
          </h2>
        </div>

      </div>

      <div className="space-y-4">

        <div className="bg-slate-900 rounded-3xl p-5">

          <button
            onClick={() =>
              setShowCards(
                !showCards
              )
            }
            className="w-full flex justify-between items-center"
          >
            <div className="flex items-center gap-3">

              <span>📨</span>

              <span className="font-semibold">
Επερχόμενες Καρτέλες
</span>

              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                {todayCards.length}
              </span>

            </div>

            <span className="text-slate-500">
              {showCards
                ? "−"
                : "+"}
            </span>
          </button>

          {showCards && (
            <div className="mt-4 space-y-2">

              {todayCards.length === 0 ? (
                <p className="text-slate-400">
                  Δεν υπάρχουν καρτέλες σήμερα.
                </p>
              ) : (
                todayCards.map(
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
                      className="bg-slate-800 hover:bg-slate-700 rounded-xl p-3 cursor-pointer transition"
                    >
                      {customer.customer}
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

              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                {
                  expectedPayments.length
                }
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
                  (
                    payment,
                    index
                  ) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(
                          `/customers/${encodeURIComponent(
                            payment.customer
                          )}`
                        )
                      }
                      className="bg-slate-800 hover:bg-slate-700 rounded-xl p-3 cursor-pointer transition"
                    >
                      <div className="font-medium">
                        {
                          payment.customer
                        }
                      </div>

                      <div className="text-sm text-slate-400">
                        {formatMoney(
                          payment.amount
                        )}
                        €
                        {" • "}
                        {
                          payment.date
                        }
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

              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
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
                  (
                    payment,
                    index
                  ) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(
                          `/customers/${encodeURIComponent(
                            payment.customer
                          )}`
                        )
                      }
                      className="bg-slate-800 hover:bg-slate-700 rounded-xl p-3 cursor-pointer transition"
                    >
                      <div className="font-medium">
                        {
                          payment.customer
                        }
                      </div>

                      <div className="text-sm text-slate-400">
                        {formatMoney(
                          payment.amount
                        )}
                        €
                        {" • "}
                        {
                          payment.date
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