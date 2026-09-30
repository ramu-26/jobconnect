import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Search,
  Pencil,
  Trash2,
  X,
  Users,
  Plus,
  LoaderCircle,
} from "lucide-react";
import api from "../api/auth";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_required: number | null;
  salary_min: number | null;
  salary_max: number | null;
  skills: string[] | string | null;
  status: string;
  application_count: number;
  created_at: string;
}

interface JobForm {
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_required: string;
  salary_min: string;
  salary_max: string;
  skills: string;
}

const emptyForm: JobForm = {
  title: "",
  description: "",
  location: "",
  job_type: "full-time",
  experience_required: "",
  salary_min: "",
  salary_max: "",
  skills: "",
};

const formatSalary = (min: number | null, max: number | null) => {
  if (min == null && max == null) return "Not specified";

  const format = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  if (min != null && max != null) {
    return `${format(min)} - ${format(max)}`;
  }

  if (min != null) return `${format(min)}+`;
  return `Up to ${format(max!)}`;
};

const formatJobType = (type: string) =>
  type.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Job | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await api.get("/jobs/my");
      setJobs(response.data.data ?? []);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errorMessage ||
        "Unable to load your jobs.";

      setPageError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return jobs;

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query),
    );
  }, [jobs, search]);

  const openEditForm = (job: Job) => {
    setEditingJob(job);

    setForm({
      title: job.title ?? "",
      description: job.description ?? "",
      location: job.location ?? "",
      job_type: job.job_type ?? "full-time",
      experience_required:
        job.experience_required != null ? String(job.experience_required) : "",
      salary_min: job.salary_min != null ? String(job.salary_min) : "",
      salary_max: job.salary_max != null ? String(job.salary_max) : "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : (job.skills ?? ""),
    });
  };

  const closeEditForm = () => {
    setEditingJob(null);
    setForm(emptyForm);
  };

  const handleChange = (field: keyof JobForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingJob) return;

    if (
      form.salary_min.trim() &&
      form.salary_max.trim() &&
      Number(form.salary_min) > Number(form.salary_max)
    ) {
      toast.error("Minimum salary cannot exceed maximum salary.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        job_type: form.job_type,
        experience_required: form.experience_required.trim()
          ? Number(form.experience_required)
          : null,
        salary_min: form.salary_min.trim() ? Number(form.salary_min) : null,
        salary_max: form.salary_max.trim() ? Number(form.salary_max) : null,
        skills: form.skills.trim()
          ? form.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : null,
      };

      const response = await api.put(`/jobs/${editingJob.id}`, payload);

      toast.success(response.data.message || "Job updated successfully!");

      closeEditForm();
      await fetchJobs();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          "Failed to update job.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const job = confirmDelete;
    setDeletingId(job.id);

    try {
      await api.delete(`/jobs/${job.id}`);

      setJobs((previous) => previous.filter((item) => item.id !== job.id));

      if (editingJob?.id === job.id) {
        closeEditForm();
      }

      toast.success("Job deleted successfully!");
      setConfirmDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          "Failed to delete job.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const openJobs = jobs.filter((job) => job.status === "open").length;

  const totalApplications = jobs.reduce(
    (total, job) => total + Number(job.application_count || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/company/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Manage Jobs
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View, update and manage your job postings.
            </p>
          </div>

          <Link
            to="/company/jobs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Post a Job
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                <BriefcaseBusiness size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Jobs</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {openJobs}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <BriefcaseBusiness size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {totalApplications}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <Users size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:border-orange-400">
          <Search size={20} className="shrink-0 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by job title or location..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Jobs */}
        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
            <LoaderCircle className="animate-spin" size={20} />
            Loading your jobs...
          </div>
        ) : pageError ? (
          <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
            <p className="text-sm text-red-600">{pageError}</p>
            <button
              type="button"
              onClick={() => void fetchJobs()}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
            <BriefcaseBusiness
              size={38}
              className="mx-auto mb-3 text-gray-300"
            />

            <h2 className="text-lg font-semibold text-gray-900">
              {search ? "No matching jobs found" : "No jobs posted yet"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try another job title or location."
                : "Post your first job to start receiving applications."}
            </p>

            {!search && (
              <Link
                to="/company/jobs/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Plus size={17} />
                Post a Job
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-orange-200 sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          job.status === "open"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.status
                          ? job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)
                          : "Unknown"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} />
                        {job.location}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <BriefcaseBusiness size={15} />
                        {formatJobType(job.job_type)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Users size={15} />
                        {job.application_count ?? 0} applications
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </p>

                    {job.created_at && (
                      <p className="mt-2 text-xs text-gray-400">
                        Posted{" "}
                        {new Date(job.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEditForm(job)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDelete(job)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-8">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit Job</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the details of your job posting.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditForm}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 p-5 sm:p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <input
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                  placeholder="e.g. React Developer"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                  placeholder="Describe the job responsibilities..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    required
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="e.g. Mumbai"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Job Type *
                  </label>
                  <select
                    required
                    value={form.job_type}
                    onChange={(e) => handleChange("job_type", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Experience Required (years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.experience_required}
                    onChange={(e) =>
                      handleChange("experience_required", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="e.g. 1"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Minimum Salary (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.salary_min}
                    onChange={(e) => handleChange("salary_min", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="e.g. 300000"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Maximum Salary (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.salary_max}
                    onChange={(e) => handleChange("salary_max", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="e.g. 500000"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Required Skills
                  </label>
                  <input
                    value={form.skills}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
                    placeholder="React, TypeScript, Tailwind"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={17} className="animate-spin" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Delete this job?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {confirmDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deletingId !== null}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deletingId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId !== null && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {deletingId !== null ? "Deleting..." : "Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
