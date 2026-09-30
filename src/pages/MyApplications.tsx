import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {ArrowLeft, Briefcase, MapPin, CalendarDays} from "lucide-react";
import api from "../api/auth";

interface Application {
  id: number | string;
  job_id: number | string;
  job_title: string;
  job_location: string;
  job_type: string;
  company_name: string;
  status: string;
  applied_at: string;
  cover_letter?: string | null;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  reviewing: "bg-blue-50 text-blue-700",
  shortlisted: "bg-green-50 text-green-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function MyApplications() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "employee") {
      toast.error("This page is only available to employees.");
      navigate("/");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my");
        setApplications(response.data.data || []);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate]);

  if (!user || user.role !== "employee") return null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Browse Jobs
        </Link>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Applications
          </h1>
          <p className="mt-2 text-gray-500">
            Track the jobs you've applied for and check their status.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center">
            <Briefcase className="mx-auto text-orange-500" size={42} />
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No applications yet
            </h2>
            <p className="mt-2 text-gray-500">
              Find a job that matches your skills and apply.
            </p>
            <Link
              to="/jobs"
              className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {application.job_title}
                    </h2>
                    <p className="mt-1 font-medium text-gray-600">
                      {application.company_name}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        {application.job_location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={16} />
                        {application.job_type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={16} />
                        Applied{" "}
                        {new Date(application.applied_at).toLocaleDateString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      statusStyles[application.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                {application.cover_letter && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Your Cover Letter
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {application.cover_letter}
                    </p>
                  </div>
                )}

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <Link
                    to={`/jobs/${application.job_id}`}
                    className="text-sm font-semibold text-orange-600 hover:underline"
                  >
                    View Job Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
