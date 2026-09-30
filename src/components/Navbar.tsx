import {Link, NavLink} from "react-router-dom";
import {BriefcaseBusiness, Menu, X} from "lucide-react";
import {useState} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "../store/store";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const dashboardPath =
    user?.role === "company" ? "/company/dashboard" : "/employee/dashboard";

  const navClass = ({isActive}: {isActive: boolean}) =>
    `text-sm font-medium transition ${
      isActive ? "text-orange-600" : "text-slate-600 hover:text-orange-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <BriefcaseBusiness size={21} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Job<span className="text-orange-500">Connect</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to={user ? dashboardPath : "/"} className={navClass}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={navClass}>
            Find Jobs
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              to={dashboardPath}
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200 bg-white p-4 md:hidden">
          <Link
            to={user ? dashboardPath : "/"}
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-orange-50"
          >
            Find Jobs
          </Link>
          {user ? (
            <Link
              to={dashboardPath}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-orange-500 py-2.5 text-center text-sm font-semibold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
