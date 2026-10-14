import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-xl transition ${
      location.pathname === path
        ? "bg-orange-500 text-white shadow-lg"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-white">
          GEOMAR CRM
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Customer Management
        </p>
      </div>

      <nav className="p-4 space-y-2">

        <Link
          to="/"
          className={linkClass("/")}
        >
          <span className="text-xl">🏠</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/customers"
          className={linkClass("/customers")}
        >
          <span className="text-xl">👥</span>
          <span>Πελάτες</span>
        </Link>

        <Link
          to="/calendar"
          className={linkClass("/calendar")}
        >
          <span className="text-xl">📅</span>
          <span>Ημερολόγιο</span>
        </Link>
       <Link
    to="/loads"
    className={linkClass("/loads")}
  >
    <span className="text-xl">🚚</span>
    <span>Φορτία</span>
  </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-slate-800">

        <button
          onClick={logout}
          className="
            w-full
            bg-red-600
            hover:bg-red-700
            transition
            rounded-xl
            py-3
            font-semibold
            text-white
          "
        >
          🚪 Αποσύνδεση
        </button>

        <div className="mt-4 text-center">
          <p className="text-slate-500 text-xs">
            Geomar CRM
          </p>

          <p className="text-slate-600 text-xs">
            Powered by Supabase
          </p>
        </div>

      </div>

    </aside>
    
  );
}
``