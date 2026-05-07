import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { getApiError } from "../api/client.js";
import logoUrl from "../assest/logo.png";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
});

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPwd, setShowPwd] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getApiError(err, "Login failed");
      setError("password", { message: msg });
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] p-0 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-screen overflow-hidden bg-white shadow-[0_24px_80px_rgba(24,78,69,0.12)] sm:min-h-[calc(100vh-3rem)] sm:max-w-6xl sm:rounded-[2rem] lg:grid-cols-[0.9fr_1.4fr]">
        <div className="relative flex min-h-[320px] flex-col overflow-hidden bg-[#39b59d] px-8 py-8 text-white sm:px-12 lg:min-h-full lg:px-14">
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/12" />
          <div className="absolute -right-14 top-40 h-56 w-56 rotate-45 rounded-[2rem] border border-white/10 bg-white/10" />
          <div className="absolute right-16 top-12 h-12 w-12 rotate-45 rounded-md bg-white/10" />
          <div className="absolute bottom-24 right-12 h-10 w-10 rotate-45 rounded-md bg-white/10" />

          <div className="relative inline-flex w-fit items-center rounded-2xl bg-white/90 px-4 py-2 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.6)]">
            <img src={logoUrl} alt="Tasksprint" className="h-11 w-44 object-contain object-left" />
          </div>

          <div className="relative my-auto max-w-sm py-14 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Hello Again!
            </h2>
            <p className="mx-auto mt-6 max-w-xs text-base leading-7 text-white/85 lg:mx-0">
              To keep connected with us please login with your personal info
            </p>
            <Link
              to="/register"
              className="mt-9 inline-flex h-12 min-w-52 items-center justify-center rounded-full border-2 border-white/80 px-8 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[#2da78f]"
            >
              Sign Up
            </Link>
          </div>

          <p className="relative text-xs text-white/70">
            © {new Date().getFullYear()} Tasksprint
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20">
          <div className="w-full max-w-md text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#36b39b]">
            Sign In
          </h1>
          <div className="mt-6 flex justify-center gap-4">
            {["f", "G+", "in"].map((item) => (
              <button
                key={item}
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#36b39b] hover:text-[#36b39b]"
                aria-label={`Continue with ${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-400">
            or use your email account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3 text-left" noValidate>
            <Input
              type="email"
              autoComplete="email"
              placeholder="Email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              className="h-14 rounded-none border-0 bg-slate-50 pl-12 pr-4 shadow-none focus:border-transparent focus:shadow-[inset_0_0_0_2px_rgba(54,179,155,0.18)]"
              {...register("email")}
            />
            <Input
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="pointer-events-auto rounded p-1 hover:bg-slate-100"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              className="h-14 rounded-none border-0 bg-slate-50 pl-12 pr-4 shadow-none focus:border-transparent focus:shadow-[inset_0_0_0_2px_rgba(54,179,155,0.18)]"
              {...register("password")}
            />
            <Button
              type="submit"
              loading={isSubmitting}
              className="mx-auto mt-7 flex h-12 min-w-52 rounded-full bg-[#36b39b] text-sm font-bold uppercase tracking-[0.22em] hover:bg-[#2da78f] active:bg-[#268d7a]"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#36b39b] hover:text-[#2da78f]">
              Create one
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Demo accounts</p>
            <p className="mt-1">admin@pm.app / admin123</p>
            <p>manager@pm.app / manager123</p>
            <p>dev@pm.app / dev12345</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
