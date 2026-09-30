import {useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {BriefcaseBusiness} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/auth";
import {setCredentials, type User} from "../store/Authslice";
import type {AppDispatch} from "../store/store";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const result = response.data?.data ?? response.data;
      const token = result.token ?? result.accessToken;
      const user = result.user ?? result.profile;

      if (!token || !user?.role) {
        throw new Error("Unexpected login response from server.");
      }

      dispatch(
        setCredentials({
          token,
          user: user as User,
        }),
      );

      toast.success("Login successful!");

      if (user.role === "employee") {
        navigate("/employee/dashboard");
      } else if (user.role === "company") {
        navigate("/company/dashboard");
      } else {
        toast.error("Your account has an unsupported role.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  }

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
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Log in to continue to your JobConnect account.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
