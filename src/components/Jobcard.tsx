import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Building2,
  ArrowUpRight,
} from "lucide-react";

import {Link} from "react-router-dom";

export interface Job {
  id: number | string;
  title: string;
  company_name?: string;
  company?: string | {name?: string};
  location?: string;
  job_type?: string;
  employment_type?: string;
  salary_min?: number | string | null;
  salary_max?: number | string | null;
  salary?: string;
  description?: string;
  created_at?: string;
  posted_at?: string;
  status?: string;
}

interface JobCardProps {
  job: Job;
}

function formatSalary(job: Job) {
  if (job.salary) return job.salary;

  if (job.salary_min != null && job.salary_max != null) {
    return `₹${Number(job.salary_min).toLocaleString("en-IN")} – ₹${Number(
      job.salary_max,
    ).toLocaleString("en-IN")}`;
  }

  if (job.salary_min != null) {
    return `From ₹${Number(job.salary_min).toLocaleString("en-IN")}`;
  }

  if (job.salary_max != null) {
    return `Up to ₹${Number(job.salary_max).toLocaleString("en-IN")}`;
  }

  return "Salary not specified";
}

export default function JobCard({job}: JobCardProps) {
  const companyName =
    job.company_name ||
    (typeof job.company === "string" ? job.company : job.company?.name) ||
    "Company";

  const jobType = job.job_type || job.employment_type || "Full-time";

  const postedDate = job.created_at || job.posted_at;
  const postedLabel = postedDate
    ? new Date(postedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
      aria-label={`View details for ${job.title}`}
    >
      <article className="group h-full rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Building2 size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition group-hover:text-orange-600 sm:text-lg">
              {job.title}
            </h3>
            <p className="mt-1 truncate text-sm text-slate-500">
              {companyName}
            </p>
          </div>

          <ArrowUpRight
            size={20}
            className="shrink-0 text-slate-400 transition group-hover:text-orange-500"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
            <BriefcaseBusiness size={13} />
            {jobType.replaceAll("_", " ")}
          </span>

          {job.location && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
              <MapPin size={13} />
              {job.location}
            </span>
          )}
        </div>

        {job.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
            {job.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-bold text-slate-900">
              {formatSalary(job)}
            </p>

            {postedLabel && (
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <Clock3 size={12} />
                Posted {postedLabel}
              </p>
            )}
          </div>

          <span className="text-sm font-semibold text-orange-600">
            View details →
          </span>
        </div>
      </article>
    </Link>
  );
}
