import {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Search,
  Users,
  MapPin,
  BriefcaseBusiness,
  ExternalLink,
  LoaderCircle,
  FileText,
} from "lucide-react";
import api from "../api/auth";

interface Applicant {
  id: number;
  job_id: number;
  employee_id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  skills: string[] | string | null;
  experience: number | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  applied_at: string;
}

const statuses = [
  "pending",
  "reviewing",
  "shortlisted",
  "rejected",
  "accepted",
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  reviewing: "bg-blue-50 text-blue-700",
  shortlisted: "bg-purple-50 text-purple-700",
  rejected: "bg-red-50 text-red-700",
  accepted: "bg-green-50 text-green-700",
};

export default function Applicants() {
  const {jobId} = useParams<{jobId: string}>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState("Job Applicants");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [pageError, setPageError] = useState("");

  const fetchApplicants = async () => {
    if (!jobId) {
      setPageError("Job ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await api.get(`/applications/job/${jobId}`);
      const data: Applicant[] = response.data.data ?? [];

      setApplicants(data);

      if (data.length > 0) {
        setJobTitle((data[0] as any).job_title || "Job Applicants");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errorMessage ||
        "Unable to load applicants.";

      setPageError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchApplicants();
  }, [jobId]);

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applicants.filter((applicant) => {
      const matchesSearch =
        !query ||
        (applicant.name ?? "").toLowerCase().includes(query) ||
        (applicant.email ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, search, statusFilter]);

  const updateStatus = async (applicationId: number, status: string) => {
    setUpdatingId(applicationId);

    try {
      await api.put(`/applications/${applicationId}/status`, {
        status,
      });

      setApplicants((previous) =>
        previous.map((applicant) =>
          applicant.id === applicationId ? {...applicant, status} : applicant,
        ),
      );

      toast.success("Application status updated.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          "Unable to update status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const countByStatus = (status: string) =>
    applicants.filter((applicant) => applicant.status === status).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/company/jobs"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600"
        >
          <ArrowLeft size={17} />
          Back to Manage Jobs
        </Link>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {jobTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review applicants and manage their application status.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {label: "Total", value: applicants.length},
            {label: "Pending", value: countByStatus("pending")},
            {label: "Reviewing", value: countByStatus("reviewing")},
            {label: "Shortlisted", value: countByStatus("shortlisted")},
            {label: "Accepted", value: countByStatus("accepted")},
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-orange-400">
            <Search size={19} className="text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by applicant name or email..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
            <LoaderCircle size={20} className="animate-spin" />
            Loading applicants...
          </div>
        ) : pageError ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-red-600">{pageError}</p>
            <button
              type="button"
              onClick={() => void fetchApplicants()}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
            <Users size={38} className="mx-auto mb-3 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900">
              No applicants found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {applicant.name || "Unnamed Applicant"}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[applicant.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </div>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {applicant.email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      {applicant.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} />
                          {applicant.location}
                        </span>
                      )}

                      {applicant.experience != null && (
                        <span className="inline-flex items-center gap-1.5">
                          <BriefcaseBusiness size={15} />
                          {applicant.experience} years experience
                        </span>
                      )}
                    </div>

                    {applicant.skills && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(Array.isArray(applicant.skills)
                          ? applicant.skills
                          : applicant.skills.split(",")
                        ).map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {applicant.cover_letter && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Cover Letter
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                          {applicant.cover_letter}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      {applicant.resume_url && (
                        <a
                          href={applicant.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700"
                        >
                          <FileText size={16} />
                          View Resume
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {applicant.applied_at && (
                        <span className="text-xs text-gray-400">
                          Applied{" "}
                          {new Date(applicant.applied_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-48">
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">
                      Update application status
                    </label>

                    <select
                      value={applicant.status}
                      disabled={updatingId === applicant.id}
                      onChange={(event) =>
                        void updateStatus(applicant.id, event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 disabled:opacity-60"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>

                    {updatingId === applicant.id && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <LoaderCircle size={13} className="animate-spin" />
                        Updating...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
