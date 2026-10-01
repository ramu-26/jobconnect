import {useState, type FormEvent, type ChangeEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {BriefcaseBusiness} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    company_name: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({...form, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate company details only for company accounts
    if (
      form.role === "company" &&
      (!form.company_name.trim() || !form.phone.trim() || !form.location.trim())
    ) {
      toast.error("Company name, phone, and location are required.");
      return;
    }

    setLoading(true);

    try {
      // Send only the relevant fields for the selected role
      const payload =
        form.role === "company"
          ? form
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            };

      await api.post("/auth/register", payload);

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-4">
          <BriefcaseBusiness className="text-orange-500" size={28} />
          <span className="text-xl font-bold text-slate-900">
            Job<span className="text-orange-500">Connect</span>
          </span>
        </div>
      </header>

      <main className="flex min-h-[85vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join JobConnect to find jobs or hire talented people.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {form.role === "company" ? "Your full name" : "Full name"}
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                I want to
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={`${inputClass} bg-white`}
              >
                <option value="employee">Find a job (Employee)</option>
                <option value="company">Hire people (Company)</option>
              </select>
            </div>

            {form.role === "company" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Company name
                  </label>
                  <input
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter company name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Company phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9+\-\s()]{7,20}"
                    title="Enter a valid phone number"
                    placeholder="Enter company phone"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Company location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter city or location"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
