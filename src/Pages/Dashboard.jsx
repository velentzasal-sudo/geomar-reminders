import DashboardCards from "../components/DashboardCards";

export default function Dashboard({
  records,
}) {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const upcomingCards =
    records.filter((customer) => {
      if (!customer.nextCardDate)
        return false;

      const diff =
        Math.ceil(
          (new Date(
            customer.nextCardDate
          ) -
            new Date(today)) /
            (1000 *
              60 *
              60 *
              24)
        );

      return diff >= 0 && diff <= 3;
    });

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">
        Dashboard
      </h1>

      <DashboardCards
        records={records}
      />

      <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-5 mb-8">

        <h2 className="text-xl font-bold text-yellow-400 mb-3">
          🔔 Επερχόμενες Καρτέλες
        </h2>

        {upcomingCards.length ===
        0 ? (
          <p className="text-green-400">
            ✅ Δεν υπάρχουν
            υπενθυμίσεις
          </p>
        ) : (
          <div className="space-y-2">

            {upcomingCards.map(
              (
                customer,
                index
              ) => (
                <div
                  key={index}
                  className="bg-slate-900 rounded-xl p-3"
                >
                  📨{" "}
                  <strong>
                    {
                      customer.customer
                    }
                  </strong>
                  <br />
                  {customer.nextCardDate}
                </div>
              )
            )}

          </div>
        )}

      </div>
    </>
  );
}