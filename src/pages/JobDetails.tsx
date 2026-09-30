import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  IndianRupee,
  Clock,
} from "lucide-react";
import {useSelector} from "react-redux";
import api from "../api/auth";

interface Job {
  id: number | string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  job_type: string;
  experience_required?: number;
  salary_min?: number | string | null;
  salary_max?: number | string | null;
  skills?: string | string[] | null;
  industry?: string;
  website?: string;
  created_at?: string;
  status?: string;
}

export default function JobDetails() {
  const {id} = useParams();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Unable to load job");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const formatSalary = () => {
    if (job?.salary_min == null && job?.salary_max == null) {
      return "Not disclosed";
    }

    const format = (value: number | string) =>
      Number(value).toLocaleString("en-IN");

    if (job?.salary_min != null && job?.salary_max != null) {
      return `₹${format(job.salary_min)} – ₹${format(job.salary_max)}`;
    }

    if (job?.salary_min != null) {
      return `From ₹${format(job.salary_min)}`;
    }

    return `Up to ₹${format(job!.salary_max!)}`;
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Please log in as an employee to apply.");
      navigate("/login");
      return;
    }

    if (user.role !== "employee") {
      toast.error("Only employee accounts can apply for jobs.");
      return;
    }

    if (!job || applying) return;

    setApplying(true);

    try {
      await api.post("/applications", {
        job_id: job.id,
        cover_letter: coverLetter.trim() || null,
      });

      toast.success("Application submitted successfully!");
      navigate("/employee/applications");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-500">
          This job may have been removed or is unavailable.
        </p>
        <Link
          to="/jobs"
          className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  const skills =
    typeof job.skills === "string"
      ? job.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : job.skills || [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to jobs
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Building2 size={28} />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {job.title}
              </h1>

              <p className="mt-2 text-lg font-medium text-gray-600">
                {job.company_name}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin size={17} className="text-orange-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase size={17} className="text-orange-500" />
                  {job.job_type}
                </span>
                <span className="flex items-center gap-2">
                  <IndianRupee size={17} className="text-orange-500" />
                  {formatSalary()}
                </span>
              </div>

              {job.created_at && (
                <p className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={15} />
                  Posted {new Date(job.created_at).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Job Description
              </h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                {job.description}
              </p>

              <div className="mt-7">
                <h3 className="font-bold text-gray-900">Experience Required</h3>
                <p className="mt-2 text-gray-600">
                  {job.experience_required ?? 0} years
                </p>
              </div>

              {skills.length > 0 && (
                <div className="mt-7">
                  <h3 className="font-bold text-gray-900">Required Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.industry && (
                <div className="mt-7">
                  <h3 className="font-bold text-gray-900">Industry</h3>
                  <p className="mt-2 text-gray-600">{job.industry}</p>
                </div>
              )}

              {job.website && (
                <div className="mt-5">
                  <h3 className="font-bold text-gray-900">Company Website</h3>
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block break-all text-orange-600 hover:underline"
                  >
                    {job.website}
                  </a>
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Interested in this job?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Submit your application to let the company know you're interested.
            </p>

            {user?.role === "employee" ? (
              <>
                <label
                  htmlFor="coverLetter"
                  className="mt-6 block text-sm font-semibold text-gray-700"
                >
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  rows={6}
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder="Introduce yourself and explain why you're suitable for this role..."
                  className="mt-2 w-full resize-y rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {applying ? "Submitting..." : "Apply Now"}
                </button>
              </>
            ) : user?.role === "company" ? (
              <p className="mt-5 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                Company accounts cannot apply for jobs.
              </p>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Log in to Apply
              </button>
            )}

            <Link
              to="/employee/applications"
              className="mt-4 block text-center text-sm font-medium text-orange-600 hover:underline"
            >
              View My Applications
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
