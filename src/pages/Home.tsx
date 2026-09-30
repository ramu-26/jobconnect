import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  ArrowRight,
  Search,
  Code2,
  Palette,
  BarChart3,
  Headphones,
  Megaphone,
  BriefcaseBusiness,
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

const categories = [
  {label: "Technology", icon: Code2, query: "developer"},
  {label: "Design", icon: Palette, query: "designer"},
  {label: "Marketing", icon: Megaphone, query: "marketing"},
  {label: "Business", icon: BarChart3, query: "business"},
  {label: "Customer Support", icon: Headphones, query: "support"},
  {label: "Other Jobs", icon: BriefcaseBusiness, query: ""},
];

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await api.get("/jobs");
        setJobs(extractJobs(response));
      } catch {
        toast.error("Could not load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadJobs();
  }, []);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());

    navigate(`/jobs?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-medium text-orange-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Find your next opportunity
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find a job that
                <span className="block text-orange-500">
                  moves you forward.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Discover opportunities, explore companies, and take the next
                step in your career with JobConnect.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-orange-100/50 sm:flex sm:items-center sm:gap-2"
              >
                <label className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2">
                  <Search className="shrink-0 text-orange-500" size={21} />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title or keyword"
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    aria-label="Job title or keyword"
                  />
                </label>

                <div className="mx-2 hidden h-8 border-l border-slate-200 sm:block" />

                <label className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2">
                  <span className="shrink-0 text-orange-500">
                    <BriefcaseBusiness size={20} />
                  </span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or location"
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    aria-label="City or location"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 sm:mt-0 sm:w-auto"
                >
                  Search Jobs
                  <ArrowRight size={17} />
                </button>
              </form>

              <p className="mt-4 text-sm text-slate-500">
                Looking to hire?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Create a company account
                </Link>
              </p>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -left-5 top-8 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
              <div className="relative rounded-3xl border border-orange-100 bg-white p-7 shadow-xl shadow-orange-100/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Your next chapter</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Starts here.
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                    <BriefcaseBusiness size={27} />
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {[
                    {
                      title: "Frontend Developer",
                      company: "Technology",
                      tag: "React",
                    },
                    {title: "UI/UX Designer", company: "Design", tag: "Figma"},
                    {
                      title: "Digital Marketing",
                      company: "Marketing",
                      tag: "SEO",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <BriefcaseBusiness size={21} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.company}
                        </p>
                      </div>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-center text-sm text-slate-500">
                  Explore real openings below
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Explore by interest
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Browse job categories
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Find opportunities that match your skills.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              All jobs <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(({label, icon: Icon, query}) => (
              <button
                key={label}
                onClick={() =>
                  navigate(
                    query
                      ? `/jobs?keyword=${encodeURIComponent(query)}`
                      : "/jobs",
                  )
                }
                className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-orange-200 hover:bg-orange-50/50 sm:p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={22} />
                </span>
                <span className="mt-4 block text-sm font-semibold text-slate-800">
                  {label}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Explore jobs
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Updated from your backend
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Featured opportunities
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Explore some of the latest available jobs.
                </p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                View all jobs <ArrowRight size={17} />
              </Link>
            </div>

            {loading ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <BriefcaseBusiness
                  className="mx-auto text-slate-400"
                  size={32}
                />
                <h3 className="mt-3 font-semibold text-slate-800">
                  No jobs available yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  New opportunities will appear here when companies post jobs.
                </p>
                <Link
                  to="/jobs"
                  className="mt-4 inline-flex font-semibold text-orange-600 hover:underline"
                >
                  Browse job listings
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.slice(0, 6).map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs?keyword=${encodeURIComponent(job.title)}`}
                  >
                    <JobCard job={job} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-orange-500 p-7 text-white sm:p-10 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready for your next opportunity?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-orange-50 sm:text-base">
                Create your account and start exploring career opportunities
                with JobConnect.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
          <Link to="/jobs" className="hover:text-orange-600">
            Explore jobs
          </Link>
        </div>
      </footer>
    </div>
  );
}
