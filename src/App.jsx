import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./Pages/login";
import CustomerDetails from "./Pages/CostumerDetails.jsx";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import Calendar from "./Pages/Calendar";

function App() {
  const [records, setRecords] =
    useState([]);

  const [session, setSession] =
    useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(
          data.session
        );
      });

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );

    return () => {
      authListener.subscription.unsubscribe();
    };
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

    const mappedCustomers =
      (data || []).map(
        (row) => ({
          ...row,

          totalDebt:
            row.total_debt,

          nextCardDate:
            row.next_card_date,

          monthlyCardRepeat:
            row.monthly_card_repeat,
        })
      );

    setRecords(
      mappedCustomers
    );
  };

  if (!session) {
    return <Login />;
  }

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
                  setRecords={
                    setRecords
                  }
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
              path="/customers/:customerName"
              element={
                <CustomerDetails
                  records={records}
                  setRecords={
                    setRecords
                  }
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