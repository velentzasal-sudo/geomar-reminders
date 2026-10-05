import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import CustomerDetails from "./Pages/CostumerDetails.jsx";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import Calendar from "./Pages/Calendar";
import Payments from "./Pages/Payments";

function App() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const { data, error } =
      await supabase
        .from("customers")
        .select("*")
        .order("customer");

    if (error) {
      console.error(error);
      return;
    }

    const mappedCustomers = (data || []).map(
      (row) => ({
        ...row,

        totalDebt:
          row.total_debt,

        nextCardDate:
          row.next_card_date,

        monthlyCardRepeat:
          row.monthly_card_repeat,

        payments: [],
        expectedPayments: [],
      })
    );

    setRecords(mappedCustomers);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  records={records}
                />
              }
            />

            <Route
              path="/customers"
              element={
                <Customers
                  records={records}
                  setRecords={setRecords}
                />
              }
            />

            <Route
              path="/calendar"
              element={
                <Calendar
                  records={records}
                />
              }
            />

            <Route
              path="/payments"
              element={
                <Payments
                  records={records}
                />
              }
            />

            <Route
              path="/customers/:customerName"
              element={
                <CustomerDetails
                  records={records}
                  setRecords={setRecords}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;