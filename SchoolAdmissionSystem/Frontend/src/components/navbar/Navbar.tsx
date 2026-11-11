import { Link, NavLink } from "react-router";

function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-left"
          aria-label="Go to available classes"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-700 text-sm font-bold text-white">
            OP
          </span>

          <span>
            <span className="block text-sm font-semibold leading-4 text-slate-900">
              School Admission
            </span>
            <span className="text-xs text-slate-500">2026 Academic Year</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink
            to="/my-applications"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            My Applications
          </NavLink>

          <span className="h-5 w-px bg-slate-200" />

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            Admin
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
