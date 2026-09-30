import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import type {RootState} from "../store/store";
import api from "../api/auth";
import {
  BriefcaseBusiness,
  Clock,
  CheckCircle2,
  Users,
  Search,
  FileText,
  UserRound,
  ArrowRight,
  MapPin,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

interface Application {
  id: number | string;
  job_id: number | string;
  job_title: string;
  job_location: string;
  job_type: string;
  company_name: string;
  status: string;
  applied_at: string;
}

export default function EmployeeDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchApplications() {
    setLoading(true);
    setError(false);

    try {
      const response = await api.get("/applications/my");
      setApplications(response.data.data || []);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (application) => application.status?.toLowerCase() === "pending",
  ).length;
  const shortlistedApplications = applications.filter(
    (application) => application.status?.toLowerCase() === "shortlisted",
  ).length;
  const acceptedApplications = applications.filter(
    (application) => application.status?.toLowerCase() === "accepted",
  ).length;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Pending",
      value: pendingApplications,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Shortlisted",
      value: shortlistedApplications,
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Accepted",
      value: acceptedApplications,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    reviewing: "bg-blue-50 text-blue-700",
    shortlisted: "bg-green-50 text-green-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4  sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {/* <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-600">JOBCONNECT</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Employee Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-orange-300 sm:inline-flex"
            >
              Home
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header> */}

        {/* Welcome */}
        <section className="mt-1 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-orange-50">Welcome back,</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                {user?.name || user?.email || "Employee"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-orange-50">
                Track your applications, explore new opportunities, and take the
                next step in your career.
              </p>

              <Link
                to="/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                <Search size={17} />
                Find Jobs
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="hidden h-24 w-24 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <BriefcaseBusiness size={48} />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              Application Overview
            </h2>

            <button
              onClick={fetchApplications}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-orange-300 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">{stat.title}</p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {loading ? "—" : stat.value}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/jobs"
              className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Search size={23} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Find Jobs</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Explore available opportunities
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-orange-500"
              />
            </Link>

            <Link
              to="/employee/applications"
              className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <FileText size={23} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  My Applications
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Track your application status
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-orange-500"
              />
            </Link>

            <Link
              to="/employee/profile"
              className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <UserRound size={23} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">My Profile</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update your professional details
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:text-orange-500"
              />
            </Link>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of your latest job applications.
              </p>
            </div>

            <Link
              to="/employee/applications"
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-slate-500">
              Loading applications...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-slate-100 bg-white p-8 text-center">
              <p className="text-slate-600">
                Could not load your applications.
              </p>
              <button
                onClick={fetchApplications}
                className="mt-3 font-semibold text-orange-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-white p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <BriefcaseBusiness size={26} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No applications yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Start exploring jobs and apply for the roles that match your
                skills.
              </p>
              <Link
                to="/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Browse Jobs
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((application) => (
                  <article
                    key={application.id}
                    className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <BriefcaseBusiness size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {application.job_title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {application.company_name}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {application.job_location}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays size={13} />
                            {new Date(
                              application.applied_at,
                            ).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[application.status?.toLowerCase()] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {application.status || "pending"}
                      </span>

                      <Link
                        to={`/jobs/${application.job_id}`}
                        className="text-sm font-semibold text-orange-600 hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-sm text-slate-400">
          JobConnect · Your next opportunity starts here.
        </footer>
      </div>
    </main>
  );
}
