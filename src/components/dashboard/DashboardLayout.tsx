import {useState} from "react";
import {Link, NavLink, Outlet, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Search,
  FileText,
  UserRound,
  Plus,
  List,
  Menu,
  LogOut,
} from "lucide-react";
import type {RootState} from "../../store/store";
import {logout} from "../../store/Authslice";
import {useDispatch} from "react-redux";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const isCompany = user?.role === "company";

  const links = isCompany
    ? [
        {label: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard},
        {label: "Post a Job", path: "/company/jobs/new", icon: Plus},
        {label: "Manage Jobs", path: "/company/jobs", icon: List},
        {label: "Company Profile", path: "/company/profile", icon: UserRound},
      ]
    : [
        {
          label: "Dashboard",
          path: "/employee/dashboard",
          icon: LayoutDashboard,
        },
        {label: "Find Jobs", path: "/jobs", icon: Search},
        {
          label: "My Applications",
          path: "/employee/applications",
          icon: FileText,
        },
        {label: "My Profile", path: "/employee/profile", icon: UserRound},
      ];

  const pageTitle =
    links.find((link) => link.path === location.pathname)?.label ??
    (location.pathname.includes("/applicants") ? "Applicants" : "Dashboard");

  function handleLogout() {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          to={isCompany ? "/company/dashboard" : "/employee/dashboard"}
          className="flex h-16 items-center gap-2 border-b border-slate-100 px-6"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <BriefcaseBusiness size={21} />
          </span>
          <span className="text-xl font-extrabold text-slate-900">
            Job<span className="text-orange-500">Connect</span>
          </span>
        </Link>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isCompany ? "Company workspace" : "Employee workspace"}
          </p>

          <nav className="space-y-1">
            {links.map(({label, path, icon: Icon}) => (
              <NavLink
                key={path}
                to={path}
                end={path.endsWith("/dashboard")}
                onClick={() => setSidebarOpen(false)}
                className={({isActive}) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-orange-600"
                  }`
                }
              >
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user?.role || "Account"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900">{pageTitle}</h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back, {user?.name || "User"}
              </p>
            </div>
          </div>

          <Link
            to={isCompany ? "/company/profile" : "/employee/profile"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700 hover:bg-orange-200"
            title="Open profile"
          >
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
