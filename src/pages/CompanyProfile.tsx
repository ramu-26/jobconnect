import {useEffect, useState, type FormEvent} from "react";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  UserRound,
  BriefcaseBusiness,
  FileText,
  Save,
  LoaderCircle,
} from "lucide-react";
import api from "../api/auth";

interface CompanyProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  company_name: string | null;
  company_phone: string | null;
  company_location: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
}

interface CompanyProfileForm {
  name: string;
  company_name: string;
  phone: string;
  location: string;
  website: string;
  industry: string;
  description: string;
}

const initialForm: CompanyProfileForm = {
  name: "",
  company_name: "",
  phone: "",
  location: "",
  website: "",
  industry: "",
  description: "",
};

export default function CompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  const [form, setForm] = useState<CompanyProfileForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setPageError("");

      try {
        const response = await api.get("/profile");

        const data: CompanyProfileData = response.data.data ?? response.data;

        setProfile(data);

        setForm({
          name: data.name ?? "",
          company_name: data.company_name ?? "",
          phone: data.company_phone ?? "",
          location: data.company_location ?? "",
          website: data.website ?? "",
          industry: data.industry ?? "",
          description: data.description ?? "",
        });
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          "Unable to load company profile.";

        setPageError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const handleChange = (field: keyof CompanyProfileForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const companyName = form.company_name.trim();
    const phone = form.phone.trim();
    const location = form.location.trim();
    const website = form.website.trim();
    const industry = form.industry.trim();
    const description = form.description.trim();

    if (!name || !companyName || !phone || !location || !industry) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[0-9+\-()\s]{7,20}$/.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (website) {
      try {
        const normalizedWebsite = /^https?:\/\//i.test(website)
          ? website
          : `https://${website}`;

        const parsedWebsite = new URL(normalizedWebsite);

        if (!parsedWebsite.hostname.includes(".") || !parsedWebsite.hostname) {
          throw new Error("Invalid website");
        }
      } catch {
        toast.error(
          "Please enter a valid website URL, such as https://example.com.",
        );
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        name,
        company_name: companyName,
        phone,
        location,
        website: website
          ? /^https?:\/\//i.test(website)
            ? website
            : `https://${website}`
          : "",
        industry,
        description,
      };

      const response = await api.put("/profile", payload);

      setProfile((previous) =>
        previous
          ? {
              ...previous,
              name,
              company_name: companyName,
              company_phone: phone,
              company_location: location,
              website: payload.website,
              industry,
              description,
            }
          : previous,
      );

      setForm({
        name,
        company_name: companyName,
        phone,
        location,
        website: payload.website,
        industry,
        description,
      });

      toast.success(
        response.data.message || "Company profile updated successfully!",
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errorMessage ||
          "Failed to update company profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <LoaderCircle size={20} className="animate-spin" />
          Loading company profile...
        </div>
      </div>
    );
  }

  if (pageError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center">
          <Building2 size={36} className="mx-auto mb-3 text-gray-300" />

          <h1 className="text-lg font-semibold text-gray-900">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {pageError || "Company profile not found."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Try Again
          </button>

          <div>
            <Link
              to="/company/dashboard"
              className="mt-4 inline-block text-sm text-gray-500 hover:text-orange-600"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-7">
          <Link
            to="/company/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Building2 size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Company Profile
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your company information and contact details.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Building2 size={32} />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold text-gray-900">
                {form.company_name || "Your Company"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {form.industry || "Industry not specified"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={15} />
                  {profile.email}
                </span>

                {form.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} />
                    {form.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-gray-900">Basic Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your company name and primary contact person.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className={labelClass}>
                  Company Name <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    required
                    maxLength={150}
                    value={form.company_name}
                    onChange={(event) =>
                      handleChange("company_name", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Contact Person <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="Enter contact person's name"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Registered Email</label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-gray-50 pl-10 text-gray-500`}
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Email cannot be changed from this page.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Industry <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <BriefcaseBusiness
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    required
                    maxLength={100}
                    value={form.industry}
                    onChange={(event) =>
                      handleChange("industry", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="e.g. IT, Healthcare, Finance"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Let candidates know how to find and contact your company.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className={labelClass}>
                  Company Phone <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    required
                    type="tel"
                    maxLength={20}
                    value={form.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Company Location <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    required
                    maxLength={150}
                    value={form.location}
                    onChange={(event) =>
                      handleChange("location", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="e.g. Mumbai, Maharashtra"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Company Website</label>

                <div className="relative">
                  <Globe
                    size={17}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    type="text"
                    maxLength={255}
                    value={form.website}
                    onChange={(event) =>
                      handleChange("website", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="https://www.example.com"
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Include your company's public website, if available.
                </p>
              </div>
            </div>
          </section>

          {/* Company Description */}
          <section className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-gray-900">
                About Your Company
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Introduce your business to potential candidates.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <label className={labelClass}>Company Description</label>

              <div className="relative">
                <FileText
                  size={17}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <textarea
                  rows={6}
                  maxLength={3000}
                  value={form.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  className={`${inputClass} resize-y pl-10`}
                  placeholder="Tell candidates about your company, what you do, and your work culture..."
                />
              </div>

              <p className="mt-1.5 text-right text-xs text-gray-400">
                {form.description.length}/3000 characters
              </p>
            </div>
          </section>

          {/* Save Actions */}
          <div className="flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-end">
            <Link
              to="/company/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
