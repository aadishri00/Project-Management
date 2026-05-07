import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Users as UsersIcon,
  TrendingUp,
  ArrowRight,
  Inbox,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import { StatusPill, PriorityPill } from "../components/ui/StatusBadge.jsx";
import { dashboardApi } from "../api/dashboard.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { fmtRelative, STATUS_LABEL } from "../utils/format.js";

const STATUS_COLORS_HEX = {
  todo: "#94a3b8",
  in_progress: "#06b6d4",
  review: "#f59e0b",
  done: "#10b981",
};

function StatCard({ label, value, icon: Icon, accent = "brand", trend, hint }) {
  const accents = {
    brand: {
      icon: "bg-brand-600 text-white",
      glow: "bg-brand-100",
      border: "border-brand-200",
    },
    emerald: {
      icon: "bg-emerald-600 text-white",
      glow: "bg-emerald-100",
      border: "border-emerald-200",
    },
    amber: {
      icon: "bg-amber-500 text-slate-950",
      glow: "bg-amber-100",
      border: "border-amber-200",
    },
    rose: {
      icon: "bg-rose-600 text-white",
      glow: "bg-rose-100",
      border: "border-rose-200",
    },
  };
  const a = accents[accent];
  return (
    <Card className={`overflow-hidden border-2 ${a.border}`}>
      <CardContent className="relative p-5">
        <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${a.glow}`} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              {value}
            </p>
            {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
          </div>
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${a.icon} shadow-soft`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-16 mt-3" />
        <Skeleton className="h-3 w-20 mt-3" />
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.stats,
  });

  const pieData = data
    ? Object.entries(data.tasks.byStatus).map(([k, v]) => ({
        name: STATUS_LABEL[k] || k,
        value: v,
        key: k,
      }))
    : [];

  const totalForPie = pieData.reduce((sum, p) => sum + p.value, 0);
  const openTasks = data
    ? data.tasks.byStatus.todo + data.tasks.byStatus.in_progress + data.tasks.byStatus.review
    : 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_70px_-35px_rgba(0,0,0,0.7)] sm:p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(22,184,163,0.35),transparent_22rem)]" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-brand-500/20" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-300">
              Tasksprint command center
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Hi, {user?.name?.split(" ")[0] || "there"}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Plan the next sprint, track team movement, and spot overdue work before it becomes noise.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur">
            <Link to="/projects" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-brand-300">
              Projects
            </Link>
            <Link to="/tasks" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-brand-300">
              Tasks
            </Link>
            <Link to="/profile" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-brand-300">
              Profile
            </Link>
          </div>
        </div>
      </section>

      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load dashboard"
          description="Please check your connection or try again."
          action={
            <button
              onClick={() => refetch()}
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              Retry
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Active projects"
                  value={data.projects.active}
                  hint={`${data.projects.total} total`}
                  icon={FolderKanban}
                  accent="brand"
                />
                <StatCard
                  label="Open tasks"
                  value={
                    openTasks
                  }
                  hint={`${data.tasks.total} total tasks`}
                  icon={CheckSquare}
                  accent="emerald"
                />
                <StatCard
                  label="Overdue"
                  value={data.tasks.overdue}
                  hint="Past due date, not completed"
                  icon={AlertTriangle}
                  accent="rose"
                />
                {hasRole("admin", "manager") ? (
                  <StatCard
                    label="Team members"
                    value={data.users ?? 0}
                    icon={UsersIcon}
                    accent="amber"
                  />
                ) : (
                  <StatCard
                    label="My tasks"
                    value={data.tasks.mine}
                    hint="Assigned to you"
                    icon={UsersIcon}
                    accent="amber"
                  />
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.85fr]">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-950 to-brand-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-brand-200">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Completion trend</CardTitle>
                    <p className="mt-1 text-sm text-white/65">
                      Tasks completed in the last 7 days
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isLoading ? (
                  <Skeleton className="h-72 w-full rounded-3xl" />
                ) : data.completionTrend.every((d) => d.completed === 0) ? (
                  <EmptyState
                    icon={TrendingUp}
                    title="No completed tasks yet"
                    description="Mark tasks as Done to see your team's velocity here."
                    className="min-h-72 border-0 bg-brand-50/40 py-8"
                  />
                ) : (
                  <div className="h-72 rounded-3xl bg-gradient-to-br from-brand-50 to-white p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.completionTrend}>
                        <defs>
                          <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#16b8a3" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#16b8a3" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#ccfbf1" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(v) => v.slice(5)}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          width={28}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 16,
                            border: "1px solid #a7f3df",
                            fontSize: 12,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#0d9488"
                          strokeWidth={2.5}
                          fill="url(#fillCompleted)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-white to-brand-50">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Tasks by status</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">Distribution snapshot</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isLoading ? (
                  <Skeleton className="h-72 w-full rounded-3xl" />
                ) : totalForPie === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No tasks yet"
                    description="Create your first task to see the distribution."
                    className="min-h-72 border-0 bg-brand-50/40 py-8"
                  />
                ) : (
                  <div>
                    <div className="h-56 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={58}
                            outerRadius={88}
                            paddingAngle={4}
                            stroke="#ffffff"
                            strokeWidth={4}
                          >
                            {pieData.map((entry) => (
                              <Cell
                                key={entry.key}
                                fill={STATUS_COLORS_HEX[entry.key] || "#94a3b8"}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: 16,
                              border: "1px solid #a7f3df",
                              fontSize: 12,
                            }}
                          />
                          <Legend
                            iconType="circle"
                            formatter={(v) => <span className="text-xs text-slate-600">{v}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {pieData.map((item) => (
                        <div key={item.key} className="rounded-2xl bg-slate-50 p-3">
                          <span
                            className="mb-2 block h-2 w-8 rounded-full"
                            style={{ background: STATUS_COLORS_HEX[item.key] }}
                          />
                          <p className="text-xs font-semibold text-slate-500">{item.name}</p>
                          <p className="text-xl font-black text-slate-950">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-white/80">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Latest task updates across your projects
                </p>
              </div>
              <Link
                to="/tasks"
                className="text-sm font-medium text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {isLoading ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                  ))}
                </div>
              ) : data.recentTasks.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="Nothing here yet"
                  description="Tasks you create will appear in this feed."
                  className="border-0 bg-transparent"
                />
              ) : (
                <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {data.recentTasks.map((t) => (
                    <li
                      key={t._id}
                      className="rounded-2xl border border-brand-100 bg-gradient-to-br from-white to-brand-50/40 p-4 transition hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span
                            className="mb-3 block h-2 w-10 rounded-full"
                            style={{ background: t.project?.color || "#16b8a3" }}
                          />
                          <p className="line-clamp-2 text-sm font-black text-slate-950">
                            {t.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {t.project?.name} · {fmtRelative(t.updatedAt)}
                          </p>
                        </div>
                        {t.assignee ? (
                          <Avatar name={t.assignee.name} src={t.assignee.avatarUrl} size="sm" />
                        ) : (
                          <div className="h-8 w-8 rounded-full border border-dashed border-slate-300" />
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <PriorityPill priority={t.priority} />
                        <StatusPill status={t.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
