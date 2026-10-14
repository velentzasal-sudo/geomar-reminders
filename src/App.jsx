import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./Pages/login";
import CustomerDetails from "./Pages/CostumerDetails.jsx";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import Calendar from "./Pages/Calendar";
import Loads from "./Pages/Loads";
import NewLoad from "./Pages/NewLoad";
import LoadDetails from "./Pages/LoadDetails";

function App() {
  const [records, setRecords] =
    useState([]);

  const [session, setSession] =
    useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
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

  const loadData = async () => {
    const {
      data: customers,
      error: customerError,
    } = await supabase
      .from("customers")
      .select("*")
      .order("customer");

    if (customerError) {
      console.error(customerError);
      return;
    }

    const {
      data: payments,
      error: paymentsError,
    } = await supabase
      .from("payments")
      .select("*");

    if (paymentsError) {
      console.error(paymentsError);
      return;
    }

    const {
      data: expectedPayments,
      error: expectedError,
    } = await supabase
      .from("expected_payments")
      .select("*");

console.log("EXPECTED", expectedPayments);

    if (expectedError) {
      console.error(expectedError);
      return;
    }

    const mappedCustomers =
      (customers || []).map(
        (customer) => {

          const customerPayments =
            (payments || [])
              .filter(
                (p) =>
                  p.customer_id ===
                  customer.id
              )
              .map((p) => ({
                id: p.id,
                amount: p.amount,
                date: p.payment_date,
              }));

          const customerExpectedPayments =
            (expectedPayments || [])
              .filter(
                (p) =>
                  p.customer_id ===
                  customer.id
              )
              .map((p) => ({
                id: p.id,
                amount: p.amount,
                date: p.payment_date,
              }));

          return {
            ...customer,

            totalDebt:
              customer.total_debt,

            nextCardDate:
              customer.next_card_date,

            monthlyCardRepeat:
              customer.monthly_card_repeat,

            payments:
              customerPayments,

            expectedPayments:
              customerExpectedPayments,
          };
        }
      );

    setRecords(mappedCustomers);
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
              path="/customers/:customerName"
              element={
                <CustomerDetails
                  records={records}
                  setRecords={setRecords}
                />
              }
            />
            <Route path="/loads" element={<Loads />} />
            <Route path="/loads/new" element={<NewLoad />} />
            <Route path="/loads/:id" element={<LoadDetails />} />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;