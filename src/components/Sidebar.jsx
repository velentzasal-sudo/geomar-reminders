import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `block p-3 rounded-xl transition ${
      location.pathname === path
        ? "bg-orange-500 text-white"
        : "hover:bg-slate-800"
    }`;

  return (
    
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5">
      <h1 className="text-3xl font-bold mb-10">
        GEOMAR CRM
      </h1>
<button
  onClick={() =>
    supabase.auth.signOut()
  }
  className="w-full mt-4 bg-red-600 hover:bg-red-700 p-3 rounded-xl"
>
  🚪 Logout
</button>
      <nav className="space-y-2">

        <Link
          to="/"
          className={linkClass("/")}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/customers"
          className={linkClass("/customers")}
        >
          👥 Πελάτες
        </Link>

        <Link
          to="/calendar"
          className={linkClass("/calendar")}
        >
          📅 Ημερολόγιο
        </Link>

      </nav>

      <div className="mt-10 border-t border-slate-800 pt-4">
        <p className="text-slate-500 text-sm">
          Geomar CRM v1.0
        </p>
      </div>
    </aside>
  );
}