import {useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowLeft, BriefcaseBusiness, LoaderCircle} from "lucide-react";

import api from "../api/auth";

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

const initialForm: JobForm = {
  title: "",
  description: "",
  location: "",
  job_type: "full-time",
  experience_required: "",
  salary_min: "",
  salary_max: "",
  skills: "",
};

export default function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState<JobForm>(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {name, value} = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      form.salary_min !== "" &&
      form.salary_max !== "" &&
      Number(form.salary_min) > Number(form.salary_max)
    ) {
      toast.error("Minimum salary cannot exceed maximum salary");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        job_type: form.job_type,
        experience_required:
          form.experience_required === ""
            ? null
            : Number(form.experience_required),
        salary_min: form.salary_min === "" ? null : Number(form.salary_min),
        salary_max: form.salary_max === "" ? null : Number(form.salary_max),
        skills: form.skills.trim()
          ? form.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
      };

      await api.post("/jobs", payload);

      toast.success("Job posted successfully!");
      setForm(initialForm);
      navigate("/company/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/company/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-7">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <BriefcaseBusiness size={25} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>

          <p className="mt-2 text-sm text-gray-500">
            Provide the details candidates need to apply for your position.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. React Developer"
              required
              maxLength={150}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Job Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              required
              maxLength={10000}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Mumbai"
                required
                maxLength={150}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job Type *
              </label>
              <select
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Experience Required (years)
              </label>
              <input
                name="experience_required"
                type="number"
                min="0"
                max="60"
                step="0.5"
                value={form.experience_required}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 1"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Salary (₹ per year)
              </label>
              <input
                name="salary_min"
                type="number"
                min="0"
                value={form.salary_min}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 300000"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maximum Salary (₹ per year)
              </label>
              <input
                name="salary_max"
                type="number"
                min="0"
                value={form.salary_max}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 600000"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Required Skills
            </label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className={inputClass}
              placeholder="React, TypeScript, JavaScript, Tailwind CSS"
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-400">
              Separate skills with commas.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/company/dashboard")}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <BriefcaseBusiness size={18} />
              )}
              {saving ? "Posting..." : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
