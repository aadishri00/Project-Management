import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Facebook,
  Github,
  Instagram,
  KanbanSquare,
  Layers3,
  ShieldCheck,
  Sparkles,
  Twitter,
  Zap,
  Youtube,
} from "lucide-react";

import logoUrl from "../assest/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  {
    icon: KanbanSquare,
    title: "Visual task boards",
    text: "Move work from idea to done with clean project boards, status columns, and ownership.",
  },
  {
    icon: BarChart3,
    title: "Live progress view",
    text: "Understand completed work, overdue items, and team load without digging through spreadsheets.",
  },
  {
    icon: ShieldCheck,
    title: "Role based control",
    text: "Admins, managers, and members get the right access for safer team collaboration.",
  },
  {
    icon: Clock3,
    title: "Deadline clarity",
    text: "Due dates, priorities, and recent activity help teams stay aligned before work slips.",
  },
];

const plans = [
  ["Starter", "For personal planning", "Project boards", "Task priorities", "Team overview"],
  ["Team", "For growing teams", "Everything in Starter", "Manager controls", "Analytics dashboard"],
  ["Business", "For serious delivery", "Role permissions", "Project tracking", "Priority support"],
];

const socials = [
  { icon: Facebook, label: "Facebook", color: "bg-blue-600" },
  { icon: Twitter, label: "Twitter", color: "bg-sky-500" },
  { icon: Instagram, label: "Instagram", color: "bg-pink-600" },
  { icon: Youtube, label: "YouTube", color: "bg-red-600" },
  { icon: Github, label: "GitHub", color: "bg-slate-600" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4fbf8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-[#f4fbf8]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Tasksprint" className="h-12 w-48 object-contain object-left" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#features" className="hover:text-brand-700">Features</a>
            <a href="#workflow" className="hover:text-brand-700">Workflow</a>
            <a href="#pricing" className="hover:text-brand-700">Plans</a>
            <a href="#contact" className="hover:text-brand-700">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_32px_-18px_rgba(13,148,136,0.8)] transition hover:bg-brand-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full border border-brand-200 px-5 py-2.5 text-sm font-bold text-brand-800 transition hover:border-brand-600 hover:bg-white sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_32px_-18px_rgba(13,148,136,0.8)] transition hover:bg-brand-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#39b59d]">
          <div className="absolute left-8 top-16 hidden h-40 w-40 rounded-full border border-white/20 lg:block" />
          <div className="absolute right-8 top-24 hidden grid-cols-5 gap-3 opacity-30 lg:grid">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-slate-950" />
            ))}
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-brand-900">
                <Sparkles className="h-4 w-4 text-brand-700" />
                Project planning that feels fast
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Refine projects. Simplify workflows.
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/85">
                Tasksprint brings projects, tasks, teams, roles, and progress reports into one clean workspace built for student and team submissions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-brand-800"
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-brand-800"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.7)]">
                  <p className="text-sm font-bold text-slate-500">Active workspace</p>
                  <p className="mt-4 text-5xl font-black">200k</p>
                  <p className="mt-2 text-sm text-slate-500">Tasks organized with clarity.</p>
                </div>
                <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_-35px_rgba(0,0,0,0.7)] sm:translate-y-12">
                  <Layers3 className="h-9 w-9 text-brand-300" />
                  <p className="mt-10 text-xl font-black">Coordinate every moving part.</p>
                </div>
                <div className="rounded-[2rem] border-2 border-brand-900 bg-[#ecfdf8] p-6 sm:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">Today’s sprint</p>
                      <p className="mt-1 text-2xl font-black">Design, build, submit.</p>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white">
                      <Zap className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2">
                    {["Create project", "Assign team", "Track progress"].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold">
                        <CheckCircle2 className="h-4 w-4 text-brand-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Powerful features</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Everything your project needs</h2>
            <p className="mt-3 text-slate-600">Built around the actual workflow: plan, assign, execute, review, and report.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-[2rem] border border-slate-950/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="bg-slate-950 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-300">Workflow</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">From messy ideas to a finished dashboard.</h2>
              <p className="mt-4 leading-7 text-slate-300">
                Tasksprint connects your public presentation page with a protected dashboard, project area, task board, team page, and profile settings.
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-400 px-6 py-3 text-sm font-black text-slate-950">
                Open workspace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Dashboard overview", "Project management", "Task board", "Team controls"].map((item, index) => (
                <div key={item} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <span className="text-4xl font-black text-brand-300">0{index + 1}</span>
                  <p className="mt-8 text-xl font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-black tracking-tight">Choose your path</h2>
            <p className="mt-3 text-slate-600">Use this section as a polished project presentation block.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div key={plan[0]} className={`rounded-[2rem] border p-6 ${index === 1 ? "border-slate-950 bg-slate-950 text-white" : "border-slate-950/10 bg-white"}`}>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-500">{plan[0]}</p>
                <h3 className="mt-3 text-2xl font-black">{plan[1]}</h3>
                <div className="mt-6 space-y-3">
                  {plan.slice(2).map((item) => (
                    <p key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-brand-500" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-[#39b59d]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="text-3xl font-black text-white">Ready to submit a sharper project?</h2>
              <p className="mt-2 font-medium text-white/85">Start with the public page, then continue into the dashboard.</p>
            </div>
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white">
              Continue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#232323] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <img
            src={logoUrl}
            alt="Tasksprint"
            className="h-12 w-52 rounded-2xl bg-white object-contain px-4 py-2"
          />

          <div className="mt-6 flex items-center justify-center gap-3">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className={`grid h-9 w-9 place-items-center rounded-full ${social.color} text-white transition hover:-translate-y-1`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Need Help?</a>
            <a href="#workflow" className="hover:text-white">Content Guide</a>
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-white">Signup</Link>
          </div>

          <p className="mt-7 text-xs text-slate-500">
            © {new Date().getFullYear()} <span className="font-bold text-brand-400">Tasksprint</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
