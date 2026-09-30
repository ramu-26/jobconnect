import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  FileText,
  Save,
  LoaderCircle,
} from "lucide-react";

import api from "../api/auth";

interface EmployeeProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  phone: string | null;
  location: string | null;
  skills: string | null;
  experience: number | null;
  resume_url: string | null;
}

export default function EmployeeProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    resume_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      const data: EmployeeProfileData = response.data.data;

      setProfile(data);

      setForm({
        name: data.name ?? "",
        phone: data.phone ?? "",
        location: data.location ?? "",
        skills: data.skills ?? "",
        experience:
          data.experience !== null && data.experience !== undefined
            ? String(data.experience)
            : "",
        resume_url: data.resume_url ?? "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.put("/profile", {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        location: form.location.trim() || null,
        skills: form.skills.trim() || null,
        experience:
          form.experience.trim() === "" ? null : Number(form.experience),
        resume_url: form.resume_url.trim() || null,
      });

      toast.success("Profile updated successfully");
      await fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-orange-500" size={32} />
        <span className="ml-3 text-sm text-gray-500">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-gray-600">Unable to load your profile.</p>
        <button
          onClick={() => navigate("/employee/dashboard")}
          className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <button
          type="button"
          onClick={() => navigate("/employee/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-600">
            JOBCONNECT / ACCOUNT
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and professional details.
          </p>
        </div>

        {/* Profile summary */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <UserRound size={32} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="break-words text-xl font-bold text-gray-900">
              {profile.name}
            </h2>
            <p className="mt-1 break-all text-sm text-gray-500">
              {profile.email}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Profile form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your contact details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={profile.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-gray-50 pl-10`}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter phone number"
                  type="tel"
                  maxLength={20}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  placeholder="e.g. Mumbai, Maharashtra"
                  maxLength={150}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900">
              Professional Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Help companies understand your skills and experience.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Skills
            </label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. React, TypeScript, JavaScript, Tailwind CSS"
              rows={3}
              maxLength={2000}
            />
            <p className="mt-1 text-xs text-gray-400">
              Separate your skills with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Experience (years)
            </label>
            <div className="relative">
              <BriefcaseBusiness
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                placeholder="e.g. 1"
                type="number"
                min="0"
                max="60"
                step="0.5"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Resume URL
            </label>
            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="resume_url"
                value={form.resume_url}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                placeholder="Paste your resume link"
                type="url"
                maxLength={2048}
              />
            </div>

            {form.resume_url.trim() && (
              <a
                href={form.resume_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-orange-600 hover:underline"
              >
                Preview Resume
              </a>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/employee/dashboard")}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-400">
          Member since{" "}
          {new Date(profile.created_at).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
