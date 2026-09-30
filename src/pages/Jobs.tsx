import {useCallback, useEffect, useState, type FormEvent} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  BriefcaseBusiness,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/auth";
import Navbar from "../components/Navbar";
import JobCard, {type Job} from "../components/Jobcard";

function extractJobs(response: any): Job[] {
  const result = response.data?.data ?? response.data;
  const jobs = Array.isArray(result) ? result : result?.jobs;
  return Array.isArray(jobs) ? jobs : [];
}

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("job_type") || "");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const params: Record<string, string> = {};

      if (keyword.trim()) params.search = keyword.trim();
      if (location.trim()) params.location = location.trim();
      if (jobType) params.job_type = jobType;

      const response = await api.get("/jobs", {params});
      setJobs(extractJobs(response));
    } catch {
      setError(true);
      toast.error("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword, location, jobType]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (jobType) params.set("job_type", jobType);

    setSearchParams(params);
    void loadJobs();
  }

  function clearFilters() {
    setKeyword("");
    setLocation("");
    setJobType("");
    setSearchParams({});
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Your next opportunity
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Find your next job
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Search open positions and discover opportunities that match your
            skills, interests, and career goals.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_1fr_190px_auto]"
          >
            <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-orange-400">
              <Search size={19} className="shrink-0 text-orange-500" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                aria-label="Search keyword"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-orange-400">
              <MapPin size={19} className="shrink-0 text-orange-500" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or location"
                aria-label="Search location"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl px-3 py-2">
              <SlidersHorizontal
                size={17}
                className="shrink-0 text-orange-500"
              />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                aria-label="Employment type"
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="">All job types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </label>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Search size={17} />
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Available jobs</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading opportunities..."
                : `${jobs.length} ${jobs.length === 1 ? "job" : "jobs"} found`}
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-slate-500 transition hover:text-orange-600"
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
            <h3 className="font-semibold text-slate-900">
              Could not load jobs
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Check your backend connection and try again.
            </p>
            <button
              onClick={() => void loadJobs()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <BriefcaseBusiness size={36} className="mx-auto text-slate-400" />
            <h3 className="mt-4 font-semibold text-slate-900">
              No matching jobs found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another keyword or location, or clear your filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-orange-600 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
