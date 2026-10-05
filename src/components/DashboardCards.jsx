export default function DashboardCards({
  records,
}) {
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

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <p className="text-slate-400">
            📨 Καρτέλες Σήμερα
          </p>

          <h2 className="text-4xl font-bold text-blue-500">
            {todayCards.length}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <p className="text-slate-400">
            ⏰ Αναμενόμενες
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            {
              expectedPayments.length
            }
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <p className="text-slate-400">
            Πελάτες
          </p>

          <h2 className="text-4xl font-bold text-green-500">
            {totalCustomers}
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <p className="text-slate-400">
            Σύνολο €
          </p>

          <h2 className="text-4xl font-bold text-cyan-500">
            {formatMoney(
              totalAmount
            )}
          </h2>
        </div>

      </div>

      <div className="space-y-4">

        <div className="bg-slate-900 border border-blue-700 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-blue-400 mb-3">
            📨 Καρτέλες που
            πρέπει να σταλούν
            σήμερα
          </h3>

          {todayCards.length ===
          0 ? (
            <p>
              Δεν υπάρχουν
              καρτέλες σήμερα.
            </p>
          ) : (
            todayCards.map(
              (
                customer,
                index
              ) => (
                <p
                  key={index}
                >
                  {
                    customer.customer
                  }
                </p>
              )
            )
          )}

        </div>

        <div className="bg-slate-900 border border-orange-700 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-orange-400 mb-3">
            ⏰ Αναμενόμενες
            Πληρωμές
          </h3>

          {expectedPayments.length ===
          0 ? (
            <p>
              Δεν υπάρχουν
              αναμενόμενες
              πληρωμές.
            </p>
          ) : (
            expectedPayments.map(
              (
                payment,
                index
              ) => (
                <p
                  key={index}
                >
                  {
                    payment.customer
                  }
                  {" - "}
                  {formatMoney(
                    payment.amount
                  )}
                  €
                  {" - "}
                  {
                    payment.date
                  }
                </p>
              )
            )
          )}

        </div>

        <div className="bg-slate-900 border border-red-700 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-red-500 mb-3">
            🚨 Ληξιπρόθεσμες
            Πληρωμές
          </h3>

          {overduePayments.length ===
          0 ? (
            <p>
              Δεν υπάρχουν
              ληξιπρόθεσμες
              πληρωμές.
            </p>
          ) : (
            overduePayments.map(
              (
                payment,
                index
              ) => (
                <p
                  key={index}
                >
                  {
                    payment.customer
                  }
                  {" - "}
                  {formatMoney(
                    payment.amount
                  )}
                  €
                  {" - "}
                  {
                    payment.date
                  }
                </p>
              )
            )
          )}

        </div>

      </div>

    </>
  );
}