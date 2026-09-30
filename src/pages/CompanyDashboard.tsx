import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {
  BriefcaseBusiness,
  Users,
  Clock,
  Plus,
  ArrowUpRight,
  Building2,
  LoaderCircle,
} from "lucide-react";

import api from "../api/auth";
import type {RootState} from "../store/store";

interface Job {
  id: number;
  title: string;
  location: string;
  job_type: string;
  status: string;
  application_count?: number;
  created_at?: string;
}

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const jobsResponse = await api.get("/jobs/my");

      const jobData: Job[] = jobsResponse.data.data ?? [];
      setJobs(jobData);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load company dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = jobs.length;
  const openJobs = jobs.filter((job) => job.status === "open").length;
  const totalApplications = jobs.reduce(
    (total, job) => total + Number(job.application_count ?? 0),
    0,
  );

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
      description: "Jobs posted by your company",
    },
    {
      label: "Open Jobs",
      value: openJobs,
      icon: Building2,
      description: "Currently open postings",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      icon: Users,
      description: "Applications received",
    },
    {
      label: "Closed Jobs",
      value: totalJobs - openJobs,
      icon: Clock,
      description: "Jobs not currently open",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin text-orange-500" size={32} />
        <span className="ml-3 text-sm text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      {/* <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            Job<span className="text-orange-500">Connect</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/company/profile")}
              className=" items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex"
            >
              <Building2 size={17} />
              Company Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header> */}

      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        {/* Welcome section */}
        <section className="mb-8 flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-medium text-white/80">
              COMPANY WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome, {user?.name || "Company"}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Manage your job postings, track applications, and connect with
              potential candidates.
            </p>
          </div>

          <button
            onClick={() => navigate("/company/jobs/new")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50"
          >
            <Plus size={18} />
            Post a Job
          </button>
        </section>

        {/* Statistics */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A summary of your recruitment activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                      <Icon size={22} />
                    </div>

                    <ArrowUpRight size={18} className="text-gray-400" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent job postings */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Recent Jobs
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review your latest job postings.
              </p>
            </div>

            <button
              onClick={() => navigate("/company/jobs")}
              className="shrink-0 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              View all
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-12 text-center">
              <BriefcaseBusiness size={36} className="mx-auto text-gray-300" />
              <h3 className="mt-3 font-semibold text-gray-800">
                No jobs posted yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first job posting to start receiving applications.
              </p>

              <button
                onClick={() => navigate("/company/jobs/new")}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Post your first job
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {job.location || "Location not specified"}
                      {" · "}
                      {job.job_type || "Job type not specified"}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {job.application_count ?? 0} applications
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.status === "open"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {job.status}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/company/jobs/${job.id}/applicants`)
                      }
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600"
                    >
                      Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
